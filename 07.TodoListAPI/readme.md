

# TodoListAPI

一个基于 Node.js + Express + Prisma + TypeScript 的多用户待办事项（Todo）管理 RESTful API 服务。适合学习现代 Node.js 后端开发最佳实践。

---

## 目录

- [TodoListAPI](#todolistapi)
  - [目录](#目录)
  - [项目简介](#项目简介)
  - [核心功能](#核心功能)
    - [用户管理](#用户管理)
    - [Todo 任务管理](#todo-任务管理)
  - [接口示例](#接口示例)
      - [用户注册](#用户注册)
      - [用户登录](#用户登录)
      - [新建 Todo](#新建-todo)
      - [查询 Todo 列表](#查询-todo-列表)
  - [系统架构与设计](#系统架构与设计)
  - [技术栈选型](#技术栈选型)
  - [目录结构说明](#目录结构说明)
  - [快速开始](#快速开始)
  - [进阶功能（可选）](#进阶功能可选)
  - [贡献与建议](#贡献与建议)

---

## 项目简介

本项目实现了一个高效、易用的多用户 Todo 管理系统，提供标准 RESTful API，支持注册、登录、任务增删改查、权限校验等功能。适合前端、移动端等多端调用。

---

## 核心功能

### 用户管理

- 用户注册、登录（JWT 认证）
- 认证与权限校验（仅能操作自己的数据）

### Todo 任务管理

- 新建、查询、查看、更新、删除 Todo
- 支持任务状态切换（未完成/已完成）
- 支持参数校验、统一错误处理

---

## 接口示例

#### 用户注册

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "test",
  "password": "123456"
}
```

#### 用户登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "test",
  "password": "123456"
}
```

#### 新建 Todo

```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "学习 Node.js",
  "description": "看文档",
  "dueDate": "2024-07-01"
}
```

#### 查询 Todo 列表

```http
GET /api/todos
Authorization: Bearer <token>
```

---

## 系统架构与设计

- **分层架构**：路由、控制器、服务、数据访问、中间件、工具、Schema 校验
- **认证与授权**：JWT 令牌机制
- **参数校验**：Schema 校验（如 zod/joi）
- **错误处理**：统一中间件
- **数据库操作**：Prisma ORM

---

## 技术栈选型

| 层级         | 技术/库         | 说明                         |
| ------------ | --------------- | ---------------------------- |
| 运行环境     | Node.js         | JavaScript 运行时             |
| 框架         | Express         | Web 服务框架                  |
| ORM          | Prisma          | 数据库对象关系映射             |
| 数据库       | SQLite/MySQL    | 关系型数据库                  |
| 校验         | zod/joi         | 请求参数校验                  |
| 认证         | jsonwebtoken    | JWT 认证                      |
| 测试         | Jest            | 单元测试                      |
| 语言         | TypeScript      | 类型安全，提升开发体验         |

---

## 目录结构说明

```
07.TodoListAPI/
├── architecture.md         # 架构说明文档
├── data/                   # 数据存储（如 mock 数据）
├── jest.config.js          # Jest 测试配置
├── package.json            # 项目依赖与脚本
├── prisma/                 # Prisma ORM 配置与迁移
├── readme.md               # 项目说明文档
├── src/                    # 源码目录
│   ├── app.ts              # Express 应用入口
│   ├── controllers/        # 控制器（业务逻辑）
│   ├── db/                 # 数据库相关
│   ├── middlewares/        # 中间件
│   ├── routes/             # 路由定义
│   ├── schemas/            # 请求参数校验
│   ├── server.ts           # 服务启动入口
│   ├── services/           # 服务层（业务封装）
│   └── utils/              # 工具函数
├── tests/                  # 测试代码
└── tsconfig.json           # TypeScript 配置
```

---

## 快速开始

1. 安装依赖

   ```bash
   npm install
   ```

2. 配置数据库（可选，默认 SQLite）

   ```bash
   npx prisma migrate dev --name init
   ```

3. 启动服务

   ```bash
   npm run dev
   ```

4. 运行测试

   ```bash
   npm test
   ```

---

## 进阶功能（可选）

- 任务优先级、标签系统、任务提醒
- 批量操作、API 文档自动生成
- 多端适配

---

## 贡献与建议

欢迎提出 Issue 或 PR，完善文档和功能！

---

如需详细接口文档、用例说明或有其他建议，欢迎联系作者。

---

如需应用此优化，请确认后我将直接修改 readme.md 文件。