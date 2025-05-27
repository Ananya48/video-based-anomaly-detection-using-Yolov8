from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Simple homepage response
def home(request):
    return JsonResponse({"message": "Welcome to the Anomaly Detection API!"})

urlpatterns = [
    path("", home, name="home"),  # Add a default homepage
    path("admin/", admin.site.urls),  
    path('api/', include('videos.urls')),  
]

# Serve media and static files in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    




