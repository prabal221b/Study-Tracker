from django.db import models
from django.contrib.auth.models import User
import jsonfield

class CourseRoadmap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    technology_name = models.CharField(max_length=200)
    roadmap = jsonfield.JSONField()  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "technology_name")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.technology_name} - {self.user.username}"


class TopicProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(
        CourseRoadmap,
        on_delete=models.CASCADE,
        related_name="topics_progress"
    )
    week = models.CharField(max_length=50)
    day = models.CharField(max_length=50)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "course", "week", "day")
        ordering = ["course", "week", "day"]

    def __str__(self):
        status = "Completed" if self.completed else "Pending"
        return f"{self.course.technology_name} - {self.week} {self.day} - {self.user.username} ({status})"

class Roadmap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    technology_name = models.CharField(max_length=255)
    roadmap = models.JSONField()   
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.technology_name} - {self.user.username}"