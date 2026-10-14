"""Baixa as fontes (Google Fonts, OFL), a trilha e os efeitos (Mixkit, licença gratuita).
Fontes ficam versionadas em public/fonts; música e efeitos não são redistribuídos (assets/audio e assets/sfx no .gitignore).
uso: python3 scripts/fetch_assets.py (a partir de v8-studio/video)"""
import re, urllib.request
from pathlib import Path

HERE = Path(__file__).parent.parent
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()


def font(family_query, out_name):
    """Baixa só o subconjunto latin. Cada bloco @font-face vem precedido do comentário com o nome do subconjunto."""
    css = get(f"https://fonts.googleapis.com/css2?family={family_query}&display=block").decode()
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{([^}]*)\}", css)
    latin = [b for name, b in blocks if name == "latin"]
    assert latin, f"sem subconjunto latin para {family_query}"
    url = re.search(r"url\((https://[^)]+\.woff2)\)", latin[0]).group(1)
    data = get(url)
    assert data[:4] == b"wOF2", "não é woff2"
    p = HERE / "public/fonts" / out_name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(data)
    print(f"fonte  {out_name:34s} {len(data) // 1024:4d} KB")


def media(url, rel):
    p = HERE / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if not p.exists():
        p.write_bytes(get(url))
    print(f"mídia  {rel:34s} {p.stat().st_size // 1024:4d} KB")


if __name__ == "__main__":
    font("Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800", "bricolage-latin.woff2")
    font("Inter:wght@400..700", "inter-latin.woff2")
    font("Montserrat:wght@600", "montserrat-600-latin.woff2")
    # Trilha: "Cat Walk" (Arulo, Mixkit #371), 130 BPM.
    media("https://assets.mixkit.co/music/371/371.mp3", "public/audio/cat-walk.mp3")
    # Motor: "Car start ignition" (Mixkit #1559): partida, ignição e acelerada do logo V8.
    media("https://assets.mixkit.co/active_storage/sfx/1559/1559-preview.mp3", "public/sfx/engine.mp3")
    # Efeitos Mixkit (ids da tabela da skill motion-design).
    SFX = {"click": 1125, "key": 2568, "soft": 1117, "check": 1113, "toast": 2573, "pop": 2364, "bubble": 2357,
           "whoosh": 1490, "rise": 1489, "impact": 1143, "sparkle": 3083, "success": 2865}
    for name, sid in SFX.items():
        media(f"https://assets.mixkit.co/active_storage/sfx/{sid}/{sid}-preview.mp3", f"public/sfx/{name}.mp3")
