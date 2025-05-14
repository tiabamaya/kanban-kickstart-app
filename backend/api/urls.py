from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from .views import ColumnViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'columns', ColumnViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('auth/', include('dj_rest_auth.urls')),
    path('accounts/', include('allauth.urls')), 
]
