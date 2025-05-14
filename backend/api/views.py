from rest_framework import viewsets
from .models import Column, Task
from .serializers import ColumnSerializer, TaskSerializer

class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all().order_by('position')
    serializer_class = ColumnSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
