import cv2, requests, hashlib
from flask import Flask, request, render_template_string, Response, stream_with_context, send_file
from flask_cors import CORS
from overlay import bp as overlay_routes

from db import client
from pymongo.errors import ServerSelectionTimeoutError

app = Flask(__name__)
CORS(app)
app.register_blueprint(overlay_routes)

# MongoDB check
try:
    client.server_info()
    print("✅ MongoDB is connected.")
except ServerSelectionTimeoutError as e:
    print("❌ MongoDB connection failed:", e)

@app.route('/')
def index():
    return render_template_string('''
        <h1>RTSP → HLS Stream Launcher</h1>
        <form method="POST" action="/start_stream">
          <input name="url" placeholder="RTSP URL" size="60" required />
          <button>Start Streaming</button>
        </form>
    ''')

@app.route('/start_stream', methods=['POST'])
def start_stream():
    rtsp_url = request.form['url']

    # Generate unique stream ID from RTSP URL
    stream_id = "mystream"
    # stream_id = hashlib.md5(rtsp_url.encode()).hexdigest()[:10]  # Use a hash for uniqueness
    hls_url = f"/{stream_id}/index.m3u8"
    
    return render_template_string('''
        <h1>🎬 Streaming Live</h1>
        <code>{{ hls_url }}</code><br/>
        <video id="player" width="800" controls autoplay ></video>
<br>
<button onclick="togglePlayPause()">⏯ Play / Pause</button>
<button id="retry-btn" onclick="manualRetry()" style="display:none;">🔁 Retry Stream</button>
        <button onclick="start()">▶ Start Stream</button>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
    const video = document.getElementById('player');
    const videoSrc = "{{ hls_url }}";
    let hls;
    let retryCount = 0;
    const maxRetries = 3;

    function initPlayer() {
        if (hls) {
            hls.destroy();
        }

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(err => console.warn("🔇 Autoplay issue:", err));
                retryCount = 0; // reset retries
                document.getElementById("retry-btn").style.display = "none";
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.warn("📛 HLS.js error:", data);
                if (data.fatal) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`⏳ Retry ${retryCount}/${maxRetries} in 3s...`);
                        hls.destroy();
                        setTimeout(() => initPlayer(), 3000);
                    } else {
                        console.log("❌ Max retries reached. Manual reload required.");
                        document.getElementById("retry-btn").style.display = "inline-block";
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(err => console.warn("🔇 Autoplay issue:", err));
            });
        } else {
            alert("❌ Your browser does not support HLS.");
        }
    }

    function togglePlayPause() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function manualRetry() {
        console.log("🔁 Manual retry...");
        retryCount = 0;
        initPlayer();
    }

    window.onload = initPlayer;
</script>
        <br/><a href="/">← Back</a>
    ''', hls_url=hls_url)

@app.route('/mystream/<path:filename>')
def hls_proxy(filename):
    proxy_url = f"http://localhost:8888/mystream/{filename}"
    try:
        response = requests.get(proxy_url, stream=True, timeout=5)
        return Response(
            stream_with_context(response.iter_content(chunk_size=1024)),
            content_type=response.headers.get('Content-Type', 'application/vnd.apple.mpegurl')
        )
    except Exception as e:
        print(f"Proxy error: {e}")
        return "HLS content not available", 502
  

#@app.route('/video_feed')
#def video_feed():
#    url = request.args.get('url')
#    def gen(url):
#        cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)
#        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
#       if not cap.isOpened():
#            yield b''
#           return
#        while True:
#            ok, frame = cap.read()
#            if not ok: break
#            frame = draw_overlays(frame)
#            _, buf = cv2.imencode('.jpg', frame)
#            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')
#    return Response(gen(url), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
