import http.server
import os


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


port = int(os.environ.get('PORT', 8790))
http.server.ThreadingHTTPServer(('127.0.0.1', port), NoCache).serve_forever()
