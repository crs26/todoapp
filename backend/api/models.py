from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    is_completed = models.BooleanField()
    date_created = models.DateField(auto_now_add=True)
    date_completed = models.DateField()

    def __str__(self):
        return self.title