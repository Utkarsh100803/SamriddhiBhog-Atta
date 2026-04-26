#!/usr/bin/env python3
"""Simple HTTP server with range-request support for local video development."""
import os, re, http.server, socketserver

PORT = 8080

class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()

        ctype = self.guess_type(path)
        file_size = os.path.getsize(path)
        range_header = self.headers.get('Range')

        if not range_header:
            return super().send_head()

        m = re.match(r'bytes=(\d*)-(\d*)', range_header)
        if not m:
            self.send_error(416, 'Requested Range Not Satisfiable')
            return None

        start = int(m.group(1)) if m.group(1) else 0
        end   = int(m.group(2)) if m.group(2) else file_size - 1
        end   = min(end, file_size - 1)

        if start > end:
            self.send_error(416, 'Requested Range Not Satisfiable')
            return None

        length = end - start + 1
        f = open(path, 'rb')
        f.seek(start)

        self.send_response(206)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(length))
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        return f

    def log_message(self, fmt, *args):
        pass  # suppress request logs

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError):
            pass  # browser closed connection mid-stream — normal for video


class RangeServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True  # must be class-level, before bind()
    daemon_threads = True


with RangeServer(('', PORT), RangeHandler) as httpd:
    print(f'Serving at http://localhost:{PORT}')
    httpd.serve_forever()
