# Ubuntu deployment

This project can be deployed on one Ubuntu server with Nginx, Node.js, and PM2.

## 1. Prepare the server

```bash
sudo apt update
sudo apt install -y nginx curl ca-certificates
```

Install Node.js LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2:

```bash
sudo npm install -g pm2
```

## 2. Upload the project

Copy this whole project to:

```bash
/srv/german-study
```

Then:

```bash
cd /srv/german-study
cp .env.example .env
chmod +x start-ai-bridge.sh
```

Edit `.env` and fill in your real `AI_API_KEY`.

## 3. Start the AI bridge

```bash
cd /srv/german-study
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

After `pm2 startup`, run the extra command PM2 prints on screen.

## 4. Configure Nginx

Copy the sample config:

```bash
sudo cp deploy/nginx.german-study.conf /etc/nginx/sites-available/german-study
```

Edit:

- `server_name your-domain.com;`
- `root /srv/german-study;`

Then enable it:

```bash
sudo ln -s /etc/nginx/sites-available/german-study /etc/nginx/sites-enabled/german-study
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Point your domain

Add an `A` record for your domain pointing to the server IP.

## 6. Optional HTTPS

After the domain is already pointing to the server and Nginx is serving HTTP, use Certbot for HTTPS.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 7. Update later

When you update files on the server:

```bash
cd /srv/german-study
pm2 restart grok-bridge
sudo systemctl reload nginx
```

If only static files changed, a browser refresh is usually enough after upload.

## Notes

- The frontend now uses `/api/ai` automatically when deployed over HTTP/HTTPS.
- Local file usage still falls back to `http://127.0.0.1:8765/api/ai`.
- This bridge now talks directly to the official API and no longer depends on a browser automation fallback.
