#!/usr/bin/env python3
"""Dev server that actually tells the browser the truth about caching.

python -m http.server sends no Cache-Control at all, so Chrome heuristically
caches the HTML *and* the images and will happily show you a stale page no
matter how many times you refresh. That cost us several rounds of "no changes".
"""
import functools, http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9712

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split('?')[0]
        if path.endswith(('.html', '/')) or path == '':
            # never cache documents — they carry the asset version stamps
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        elif '?v=' in self.path:
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        else:
            self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as httpd:
    print(f'serving {PORT} with sane cache headers')
    httpd.serve_forever()
