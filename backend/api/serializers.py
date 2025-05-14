from rest_framework import serializers
from .models import Column, Task

class TaskSerializer(serializers.ModelSerializer):
    due_date = serializers.DateField(allow_null=True, required=False)
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'priority', 'column']


class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Column
        fields = ['id', 'title', 'position', 'tasks']
