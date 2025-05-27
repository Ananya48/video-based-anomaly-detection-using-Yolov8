import os
import cv2
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from ultralytics import YOLO
from collections import deque

# Load YOLOv8 model only once
yolo_model = None

def get_yolo_model():
    global yolo_model
    if yolo_model is None:
        yolo_model = YOLO(os.path.join(settings.BASE_DIR, "videos/models/best (2).pt"))
    return yolo_model


@csrf_exempt
def upload_video(request):
    if request.method == "POST" and request.FILES.get("video"):
        video_file = request.FILES["video"]
        video_name = os.path.splitext(video_file.name)[0]

        # Save uploaded video
        upload_dir = os.path.join(settings.MEDIA_ROOT, "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        saved_path = os.path.join(upload_dir, video_file.name)

        with open(saved_path, "wb+") as dest:
            for chunk in video_file.chunks():
                dest.write(chunk)

        # Extract frames (first 30 only)
        frame_dir = os.path.join(settings.MEDIA_ROOT, "frames", video_name)
        os.makedirs(frame_dir, exist_ok=True)

        cap = cv2.VideoCapture(saved_path)
        frame_count = 0
        selected_frame_path = None
        detected_weapons = set()
        model = get_yolo_model()

        while frame_count < 30:
            success, frame = cap.read()
            if not success:
                break

            frame_count += 1
            frame_path = os.path.join(frame_dir, f"image{frame_count}.jpg")
            cv2.imwrite(frame_path, frame)

            # --------------------- YOLOv8 Weapon Detection ---------------------
            results = model(frame)
            weapon_classes = [
                model.model.names[int(d.cls)] for d in results[0].boxes
            ] if results[0].boxes is not None else []

            if weapon_classes:
                detected_weapons.update(weapon_classes)
                if not selected_frame_path:
                    selected_frame_path = os.path.join(settings.MEDIA_URL, "frames", video_name, f"image{frame_count}.jpg")
        cap.release()

        # Prepare final anomaly result (only if anything was actually found)
        anomaly_detected = bool(detected_weapons)
        anomaly_details = {}

        if detected_weapons:
            anomaly_details["weapons"] = list(detected_weapons)

        return JsonResponse({
            "message": "Upload and processing successful",
            "video_path": f"{settings.MEDIA_URL}uploads/{video_file.name}",
            "total_frames": frame_count,
            "anomaly_detected": anomaly_detected,
            "anomaly_details": anomaly_details if anomaly_detected else None,
            "selected_frame": selected_frame_path
        })

    return JsonResponse({"error": "No video uploaded"}, status=400)