import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8000"; // Update for production

// Upload Component
const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("❌ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      setUploadStatus("⏳ Uploading...");
      setIsUploading(true);

      const response = await axios.post(`${BACKEND_URL}/api/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Full Response:", response.data);

      if (response.status === 200) {
        setUploadStatus("✅ File uploaded successfully!");
        const resultData = {
          videoName: selectedFile.name,
          totalFrames: response.data.total_frames,
          anomalyDetected: response.data.anomaly_detected,
          anomalyDetails: response.data.anomaly_details,
          selectedFrame: `${BACKEND_URL}${response.data.selected_frame}`,
          videoUrl: `${BACKEND_URL}${response.data.video_path}`,
        };

        setTimeout(() => {
          navigate("/results", { state: resultData });
        }, 1500);
      } else {
        setUploadStatus("❌ Upload failed. Unexpected response.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response) {
        setUploadStatus(`❌ Server Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        setUploadStatus("❌ Network Error: No response from server.");
      } else {
        setUploadStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <h2>Upload Video for Anomaly Detection</h2>
      <input type="file" id="fileInput" accept="video/*" onChange={handleFileChange} />
      <label htmlFor="fileInput">Choose File</label>
      <p className="file-status">
        {selectedFile ? `📂 Selected File: ${selectedFile.name}` : "No file chosen"}
      </p>
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "⏳ Uploading..." : "Upload"}
      </button>
      <p className="upload-status">{uploadStatus}</p>
    </div>
  );
};

// Results Component
const ResultPage = () => {
  const location = useLocation();
  const {
    videoName,
    totalFrames,
    anomalyDetected,
    anomalyDetails,
    videoUrl,
  } = location.state || {};

  const detectedWeapons = anomalyDetails?.weapons || [];


  return (
    <div className="container">
      <h2>📊 Detection Results</h2>

      {videoName ? (
        <>
          <p><strong>🎥 Video:</strong> {videoName}</p>
          <p><strong> Frames Extracted:</strong> {totalFrames}</p>
          <p><strong>🚨 Anomaly Detected:</strong> {anomalyDetected ? "Yes" : "No"}</p>

          {/* Weapons */}
          {detectedWeapons.length > 0 && (
            <p><strong> Weapon(s) Detected:</strong> {detectedWeapons.join(", ")}</p>
          )}

          {/* Video Player */}
          <video controls src={videoUrl} style={{ width: "100%", marginTop: "20px" }}></video>

          {/* Navigation Bar */}
          <div className="navigation-bar" style={{ marginTop: "20px" }}>
            <a
              href="http://localhost:3000/"
              style={{
                display: "inline-block",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                textDecoration: "none",
                borderRadius: "5px"
              }}
            >
              🔙 Back to Upload
            </a>
          </div>
        </>
      ) : (
        <p>No results to display.</p>
      )}
    </div>
  );
};


// Main App with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
