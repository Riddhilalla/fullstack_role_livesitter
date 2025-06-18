import cv2
import numpy as np
from db import overlays_collection

def draw_overlays(frame):
    overlays = list(overlays_collection.find())
    for overlay in overlays:
        pos = overlay.get("position", {})
        size = overlay.get("size", {})
        x, y = pos.get("x", 50), pos.get("y", 50)

        if overlay["type"] == "text":
            style = overlay.get("style", {})
            font = getattr(cv2, style.get("font", "FONT_HERSHEY_SIMPLEX"))
            scale = style.get("fontScale", 1)
            color = tuple(style.get("color", [255, 255, 255]))
            thickness = style.get("thickness", 2)
            cv2.putText(frame, overlay["content"], (x, y),
                        font, scale, color, thickness)

        elif overlay["type"] == "image":
            try:
                img = cv2.imread(overlay["content"], cv2.IMREAD_UNCHANGED)
                if img is not None:
                    img = cv2.resize(img, (size.get("width", 100), size.get("height", 100)))
                    h, w, _ = img.shape
                    # Clip to avoid out-of-bounds
                    h = min(h, frame.shape[0] - y)
                    w = min(w, frame.shape[1] - x)
                    frame[y:y+h, x:x+w] = cv2.addWeighted(frame[y:y+h, x:x+w], 0.7, img[:h, :w], 0.3, 0)
            except Exception as e:
                print(f"Image overlay error: {e}")
    return frame
