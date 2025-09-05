# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CourseRoadmap, TopicProgress, Roadmap
import re, json
from .services import mongo_service  
import logging

logger = logging.getLogger(__name__)

class RegisterSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        
        try:
            mongo_service.save_user(
                username=validated_data["username"],
                email=validated_data["email"],
                extra={"django_user_id": user.id}
            )
        except Exception as e:
            logger.exception("Failed saving user to Mongo; continuing (Django user created).")

        return user



class CourseRoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRoadmap
        fields = ["id", "technology_name"]

class TopicProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicProgress
        fields = ["week", "day", "completed"]
