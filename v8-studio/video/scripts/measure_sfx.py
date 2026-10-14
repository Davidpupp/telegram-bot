"""Mede o pico (argmax |s|) e a duração de cada efeito em public/sfx e grava src/audio/sfxPeaks.ts.
Cada efeito é posicionado na timeline pelo pico, não pelo início do arquivo (regra da skill motion-design).
uso: python3 scripts/measure_sfx.py (a partir de v8-studio/video)"""
import subprocess
from pathlib import Path
import numpy as np

HERE = Path(__file__).parent.parent
SR = 48000
rows = []
for f in sorted((HERE / "public/sfx").glob("*.mp3")):
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", str(f), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    s = np.frombuffer(raw, np.float32)
    peak = int(np.abs(s).argmax())
    rows.append((f.stem, peak / SR, len(s) / SR, float(np.abs(s).max())))
    print(f"{f.stem:8s} pico {peak / SR:6.3f} s  duração {len(s) / SR:6.3f} s  amplitude {np.abs(s).max():.2f}")

out = HERE / "src/audio/sfxPeaks.ts"
out.parent.mkdir(parents=True, exist_ok=True)
body = "\n".join(f"  {n}: {{peak: {p:.4f}, duration: {d:.4f}, amplitude: {a:.3f}}}," for n, p, d, a in rows)
out.write_text("// Gerado por scripts/measure_sfx.py: pico e duração (s) de cada efeito em public/sfx.\n"
               f"export const SFX_PEAKS = {{\n{body}\n}} as const;\n\nexport type SfxName = keyof typeof SFX_PEAKS;\n")
print("->", out)
