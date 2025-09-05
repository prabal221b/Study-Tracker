# api/views.py
import logging
import json
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CourseRoadmapSerializer, TopicProgressSerializer
from .models import CourseRoadmap, TopicProgress
from .services import mongo_service

logger = logging.getLogger(__name__)
User = get_user_model()


class HomePage(APIView):
    def get(self, request):
        html = """
        <h1>Welcome to the Home Page</h1>
        <p><a href='/api/register/'>Register</a> | <a href='/api/token/'>Login</a></p>
        """
        return HttpResponse(html)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                logger.exception("Error during registration")
                return Response({"message": "Registration failed", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"Dashboard accessed by {request.user.username}")
        return Response({
            "message": f"Welcome {request.user.username}! Select a technology and difficulty to generate a roadmap."
        })


class SaveRoadmap(APIView):
   
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        technology_name = data.get("technology_name")
        roadmap = data.get("roadmap")

        if not technology_name or not roadmap:
            return Response({"success": False, "error": "Missing technology_name or roadmap"}, status=400)

        username = request.user.username


        try:
            mongo_doc = mongo_service.save_roadmap(username, technology_name, roadmap)
        except Exception as e:
            logger.exception("Failed to save roadmap to Mongo")
            return Response({"success": False, "error": "Failed to save roadmap"}, status=500)

      
        try:
            CourseRoadmap.objects.update_or_create(
                user=request.user,
                technology_name=technology_name,
                defaults={"roadmap": roadmap},
            )
        except Exception:
            logger.exception("Warning: Failed to update CourseRoadmap Django model (non-fatal)")

        return Response({
            "success": True,
            "message": f"Roadmap saved for {technology_name}",
            "course_mongo_id": mongo_doc.get("_id")
        }, status=200)


class GetUserRoadmaps(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.username
        try:
            roadmaps = mongo_service.get_roadmaps_for_user(username)
          
            return Response(roadmaps, status=status.HTTP_200_OK)
        except Exception:
            logger.exception("Failed to fetch user roadmaps from Mongo")
            return Response({"error": "Failed to fetch roadmaps"}, status=500)


class GetRoadmapDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            roadmap_doc = mongo_service.get_roadmap(roadmap_id=course_id)
            if not roadmap_doc:
                return Response({"error": "Roadmap not found"}, status=404)

            roadmap_data = roadmap_doc.get("roadmap")
    
            if isinstance(roadmap_data, str):
                try:
                    roadmap_data = json.loads(roadmap_data)
                except Exception:
                    pass

        
            roadmap_id_str = str(roadmap_doc.get("_id"))

            return Response({
                "id": roadmap_id_str,  
                "technology_name": roadmap_doc.get("technology_name"),
                "roadmap": roadmap_data,
            }, status=200)

        except Exception as e:
            logger.exception("Failed to fetch roadmap")
            return Response({"error": "Failed to fetch roadmap"}, status=500)

class DeleteRoadmap(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id):
        try:
            deleted = mongo_service.delete_roadmap(username=request.user.username, roadmap_id=course_id)
            if deleted:
                return Response({"success": True, "message": "Roadmap deleted successfully"}, status=200)
            return Response({"success": False, "error": "Roadmap not found"}, status=404)
        except Exception as e:
            logger.exception("Failed to delete roadmap")
            return Response({"success": False, "error": "Failed to delete roadmap"}, status=500)
        


class MarkTopicCompleted(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        username = request.user.username
        day = request.data.get("day")

        if not day:
            return Response({"success": False, "error": "Week and day are required"}, status=400)

        try:
            
            roadmap_doc = mongo_service.get_roadmap(course_id)
            if not roadmap_doc:
                return Response({"success": False, "error": "Roadmap not found"}, status=404)

            if roadmap_doc.get("username") != username:
                return Response({"success": False, "error": "Unauthorized"}, status=403)

            success = mongo_service.mark_topic_completed(course_id, day)
            if success:
                return Response({"success": True, "message": f"{day} marked as completed"}, status=200)

            return Response({"success": False, "error": "Week or day not found"}, status=404)

        except Exception as e:
            logger.exception("Failed to mark topic as completed")
            return Response({"success": False, "error": "Failed to mark topic as completed"}, status=500)

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh', None)
            if not refresh_token:
                return Response({'success': False, 'error': 'Refresh token required'}, status=400)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'success': True, 'message': 'Logged out successfully'}, status=200)
        except Exception as e:
            logger.exception('Error while blacklisting refresh token')
            return Response({'success': False, 'error': 'Invalid token or token already blacklisted'}, status=400)
