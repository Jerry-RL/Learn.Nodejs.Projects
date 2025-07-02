# HiTime 全栈日历应用

## 项目简介
HiTime 是一款现代化、跨平台的日历与提醒应用，融合 macOS 日历与提醒事项的美学与交互，支持活动、任务、习惯、行程及自定义类型，具备高并发、协作、OAuth 授权、智能提醒等特性。

## 目录结构
```
hitime/
  frontend/      # React + TypeScript + TailwindCSS + Storybook + i18n
  backend/       # Golang + Gin + 分层架构
  db/            # PostgreSQL schema 及迁移
  scripts/       # 初始化脚本
  .gitignore
  docker-compose.yml
  README.md
  DESIGN.md      # Figma/设计稿说明
```

## 技术栈
- 前端：React 18, TypeScript, TailwindCSS, Headless UI, Redux Toolkit, React Query, Storybook, i18n
- 后端：Golang, Gin, PostgreSQL, Redis, JWT/OAuth2, 分层架构
- DevOps：Docker, docker-compose, GitHub Actions

## 快速启动
### 1. 一键启动（推荐）
```bash
git clone ...
cd hitime
bash scripts/init.sh
docker-compose up --build
```
- 前端：http://localhost:3000
- 后端：http://localhost:8080
- Storybook：http://localhost:6006

### 2. 本地开发
- 前端：
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- 后端：
  ```bash
  cd backend
  go mod tidy
  go run main.go
  ```
- 数据库：参考 db/schema.sql

## 主要功能
- 日历视图（活动/任务/习惯/行程/自定义）
- 事件管理（CRUD、冲突检测、重复规则）
- 智能提醒、多通道推送
- OAuth 授权、第三方集成
- 高并发、分区存储、缓存优化
- 响应式 UI、macOS 风格、Storybook 组件库
- 国际化（i18n）支持

## 设计稿/原型
详见 DESIGN.md，Figma 链接与 Storybook 组件预览。

## 贡献与开发
- 代码提交前请运行 lint、测试
- 详细开发文档见各子目录 README.md

--- 