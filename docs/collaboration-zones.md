# 协作分区说明

这个项目现在已经拆成了 `grammar/`、`reading/` 和 `shared/` 三块。最推荐的协作方式是先按目录分工，再尽量少碰共享文件。

## 核心原则

1. 一个功能分支尽量只改一个主区域
2. 如果必须跨区域改动，在 Pull Request 里写清楚原因
3. 开始开发前先 `git pull origin main`
4. `shared/app-core.js`、`shared/common.css`、`local_site_server.js` 属于高冲突文件，改之前先和同事打招呼

## 区域 1：语法板块

适合负责：

- 语法列表页和语法详情页
- 语法数据、语法子单元、语法练习内容
- 语法板块的局部样式

主要文件：

- `grammar/list.html`
- `grammar/detail.html`
- `grammar/grammar-data.js`
- `grammar/a1-outline.js`
- `grammar/a1-subunits.js`
- `grammar/grammar-app.js`
- `grammar/grammar.css`

推荐分支前缀：

- `grammar/...`
- `content/grammar/...`

提交前至少检查：

- `grammar/list.html?level=A1` 能正常打开
- 语法详情页能正常跳转
- 语法练习能正常显示

## 区域 2：阅读板块

适合负责：

- 阅读列表页和阅读详情页
- 阅读题组、原文、问题和答案内容
- 阅读板块的局部样式

主要文件：

- `reading/list.html`
- `reading/detail.html`
- `reading/reading-data.js`
- `reading/reading-app.js`
- `reading/reading.css`

推荐分支前缀：

- `reading/...`
- `content/reading/...`

提交前至少检查：

- `reading/list.html?level=A1&part=reading` 能正常打开
- 阅读详情页能正常跳转
- 阅读题目和答案能正常显示

## 区域 3：公共逻辑与共享资源

适合负责：

- 首页、语言切换、进度保存
- 列表和详情的公共渲染逻辑
- 公共样式、公共翻译、兼容跳转页

主要文件：

- `shared/app-core.js`
- `shared/progress.js`
- `shared/translations.js`
- `shared/common.css`
- `index.html`
- `list.html`
- `detail.html`

推荐分支前缀：

- `shared/...`
- `ui/...`
- `logic/...`

提交前至少检查：

- 首页能正常打开
- 语法和阅读入口都能跳对页面
- 中英文切换和进度保存不报错

## 区域 4：本地服务、AI bridge 与发布能力

适合负责：

- 本地静态站点服务
- 用户数据保存
- AI 接口转发与模型配置
- 本地发布、共享、构建脚本

主要文件：

- `local_site_server.js`
- `local_ai_bridge.js`
- `public_share.js`
- `platform_paths.js`
- `build_a1_handbook.js`
- `run-study-site.sh`
- `run-study-ai.sh`
- `run-study-tunnel.sh`
- `start-*.sh`
- `stop-*.sh`
- `deploy/*`

推荐分支前缀：

- `infra/...`
- `server/...`
- `deploy/...`

提交前至少检查：

- `./start-study.sh` 可以启动
- 本地站点能打开
- 如改了 AI bridge，相关接口能返回结果

## 区域 5：文档与协作规则

适合负责：

- 项目说明
- 使用文档
- GitHub 协作模板

主要文件：

- `README.md`
- `README-mac.md`
- `official-api-setup.md`
- `share-with-tunnel.md`
- `fixed-domain-share.md`
- `deploy/ubuntu-server.md`
- `.github/*`
- `docs/*`

推荐分支前缀：

- `docs/...`
- `chore/...`

## 推荐分工方案

### 两个人时

- 你：`grammar/`
- 同事：`reading/`
- 共享改动提前打招呼：`shared/`、`index.html`、`local_site_server.js`

### 三个人时

- 同事 A：`grammar/`
- 同事 B：`reading/`
- 同事 C：`shared/` 和本地服务

## 高冲突文件提醒

下面这些文件最好不要两个人同时长时间开发：

- `shared/app-core.js`
- `shared/common.css`
- `local_site_server.js`
- `index.html`

如果一定要同时修改，建议：

1. 先在群里说清楚各自负责哪一段
2. 每天至少同步一次 `main`
3. 小步提交，不要憋很大一坨

## Pull Request 写法建议

每个 PR 最好回答这 3 件事：

1. 我主要改的是哪个区域
2. 我改了哪些文件
3. 我自己测试了什么

如果一个 PR 同时改了 `shared/common.css`、`shared/app-core.js`、`local_site_server.js`，通常说明改动太大了，最好拆开。
