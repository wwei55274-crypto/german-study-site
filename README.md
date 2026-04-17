# 德语学习网站

这是一个本地运行的德语学习网站项目，包含网页端、数据脚本，以及可选的本地 AI bridge。

## 快速开始

### macOS

- 双击 `start-study.command`
- 或在终端运行 `./start-study.sh`

默认会启动：

- 本地网页服务：`http://127.0.0.1:8080`
- 本地 AI bridge：`http://127.0.0.1:8765`

更详细的 macOS 说明见 `README-mac.md`。

## 环境配置

如果需要启用 AI：

1. 复制 `.env.example` 为 `.env`
2. 填入 `AI_API_KEY`
3. 重新启动项目

本地运行产物、密钥和日志都已经通过 `.gitignore` 排除，不应该提交到仓库。

## 推荐协作方式

建议使用 GitHub 托管仓库，并采用下面的最小协作流程：

1. `main` 分支只保留可运行代码
2. 每个功能或修复单独开分支，例如 `feature/homepage-copy`、`fix/ai-bridge-timeout`
3. 开发前先同步主分支：`git pull origin main`
4. 完成后推送分支并发起 Pull Request
5. 合并前至少让另一位同事看一遍改动

## 建议分工

- 页面结构和样式：`index.html`、`detail.html`、`list.html`、`styles.css`
- 页面交互和学习逻辑：`script.js`、`progress.js`
- 数据内容：`a1-outline.js`、`a1-subunits.js`、`translations.js`、`grammar-data.js`
- 本地服务和 AI bridge：`local_site_server.js`、`local_ai_bridge.js`

这样拆分后，两个人同时开发时冲突会少很多。

## 首次克隆后的检查

同事拉下代码后，建议先确认：

- 已安装 `git`
- 已安装 `node`
- 如需 AI 功能，已创建本地 `.env`
- 能正常运行 `./start-study.sh` 或对应平台脚本
