"""Finaliza o master renderizado pelo Remotion (out/master.mp4).

1. Áudio: loudnorm em duas passagens para -14 LUFS e pico real de -1 dBTP (regra da skill motion-design),
   vídeo copiado sem recodificar -> ../v8-studio-filme.mp4 (redes, apresentações).
2. Site: sem áudio, H.264 1080p60 em CRF 24 com faststart -> ../v8-studio-filme-site.mp4
   e 720p30 para celular -> ../v8-studio-filme-site-720.mp4.
3. Pôster: quadro do drop (logo sobre azul) e quadro do fechamento em JPG.
4. Controle: varredura de saltos de um quadro e checagem da emenda do loop no master.
uso: python3 scripts/finalize.py (a partir de v8-studio/video)"""
import json, subprocess
from pathlib import Path
import numpy as np

HERE = Path(__file__).parent.parent
OUT = HERE.parent  # v8-studio/
MASTER = HERE / "out/master.mp4"
FPS = 60
COLOR = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"]


def run(args, **kw):
    return subprocess.run(["ffmpeg", "-hide_banner", "-v", "error", "-y", *args], check=True, **kw)


def loudnorm():
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(MASTER), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
          f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    out = OUT / "v8-studio-filme.mp4"
    run(["-i", str(MASTER), "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", str(out)])
    print(f"áudio: {j['input_i']} LUFS -> -14 LUFS  ->", out)


def site_versions():
    a = OUT / "v8-studio-filme-site.mp4"
    run(["-i", str(MASTER), "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", *COLOR,
         "-movflags", "+faststart", str(a)])
    b = OUT / "v8-studio-filme-site-720.mp4"
    run(["-i", str(MASTER), "-an", "-vf", "fps=30,scale=1280:-2:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "25",
         "-pix_fmt", "yuv420p", *COLOR, "-movflags", "+faststart", str(b)])
    print("site ->", a, b)


def posters():
    for name, t in (("poster-logo", 8.0), ("poster-final", 21.5)):
        p = OUT / f"v8-studio-filme-{name}.jpg"
        run(["-ss", str(t), "-i", str(MASTER), "-frames:v", "1", "-q:v", "2", str(p)])
        print("pôster ->", p)


def qa():
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", str(MASTER), "-vf", "scale=180:180,format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 180, 180).astype(np.float32)
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    hits = [(i + 1, round((i + 1) / FPS, 3), round(float(d[i]), 2)) for i in range(1, len(d) - 1)
            if d[i] > 3 * max(d[i - 1], d[i + 1], 0.3) and d[i] > 2.0]
    print("quadros:", len(fr), "| saltos:", hits or "nenhum")
    seam = float(np.abs(fr[-1] - fr[0]).mean())
    print(f"emenda do loop: {seam:.2f} (passo mediano {float(np.median(d)):.2f}) ->", "OK" if seam <= 2 * max(float(np.median(d)), 0.3) else "SALTO")


if __name__ == "__main__":
    assert MASTER.exists(), "renderize antes: npx remotion render V8Film out/master.mp4 ..."
    qa()
    loudnorm()
    site_versions()
    posters()
