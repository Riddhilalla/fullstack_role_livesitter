import cv2
import numpy as np
import requests
from db import overlays_collection
import tempfile
import os
import logging

logger = logging.getLogger('overlay_renderer')
logger.setLevel(logging.DEBUG)

# Configure logging to file
log_file = tempfile.NamedTemporaryFile(delete=False, suffix='.log').name
file_handler = logging.FileHandler(log_file)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)

print(f"🔍 Overlay renderer logging to: {log_file}")

def draw_overlays(frame):
    try:
        logger.info(f"Starting overlay rendering on frame: {frame.shape}")
        overlays = list(overlays_collection.find())
        
        # If no overlays, return original frame immediately
        if not overlays:
            return frame
            
        h, w = frame.shape[:2]
        
        for overlay in overlays:
            try:
                pos = overlay.get("position", {})
                size = overlay.get("size", {})
                
                # Convert percentage positions to pixel coordinates
                x = int(pos.get("x", 50) * w / 100)
                y = int(pos.get("y", 50) * h / 100)
                
                if overlay["type"] == "text":
                    style = overlay.get("style", {})
                    font = getattr(cv2, style.get("font", "FONT_HERSHEY_SIMPLEX"))
                    scale = style.get("fontScale", 1)
                    color = tuple(style.get("color", [255, 255, 255]))
                    thickness = style.get("thickness", 2)
                    
                    # Add text background for visibility
                    text_size = cv2.getTextSize(overlay["content"], font, scale, thickness)[0]
                    cv2.rectangle(
                        frame, 
                        (x, y - text_size[1]), 
                        (x + text_size[0], y + 10), 
                        (0, 0, 0), 
                        -1
                    )
                    
                    # Add text
                    cv2.putText(
                        frame, 
                        overlay["content"], 
                        (x, y), 
                        font, 
                        scale, 
                        color, 
                        thickness
                    )

                elif overlay["type"] == "image":
                    content = overlay["content"]
                    img = None
                    
                    if content.startswith('http'):
                        try:
                            response = requests.get(content, timeout=2)
                            if response.status_code == 200:
                                img_data = np.frombuffer(response.content, np.uint8)
                                img = cv2.imdecode(img_data, cv2.IMREAD_UNCHANGED)
                        except Exception:
                            pass
                    else:
                        img = cv2.imread(content, cv2.IMREAD_UNCHANGED)
                    
                    if img is not None:
                        # Get dimensions
                        img_w = size.get("width", 100)
                        img_h = size.get("height", 100)
                        
                        # Resize image
                        img = cv2.resize(img, (int(img_w), int(img_h)))
                        
                        # Handle transparency
                        if img.shape[2] == 4:
                            alpha = img[:, :, 3] / 255.0
                            inv_alpha = 1.0 - alpha
                            
                            for c in range(0, 3):
                                frame_roi = frame[y:y+img.shape[0], x:x+img.shape[1], c]
                                img_roi = img[:, :, c]
                                frame_roi[:] = (alpha * img_roi + inv_alpha * frame_roi).astype(np.uint8)
                        else:
                            frame[y:y+img.shape[0], x:x+img.shape[1]] = img
            except Exception as e:
                logger.error(f"Overlay error: {str(e)}")
        
        return frame
    except Exception as e:
        logger.error(f"Critical error: {str(e)}")
        return frame
    except Exception as e:
        logger.error(f"Critical error in draw_overlays: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return frame