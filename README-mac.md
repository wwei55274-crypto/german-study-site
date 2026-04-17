# macOS 使用说明

这个项目已经整理成可以直接在 macOS 上继续使用。

## 打开方式

最简单的方法：

- 在 Finder 里双击 `start-study.command`

它会自动：

- 启动本地网页服务 `http://127.0.0.1:8080`
- 启动本地 AI bridge `http://127.0.0.1:8765`
- 自动在浏览器里打开网页

## 数据保存位置

macOS 下的数据默认会保存到：

```text
~/Library/Application Support/GermanStudy
```

如果你之前把旧数据放在项目根目录的 `study-user-data.json`，网页服务会在启动时自动迁移它。

## 如果你要启用 AI

1. 把 `.env.example` 复制成 `.env`
2. 填入你的 `AI_API_KEY`
3. 重新运行 `start-study.command`

也可以直接在终端里运行：

```bash
./start-ai-bridge.sh
```

## 日志位置

启动日志会写到：

```text
.runtime/logs/
```

## 绑定固定域名

如果你的域名已经接入 Cloudflare，可以先运行：

```bash
./setup-fixed-tunnel.sh
```

然后日常启动固定公网网址：

```bash
./start-fixed-tunnel.sh
```
