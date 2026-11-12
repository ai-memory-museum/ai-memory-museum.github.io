import http.server
import functools


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


http.server.ThreadingHTTPServer(('127.0.0.1', 8790), functools.partial(NoCache, directory='/Users/zaharfursa/ai-museum')).serve_forever()
