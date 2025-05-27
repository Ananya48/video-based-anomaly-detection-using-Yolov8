from django.urls import path
# from .views import upload_video, extract_frames  # ✅ Import extract_frames
from . import views  # ✅ This is the missing line!

'''urlpatterns = [
    path('upload/', views.upload_video, name='upload_video'),
    path('extract/', views.extract_frames, name='extract_frames'),
]
'''
urlpatterns = [
    path('upload/', views.upload_video, name='upload_video'),
]




