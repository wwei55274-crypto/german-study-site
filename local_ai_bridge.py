import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib import error, request


HOST = "127.0.0.1"
PORT = 8765
OLLAMA_BASE = "http://127.0.0.1:11434"
DEFAULT_MODEL = "gemma4:e2b"


def json_response(handler, status_code, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status_code)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


def fetch_ollama(path, payload=None):
    data = None
    headers = {"Content-Type": "application/json"}

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = request.Request(f"{OLLAMA_BASE}{path}", data=data, headers=headers)

    try:
        with request.urlopen(req, timeout=180) as response:
            body = response.read().decode("utf-8")
            return response.status, json.loads(body)
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        return exc.code, {"ok": False, "error": body or exc.reason}
    except Exception as exc:  # noqa: BLE001
        return 502, {"ok": False, "error": str(exc)}


class LocalAiBridgeHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path != "/api/ai/status":
            json_response(self, 404, {"ok": False, "error": "Not found"})
            return

        status_code, payload = fetch_ollama("/api/tags")

        if status_code != 200:
            json_response(
                self,
                200,
                {
                    "ok": False,
                    "model": DEFAULT_MODEL,
                    "message": "Ollama is not reachable.",
                    "details": payload.get("error", "")
                }
            )
            return

        models = payload.get("models", [])
        names = [model.get("name", "") for model in models]
        has_model = DEFAULT_MODEL in names
        json_response(
            self,
            200,
            {
                "ok": has_model,
                "model": DEFAULT_MODEL,
                "models": names,
                "message": "ready" if has_model else f"Model {DEFAULT_MODEL} not found."
            }
        )

    def do_POST(self):
        if self.path != "/api/ai/chat":
            json_response(self, 404, {"ok": False, "error": "Not found"})
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length).decode("utf-8")

        try:
            payload = json.loads(raw_body or "{}")
        except json.JSONDecodeError:
            json_response(self, 400, {"ok": False, "error": "Invalid JSON body"})
            return

        status_code, upstream = fetch_ollama(
            "/api/chat",
            {
                "model": payload.get("model") or DEFAULT_MODEL,
                "messages": payload.get("messages") or [],
                "stream": False
            }
        )

        if status_code != 200:
            json_response(
                self,
                502,
                {
                    "ok": False,
                    "error": upstream.get("error", "Chat request failed")
                }
            )
            return

        json_response(self, 200, upstream)

    def log_message(self, format_string, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), LocalAiBridgeHandler)
    print(f"Local AI bridge running at http://{HOST}:{PORT}")
    print(f"Forwarding chat requests to {OLLAMA_BASE} with model {DEFAULT_MODEL}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
