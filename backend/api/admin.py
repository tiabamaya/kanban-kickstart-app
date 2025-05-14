from django.contrib import admin
from .models import Column, Task

@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ('title', 'position')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'column', 'priority', 'due_date')
