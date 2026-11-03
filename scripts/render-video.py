#!/usr/bin/env python3
"""Render CodeByLeon founder intro placeholder video:
slow Ken-Burns zoom over generated poster + ffmpeg drawtext overlays + ambient audio."""
import subprocess
from PIL import Image, ImageFilter, ImageEnhance

SRC = "/home/z/my-project/public/images/founder-poster.png"
OUT = "/home/z/my-project/public/videos/codebyleon-intro.mp4"
W, H = 1280, 720
FPS = 24
DUR = 20
N = FPS * DUR  # 480 frames

FONT_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def ease(t: float) -> float:
    # ease-in-out cubic
    return 3 * t * t - 2 * t * t * t


def frame_image(base: Image.Image, i: int) -> Image.Image:
    zoom = 1.0 + 0.16 * ease(i / (N - 1))
    # slight vertical drift for cinematic feel
    cx = base.width / 2
    cy = base.height / 2 + 0.02 * base.height * (i / (N - 1)) - 0.01 * base.height
    cw = base.width / zoom
    ch = base.height / zoom
    left = max(0, min(base.width - cw, cx - cw / 2))
    top = max(0, min(base.height - ch, cy - ch / 2))
    img = base.crop((int(left), int(top), int(left + cw), int(top + ch)))
    img = img.resize((W, H), Image.LANCZOS)
    # subtle sharpen + brightness pulse
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=30))
    b = 1.0 + 0.05 * (i / (N - 1))
    img = ImageEnhance.Brightness(img).enhance(b)
    return img


def fade(start, hold_end, end):
    return (f"if(lt(t,{start}),0,if(lt(t,{start + 0.8}),(t-{start})/0.8,"
            f"if(lt(t,{hold_end}),1,if(lt(t,{end}),({end}-t)/0.8,0))))")


def hold(start):
    return f"if(lt(t,{start}),0,if(lt(t,{start + 0.8}),(t-{start})/0.8,1))"


def dt(font, text, size, color, y, alpha):
    return (f"drawtext=fontfile={font}:text='{text}':fontsize={size}:fontcolor={color}:"
            f"x=(w-text_w)/2:y={y}:shadowcolor=black@0.8:shadowx=2:shadowy=2:alpha='{alpha}'")


segs = ",".join([
    dt(FONT_B, "CODEBYLEON", 76, "white", 470, fade(0.0, 5.2, 6.0)),
    dt(FONT_R, "Beyond the Blueprint", 34, "0xD4FF4F", 570, fade(1.2, 5.2, 6.0)),
    dt(FONT_B, "First impressions happen in seconds.", 44, "white", 480, fade(6.5, 10.2, 11.0)),
    dt(FONT_R, "Make yours stick.", 32, "0xFF6B2C", 556, fade(7.2, 10.2, 11.0)),
    dt(FONT_B, "Work directly with Leon Madara", 44, "white", 480, fade(11.5, 15.2, 16.0)),
    dt(FONT_R, "Founder & Principal Technologist", 30, "0xFF3D8A", 556, fade(12.2, 15.2, 16.0)),
    dt(FONT_B, "Nairobi, Kenya | Worldwide Delivery", 38, "white", 490, hold(16.5)),
    dt(FONT_R, "Available For Select Commissions", 26, "0xD4FF4F", 562, hold(17.2)),
])

graph = (
    f"[0:v]format=yuv420p,vignette=PI/5[bg];"
    f"[bg]{segs}[v];"
    "[1:a][2:a][3:a]amix=inputs=3:duration=longest,tremolo=f=0.4:d=0.5,volume=0.10,"
    "afade=t=in:st=0:d=1.5,afade=t=out:st=17.5:d=2.5[a]"
)

graph_file = "/tmp/cbl-graph.txt"
with open(graph_file, "w") as f:
    f.write(graph)

base = Image.open(SRC).convert("RGB")

ff = subprocess.Popen(
    [
        "ffmpeg", "-y", "-v", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-f", "lavfi", "-i", "sine=frequency=220:duration=20",
        "-f", "lavfi", "-i", "sine=frequency=277.18:duration=20",
        "-f", "lavfi", "-i", "sine=frequency=329.63:duration=20",
        "-/filter_complex", graph_file,
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", "-t", str(DUR),
        OUT,
    ],
    stdin=subprocess.PIPE,
)

for i in range(N):
    ff.stdin.write(frame_image(base, i).tobytes())
    if i % 120 == 0:
        print(f"frame {i}/{N}", flush=True)

ff.stdin.close()
ff.wait()
print("done, exit:", ff.returncode)
