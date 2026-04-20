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

更细的区域分工和分支建议见 `docs/collaboration-zones.md`。

## 现在的目录分工

- 语法板块：`grammar/`
- 阅读板块：`reading/`
- 公共逻辑与公共样式：`shared/`
- 根目录兼容入口：`index.html`、`list.html`、`detail.html`
- 本地服务和 AI bridge：`local_site_server.js`、`local_ai_bridge.js`

推荐两个人这样分：

- 你负责语法：`grammar/`
- 同事负责阅读：`reading/`
- 只有公共跳转、共享脚本和共享样式才需要一起协调：`shared/`、`index.html`、`local_site_server.js`

这样拆分后，大部分日常改动都能留在各自文件夹里，冲突会少很多。

仓库里已经补充了适合 GitHub 协作的文件：

- `.github/CODEOWNERS`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/collaboration-zones.md`

## 首次克隆后的检查

同事拉下代码后，建议先确认：

- 已安装 `git`
- 已安装 `node`
- 如需 AI 功能，已创建本地 `.env`
- 能正常运行 `./start-study.sh` 或对应平台脚本

## 目录说明

```text
index.html            首页
list.html             旧列表入口，自动跳到 grammar/ 或 reading/
detail.html           旧详情入口，自动跳到 grammar/ 或 reading/
grammar/              语法页面、语法数据、语法样式入口
reading/              阅读页面、阅读数据、阅读样式入口
shared/               公共脚本、公共样式、语言与进度逻辑
```
