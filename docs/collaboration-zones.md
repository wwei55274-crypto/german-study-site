# 协作分区说明

这个项目目前还没有按目录拆成很多模块，所以协同开发时，最好先按“职责区域”分工，而不是让大家随便改根目录里的文件。

## 核心原则

1. 一个功能分支尽量只改一个主区域
2. 如果必须跨区域改动，在 Pull Request 里写清楚原因
3. 开始开发前先 `git pull origin main`
4. `script.js`、`styles.css`、`local_site_server.js` 属于高冲突文件，改之前先和同事打招呼

## 区域 1：页面结构与视觉样式

适合负责：

- 首页、列表页、详情页的静态结构
- 页面排版、颜色、按钮、卡片、弹窗样式
- 文案布局和视觉调整

主要文件：

- `index.html`
- `list.html`
- `detail.html`
- `styles.css`

推荐分支前缀：

- `ui/...`
- `style/...`

提交前至少检查：

- 首页能正常打开
- 列表页能正常跳转
- 详情页样式没有明显错位

## 区域 2：前端交互与学习逻辑

适合负责：

- 页面切换、语言切换
- 列表渲染、详情渲染
- 练习交互、AI 对话、发布面板
- 学习进度保存与恢复

主要文件：

- `script.js`
- `progress.js`

在 `script.js` 里再细分为：

- 首页与列表：`renderHomePage`、`renderListPage`
- 详情与练习：`renderDetailPage`、`renderSubunitPage`、`renderExercises`
- AI 功能：`checkAiAvailability`、`openAiChat`、`sendAiMessage`
- 本地编辑与发布：`renderLocalDetailEditor`、`saveLocalDetailEditor`、`publishLocalDetailEditor`

推荐分支前缀：

- `logic/...`
- `feature/...`

提交前至少检查：

- 首页标签切换正常
- 列表页能正常渲染卡片
- 详情页练习题可以作答
- 进度保存不报错

## 区域 3：学习内容与多语言数据

适合负责：

- 语法点内容整理
- 子单元、阅读材料、翻译文案
- 示例、练习、答案和说明

主要文件：

- `grammar-data.js`
- `reading-data.js`
- `a1-outline.js`
- `a1-subunits.js`
- `translations.js`

推荐分支前缀：

- `content/...`
- `data/...`
- `i18n/...`

提交前至少检查：

- 新增内容能在页面上显示
- 页面切换中英文时没有空白文案
- 详情页练习和答案能正确显示

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

- 同事 A：区域 1 + 区域 5
- 同事 B：区域 2 + 区域 3 + 区域 4

如果两个人都要改前端，尽量这样拆：

- 同事 A：`index.html`、`list.html`、`detail.html`、`styles.css`
- 同事 B：`script.js`、`progress.js`、数据文件

### 三个人时

- 同事 A：页面结构与样式
- 同事 B：学习内容与翻译
- 同事 C：交互逻辑、进度系统、本地服务

## 高冲突文件提醒

下面这些文件最好不要两个人同时长时间开发：

- `script.js`
- `styles.css`
- `local_site_server.js`
- `grammar-data.js`

如果一定要同时修改，建议：

1. 先在群里说清楚各自负责哪一段
2. 每天至少同步一次 `main`
3. 小步提交，不要憋很大一坨

## Pull Request 写法建议

每个 PR 最好回答这 3 件事：

1. 我主要改的是哪个区域
2. 我改了哪些文件
3. 我自己测试了什么

如果一个 PR 同时改了 `styles.css`、`script.js`、`local_site_server.js`，通常说明改动太大了，最好拆开。
