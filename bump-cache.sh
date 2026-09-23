#!/bin/bash
# Re-stamp every versioned asset reference so browsers fetch the new bytes.
# Images need this as much as CSS/JS — python's http.server sends no
# Cache-Control, so Chrome will serve stale images from memory indefinitely.
cd "$(dirname "$0")"
V=$(date +%s)
python3 - "$V" <<'PY'
import sys, re
v = sys.argv[1]
for p in ('index.html','menu.html'):
    s = open(p).read()
    # strip any existing stamp, then apply the new one to css, js AND images
    s = re.sub(r'(assets/(?:css/[\w.-]+|js/[\w.-]+|img/[\w.-]+))\?v=\d+', r'\1', s)
    s = re.sub(r'(assets/(?:css/[\w.-]+\.css|js/[\w.-]+\.js|img/[\w.-]+\.webp))',
               r'\1?v=' + v, s)
    open(p,'w').write(s)
    n = len(re.findall(r'\?v=' + v, s))
    print(f'  {p}: {n} refs stamped')
print('version', v)
PY
