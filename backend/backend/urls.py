
from django.contrib import admin
from django.urls import path, include
from dj_rest_auth.views import UserDetailsView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/user/', UserDetailsView.as_view(), name='rest_user_details'),
    path('accounts/', include('allauth.urls')),

]
