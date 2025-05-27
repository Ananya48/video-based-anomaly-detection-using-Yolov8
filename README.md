# 🎥 Video-based Anomaly Detection using YOLOv8 (Weapon Detection)

This project allows users to upload short video clips through a web interface. The backend processes the video using a YOLOv8 model to detect anomalies such as **weapons** (e.g., guns, knives). If detected, the system returns relevant metadata with the anomaly.

---

## 📁 Project Structure

video-based-anomaly-detection/

├── frontend/ (React)

│ └── App.js

├── backend/ (Django)

│ └── videos/

│ └── views.py

├── media/

│ ├── uploads/ ← Uploaded videos

│ └── frames/ ← Extracted video frames

├── yolov8n.pt ← Trained YOLOv8 model

├── .gitignore

## 🚀 Features

- 🎞 Upload short video clips (from browser)
- 🤖 Analyze first 30 frames using YOLOv8
- 🔫 Detect weapons in video (gun, knife, etc.)
- 🖼️ Returns anomaly details + a video file
- 🔁 View results in a clean React frontend

---

## 🧠 Tech Stack

- **Frontend:** React.js
- **Backend:** Django (Python)
- **Model:** YOLOv8 (`ultralytics`)
- **CV Library:** OpenCV
- **Data Handling:** Django Media + File Upload APIs

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/video-based-anomaly-detection.git
```
## 2. Backend
```bash
cd backend
```
```bash
pip install -r requirements.txt
```
```bash
python manage.py migrate
```
```bash
python manage.py runserver
```
## 3. Frontend(React)
```bash
cd frontend
```
```bash
npm install
```
```bash
npm start
```
## 4. Upload & Test

- Visit: http://localhost:3000
- Upload a .mp4 or .avi file
- View results, anomalies, and detected weapons.

## 5. 📂 Sample Output (Returned JSON)

{
  "message": "Upload and processing successful",
  "video_path": "/media/uploads/sample.mp4",
  "total_frames": 30,
  "anomaly_detected": true,
  "anomaly_details": {
    "weapons": ["gun", "knife"]
  },
  "selected_frame": "/media/frames/sample/image12.jpg"
}

---

## 📝 To Do
 - Add bounding box overlays in the output frame
 - Integrate real-time webcam detection
 - Improve model accuracy with more training data

---

## 🧑‍🎓 Developed By

– Final Year Project

**Ananya S**

**Ambika Patil**

**Hima Bindu Shetty S**

**Rithushree K S**

Using Ultralytics YOLOv8 and React + Django.

---
