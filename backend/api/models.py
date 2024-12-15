from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    date_created = models.DateField(auto_now_add=True)
    date_completed = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title