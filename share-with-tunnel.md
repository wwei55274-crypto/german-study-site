# Share with Cloudflare Tunnel

Run:

```bat
start-public-share.bat
```

What it does:

- starts the local AI bridge if needed
- starts a local web server on `http://127.0.0.1:8080`
- starts a Cloudflare Quick Tunnel to that site
- prints a public `https://...trycloudflare.com` URL

The public URL is also saved to:

```text
public-url.txt
```

Important:

- Keep the terminal window open while sharing.
- Your computer must stay online.
- Friends can refresh to see local content edits right away.
- If you change `local_ai_bridge.js`, restart the share script.
- Quick Tunnel URLs are temporary and usually change each time you restart.
- Quick Tunnels are for testing and development, not production.
