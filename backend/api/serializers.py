from rest_framework import serializers
from .models import Column, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'priority', 'column']

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.due_date = validated_data.get('due_date', instance.due_date)  # ✅ IMPORTANT
        instance.priority = validated_data.get('priority', instance.priority)
        instance.column = validated_data.get('column', instance.column)
        instance.save()
        return instance

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Column
        fields = ['id', 'title', 'position', 'created_at', 'tasks']
