"""Render icons/ from the Feta mascot SVG in index.html:   python3 tools/make_icons.py
macOS only: uses qlmanage (WebKit) to rasterise and sips to resize. No dependencies."""
import os, re, shutil, subprocess, tempfile
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(root, "index.html"), encoding="utf-8").read()
inner = re.search(r'<svg id="mascot"[^>]*>(.*?)</svg>', html, re.S).group(1)
inner = re.sub(r'<(path|ellipse) class="m-mouth m-(idle|sad|think)"[^>]*/>', '', inner)   # keep only the happy mouth
inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S)
inner = inner.replace('class="m-mouth m-happy"', '').replace('class="m-cheek"', '')
def svg(scale):
    off = (512 - 512 * scale) / 2
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#1F6FB2"/>
<circle cx="256" cy="262" r="{200*scale/0.86:.0f}" fill="#E1EDF8" opacity=".18"/>
<g transform="translate({off:.1f},{off+8:.1f}) scale({5.12*scale:.4f})">{inner}</g></svg>'''
tmp = tempfile.mkdtemp()
out = os.path.join(root, "icons"); os.makedirs(out, exist_ok=True)
for name, scale in [("icon-512", 0.86), ("icon-512-maskable", 0.66)]:
    p = os.path.join(tmp, name + ".svg"); open(p, "w").write(svg(scale))
    subprocess.run(["qlmanage", "-t", "-s", "512", "-o", tmp, p], check=True, capture_output=True)
    shutil.copy(p + ".png", os.path.join(out, name + ".png"))
shutil.copy(os.path.join(out, "icon-512.png"), os.path.join(out, "icon-192.png"))
subprocess.run(["sips", "-z", "192", "192", os.path.join(out, "icon-192.png")], check=True, capture_output=True)
print("icons written:", sorted(os.listdir(out)))
