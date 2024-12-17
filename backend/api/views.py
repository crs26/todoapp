from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from django.db.models import Q
from .serializer import TaskSerializer
from .models import Task

class TaskAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    # GET method for retreiving tasks.
    def get(self, request, *args, **kwargs):
        task = Task.objects.filter(user=self.request.user).values()

        filterCompleted = request.GET.get('completed', None)
        if filterCompleted != None:
            task = task.filter(is_completed=filterCompleted).values()

        searchKey = request.GET.get('search', None)
        if searchKey != None:
            task = task.filter(Q(title__icontains=searchKey) | Q(description__icontains=searchKey))
        serializer = TaskSerializer(task, many=True)
        return Response(serializer.data)
    
    # POST method for creating new task.
    def post(self, request, *args, **kwargs):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # Update task details.
    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if task.user != request.user:
            # Return 401 if the requestor is not the creator of the task.
            return Response({"error": "No permission to modify task."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Update task details and status. This fallsback to old value if not provided.
        task.title = request.data.get("title", task.title)
        task.description = request.data.get("description", task.description)

        new_status = request.data.get("is_completed", None)
        if new_status == True and not task.is_completed:
            # Update the status to completed.
            task.is_completed = True

            # Set the completion date to current date.
            task.date_completed = timezone.now()

        elif new_status == False:
            # Reset the completion status and date.
            task.is_completed = False
            task.date_completed = None
        
        # Save the updated task to database.
        task.save()
        return Response({"info":"Task updated successfully."}, status=status.HTTP_200_OK)
    
    def delete(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if task.user != request.user:
            # Return 401 if the requestor is not the creator of the task.
            return Response({"error": "No permission to modify task."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Hard delete task.
        task.delete()
        return Response({"info":"Task deleted successfully."}, status=status.HTTP_204_NO_CONTENT)