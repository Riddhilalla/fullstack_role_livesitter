# RTSP Livestream Viewer with Overlay Management

This project is a full-stack application designed to play RTSP livestreams with customizable text and image overlays. It uses a React frontend for the user interface, a Flask backend to manage overlay data, and MediaMTX with FFmpeg to handle RTSP-to-HLS conversion for smooth video streaming.

## Features

- Input and playback of RTSP video streams
- HLS conversion for browser-compatible playback
- Add, edit, and delete text or image overlays
- Persistent overlay storage using MongoDB
- User-friendly interface with a modern UI and smooth transitions

---

## 📁 Project Structure

├── backend/ # Flask API server and MediaMTX configuration
│ ├── app.py # Main Flask application
│ ├── overlay.py # Overlay API routes
│ ├── db.py # MongoDB connection
│ ├── mediamtx.yml # MediaMTX configuration
│ └── requirements.txt
├── frontend/ # React + Vite frontend
│ ├── src/components/
│ ├── src/pages/
│ └── vite.config.js



## 🛠️ Installation and Setup

### Backend (Flask)

1. Navigate to the backend directory:
   cd backend

Install the Python dependencies:
pip install -r requirements.txt

Start the Flask server:
python app.py

In a new terminal, start the MediaMTX server:
cd backend
.\mediamtx.exe mediamtx.yml

Frontend (React)
Navigate to the frontend directory:
cd frontend

Install Node.js dependencies:
npm install

Run the development server:
npm run dev

Open your browser and go to:
http://localhost:5173

🔍 Testing the RTSP Stream
To verify that the RTSP stream is working:

Open VLC Media Player

Go to Media > Open Network Stream

Enter this URL and click Play:
rtsp://localhost:8554/mystream

🎮 Usage Instructions
Visit the homepage and enter the RTSP URL:
rtsp://localhost:8554/mystream

The video stream will begin on the next screen.

Use the overlay form to add text or image overlays:
-Text overlays allow you to enter plain text
-Image overlays require a valid image URL
-Manage all overlays using the Overlay Manager panel:
-Edit overlay content, position (x/y), and size
-Delete overlays permanently

🔧 Developer Notes

FFmpeg must be installed and accessible in the system path
MediaMTX handles RTSP to HLS conversion in real-time

📄 License
This project is open-source and available under the MIT License.
