# GenStack DSL 交互式生成器设计

我将设计一个交互式的 DSL 生成器，支持用户在执行生成命令时选择前后端技术栈，并基于选择生成相应的工程模板。

## 整体架构设计

```
GenStack CLI
├── 交互式命令行 (Inquirer.js)
├── 模板引擎 (Handlebars)
├── 模板仓库 (Git Submodules)
│   ├── backend
│   │   ├── express-ts
│   │   ├── express-js
│   │   ├── koa-ts
│   │   ├── nestjs-ts
│   │   └── ...
│   ├── frontend
│   │   ├── react-ts
│   │   ├── react-js
│   │   ├── vue-ts
│   │   ├── vue-js
│   │   └── ...
│   └── shared
│       ├── docker
│       ├── ci-cd
│       └── ...
└── 配置管理器
    ├── genstacks.config.js
    └── 项目配置持久化
```

## 交互式 CLI 实现

```typescript
// src/cli.ts
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { generateProject } from './generator';

interface ProjectConfig {
  projectName: string;
  backend: {
    language: 'typescript' | 'javascript';
    framework: 'express' | 'koa' | 'nestjs';
  };
  frontend: {
    language: 'typescript' | 'javascript';
    framework: 'react' | 'vue';
  };
  databases: ('postgres' | 'mongo')[];
  features: ('docker' | 'auth' | 'testing' | 'ci-cd')[];
}

async function main() {
  console.log('🚀 Welcome to GenStack Project Generator');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-genstacks-project',
      validate: (input) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name must be lowercase with hyphens only';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'backend.language',
      message: 'Backend language:',
      choices: ['typescript', 'javascript'],
      default: 'typescript'
    },
    {
      type: 'list',
      name: 'backend.framework',
      message: 'Backend framework:',
      choices: (answers) => {
        // 根据语言调整框架选项
        const isTS = answers.backend?.language === 'typescript';
        return [
          { name: 'Express', value: 'express' },
          { name: 'Koa', value: 'koa' },
          { name: 'NestJS', value: 'nestjs', disabled: !isTS ? 'NestJS requires TypeScript' : false }
        ];
      },
      default: 'express'
    },
    {
      type: 'list',
      name: 'frontend.language',
      message: 'Frontend language:',
      choices: ['typescript', 'javascript'],
      default: 'typescript'
    },
    {
      type: 'list',
      name: 'frontend.framework',
      message: 'Frontend framework:',
      choices: ['react', 'vue'],
      default: 'react'
    },
    {
      type: 'checkbox',
      name: 'databases',
      message: 'Select databases:',
      choices: [
        { name: 'PostgreSQL', value: 'postgres' },
        { name: 'MongoDB', value: 'mongo' }
      ],
      default: ['postgres']
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Additional features:',
      choices: [
        { name: 'Docker Support', value: 'docker' },
        { name: 'Authentication', value: 'auth' },
        { name: 'Testing Setup', value: 'testing' },
        { name: 'CI/CD Pipeline', value: 'ci-cd' }
      ],
      default: ['docker', 'testing']
    }
  ]);

  const config: ProjectConfig = {
    projectName: answers.projectName,
    backend: {
      language: answers.backend.language,
      framework: answers.backend.framework
    },
    frontend: {
      language: answers.frontend.language,
      framework: answers.frontend.framework
    },
    databases: answers.databases,
    features: answers.features
  };

  // 保存配置
  await fs.writeJson(path.join(process.cwd(), 'genstacks.config.json'), config, { spaces: 2 });
  
  // 生成项目
  await generateProject(config);
  
  console.log(`✅ Project ${config.projectName} generated successfully!`);
  console.log('👉 Next steps:');
  console.log(`  cd ${config.projectName}`);
  console.log('  pnpm install');
  console.log('  pnpm dev');
}

main().catch(console.error);
```

## 模板生成器实现

```typescript
// src/generator.ts
import path from 'path';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import { ProjectConfig } from './types';

// 注册Handlebars助手
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('includes', (array, value) => array.includes(value));

export async function generateProject(config: ProjectConfig) {
  const projectPath = path.join(process.cwd(), config.projectName);
  
  // 创建项目目录
  await fs.ensureDir(projectPath);
  
  // 生成Monorepo基础结构
  await generateMonorepoBase(projectPath, config);
  
  // 生成后端项目
  await generateBackend(projectPath, config);
  
  // 生成前端项目
  await generateFrontend(projectPath, config);
  
  // 生成共享包
  await generateSharedPackages(projectPath, config);
  
  // 生成Docker配置
  if (config.features.includes('docker')) {
    await generateDockerConfig(projectPath, config);
  }
  
  // 生成CI/CD配置
  if (config.features.includes('ci-cd')) {
    await generateCICDConfig(projectPath, config);
  }
  
  // 生成README
  await generateReadme(projectPath, config);
}

async function generateMonorepoBase(projectPath: string, config: ProjectConfig) {
  // 创建基础文件
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify({
      name: config.projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'turbo run dev',
        build: 'turbo run build',
        test: 'turbo run test',
        lint: 'turbo run lint'
      },
      devDependencies: {
        turbo: 'latest'
      }
    }, null, 2)
  );
  
  // pnpm-workspace.yaml
  await fs.writeFile(
    path.join(projectPath, 'pnpm-workspace.yaml'),
    `packages:
  - 'apps/*'
  - 'packages/*'`
  );
  
  // turbo.json
  await fs.writeJson(
    path.join(projectPath, 'turbo.json'),
    {
      pipeline: {
        build: {
          outputs: ['dist/**']
        },
        test: {
          outputs: [],
          dependsOn: ['build']
        },
        lint: {
          outputs: []
        },
        dev: {
          cache: false,
          persistent: true
        }
      }
    },
    { spaces: 2 }
  );
  
  // 创建目录结构
  await fs.ensureDir(path.join(projectPath, 'apps'));
  await fs.ensureDir(path.join(projectPath, 'packages'));
}

async function generateBackend(projectPath: string, config: ProjectConfig) {
  const backendPath = path.join(projectPath, 'apps', 'backend');
  const templateName = `${config.backend.framework}-${config.backend.language}`;
  
  // 复制模板
  const templatePath = path.join(__dirname, 'templates', 'backend', templateName);
  await fs.copy(templatePath, backendPath);
  
  // 处理模板文件
  const templateFiles = await walkDir(backendPath);
  
  for (const file of templateFiles) {
    if (file.endsWith('.hbs')) {
      const content = await fs.readFile(file, 'utf-8');
      const template = handlebars.compile(content);
      const result = template(config);
      
      const newPath = file.replace(/\.hbs$/, '');
      await fs.writeFile(newPath, result);
      await fs.remove(file);
    }
  }
  
  // 更新package.json名称
  const pkgPath = path.join(backendPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = `@${config.projectName}/backend`;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  
  // 添加数据库配置
  if (config.databases.length > 0) {
    await addDatabaseConfig(backendPath, config);
  }
  
  // 添加认证功能
  if (config.features.includes('auth')) {
    await addAuthFeature(backendPath, config);
  }
}

async function generateFrontend(projectPath: string, config: ProjectConfig) {
  const frontendPath = path.join(projectPath, 'apps', 'frontend');
  const templateName = `${config.frontend.framework}-${config.frontend.language}`;
  
  // 复制模板
  const templatePath = path.join(__dirname, 'templates', 'frontend', templateName);
  await fs.copy(templatePath, frontendPath);
  
  // 处理模板文件
  const templateFiles = await walkDir(frontendPath);
  
  for (const file of templateFiles) {
    if (file.endsWith('.hbs')) {
      const content = await fs.readFile(file, 'utf-8');
      const template = handlebars.compile(content);
      const result = template(config);
      
      const newPath = file.replace(/\.hbs$/, '');
      await fs.writeFile(newPath, result);
      await fs.remove(file);
    }
  }
  
  // 更新package.json名称
  const pkgPath = path.join(frontendPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = `@${config.projectName}/frontend`;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  
  // 添加API客户端
  await addApiClient(frontendPath, config);
}

// 其他生成函数实现...
```

## 模板结构示例

### 后端模板：Express + TypeScript

```
templates/backend/express-ts/
├── package.json.hbs
├── tsconfig.json
├── src
│   ├── app.ts.hbs
│   ├── config.ts
│   ├── routes
│   │   └── index.ts
│   └── utils
│       └── logger.ts
└── test
    └── app.test.ts
```

**package.json.hbs** 模板示例：
```json
{
  "name": "@{{projectName}}/backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    {{#if (includes databases "postgres")}}
    "pg": "^8.11.0",
    "typeorm": "^0.3.17",
    {{/if}}
    {{#if (includes databases "mongo")}}
    "mongoose": "^7.4.3",
    {{/if}}
    {{#if (includes features "auth")}}
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    {{/if}}
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.5",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6",
    "jest": "^29.6.1",
    "ts-jest": "^29.1.1",
    "@types/jest": "^29.5.2"
  }
}
```

**app.ts.hbs** 模板示例：
```typescript
import express from 'express';
import dotenv from 'dotenv';
{{#if (includes databases "postgres")}}
import { createConnection } from 'typeorm';
{{/if}}
{{#if (includes databases "mongo")}}
import mongoose from 'mongoose';
{{/if}}

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// 数据库连接
{{#if (includes databases "postgres")}}
createConnection().then(() => {
  console.log('PostgreSQL connected');
}).catch(error => {
  console.error('PostgreSQL connection error', error);
});
{{/if}}

{{#if (includes databases "mongo")}}
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));
{{/if}}

// 路由
app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### 前端模板：React + TypeScript

```
templates/frontend/react-ts/
├── package.json.hbs
├── tsconfig.json
├── vite.config.ts
├── src
│   ├── main.tsx
│   ├── App.tsx.hbs
│   ├── components
│   │   └── Header.tsx
│   ├── hooks
│   │   └── useApi.ts
│   └── styles
│       └── index.css
└── index.html
```

**App.tsx.hbs** 模板示例：
```tsx
import React from 'react';
import Header from './components/Header';
import './styles/index.css';
{{#if (includes features "auth")}}
import { AuthProvider } from './context/AuthContext';
{{/if}}

function App() {
  return (
    {{#if (includes features "auth")}}
    <AuthProvider>
    {{/if}}
      <div className="app">
        <Header />
        <main>
          <h1>Welcome to {{projectName}}</h1>
          <p>Frontend: React + TypeScript</p>
          <p>Backend: {{backend.framework}} + {{backend.language}}</p>
        </main>
      </div>
    {{#if (includes features "auth")}}
    </AuthProvider>
    {{/if}}
  );
}

export default App;
```

## 模板选择逻辑

### 后端模板选择矩阵

| 语言/框架      | Express         | Koa             | NestJS          |
|----------------|-----------------|-----------------|-----------------|
| **TypeScript** | express-ts      | koa-ts          | nestjs-ts       |
| **JavaScript** | express-js      | koa-js          | N/A (仅TS支持)  |

### 前端模板选择矩阵

| 语言/框架      | React           | Vue             |
|----------------|-----------------|-----------------|
| **TypeScript** | react-ts        | vue-ts          |
| **JavaScript** | react-js        | vue-js          |

## 数据库集成示例

```typescript
// src/generator/addDatabaseConfig.ts
import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types';

export async function addDatabaseConfig(backendPath: string, config: ProjectConfig) {
  const dbConfigPath = path.join(backendPath, 'src', 'config', 'database.ts');
  
  let content = `import { DataSource } from 'typeorm';\n\n`;
  
  if (config.databases.includes('postgres')) {
    content += `const pgDataSource = new DataSource({\n`;
    content += `  type: 'postgres',\n`;
    content += `  host: process.env.PG_HOST || 'localhost',\n`;
    content += `  port: parseInt(process.env.PG_PORT || '5432'),\n`;
    content += `  username: process.env.PG_USER,\n`;
    content += `  password: process.env.PG_PASSWORD,\n`;
    content += `  database: process.env.PG_DB,\n`;
    content += `  entities: [/* Add your entities here */],\n`;
    content += `  synchronize: process.env.NODE_ENV === 'development',\n`;
    content += `});\n\n`;
  }
  
  if (config.databases.includes('mongo')) {
    content += `import mongoose from 'mongoose';\n\n`;
    content += `const mongoConnection = mongoose.connect(process.env.MONGO_URI!);\n\n`;
  }
  
  content += `export async function initDatabases() {\n`;
  
  if (config.databases.includes('postgres')) {
    content += `  try {\n`;
    content += `    await pgDataSource.initialize();\n`;
    content += `    console.log('PostgreSQL connected');\n`;
    content += `  } catch (error) {\n`;
    content += `    console.error('PostgreSQL connection error', error);\n`;
    content += `  }\n`;
  }
  
  if (config.databases.includes('mongo')) {
    content += `  try {\n`;
    content += `    await mongoConnection;\n`;
    content += `    console.log('MongoDB connected');\n`;
    content += `  } catch (error) {\n`;
    content += `    console.error('MongoDB connection error', error);\n`;
    content += `  }\n`;
  }
  
  content += `}\n`;
  
  await fs.ensureDir(path.dirname(dbConfigPath));
  await fs.writeFile(dbConfigPath, content);
  
  // 更新.env文件
  const envPath = path.join(backendPath, '.env');
  let envContent = '';
  
  if (await fs.pathExists(envPath)) {
    envContent = await fs.readFile(envPath, 'utf-8');
  }
  
  if (config.databases.includes('postgres') && !envContent.includes('PG_')) {
    envContent += '\n# PostgreSQL Configuration\n';
    envContent += 'PG_HOST=localhost\n';
    envContent += 'PG_PORT=5432\n';
    envContent += 'PG_USER=postgres\n';
    envContent += 'PG_PASSWORD=postgres\n';
    envContent += 'PG_DB=myapp\n';
  }
  
  if (config.databases.includes('mongo') && !envContent.includes('MONGO_URI')) {
    envContent += '\n# MongoDB Configuration\n';
    envContent += 'MONGO_URI=mongodb://localhost:27017/myapp\n';
  }
  
  await fs.writeFile(envPath, envContent);
}
```

## 使用示例

### 创建新项目

```bash
npx genstacks create

# 交互式提示：
? Project name: my-ecommerce-app
? Backend language: typescript
? Backend framework: express
? Frontend language: typescript
? Frontend framework: react
? Select databases: PostgreSQL, MongoDB
? Additional features: Docker, Authentication, Testing, CI/CD
```

### 生成的项目结构

```
my-ecommerce-app/
├── .genstacks/
│   └── genstacks.config.json
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── config/
│   │   │   │   ├── database.ts
│   │   │   │   └── auth.ts
│   │   │   ├── entities/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   ├── test/
│   │   └── .env
│   └── frontend/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── api/
│       │   ├── context/
│       │   └── styles/
├── packages/
│   ├── shared-types/
│   │   ├── package.json
│   │   └── src/
│   └── shared-utils/
│       ├── package.json
│       └── src/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── .github/
    └── workflows/
        └── ci.yml
```

### 启动项目

```bash
cd my-ecommerce-app
pnpm install
pnpm dev
```

## 设计优势

1. **灵活的技术栈选择**：
   - 支持多种后端框架（Express, Koa, NestJS）
   - 支持多种前端框架（React, Vue）
   - 支持TypeScript/JavaScript选择

2. **智能模板适配**：
   - 根据用户选择自动组合模板
   - 动态生成配置文件
   - 条件包含功能模块

3. **完整的开发体验**：
   - 开箱即用的开发环境
   - 内置数据库配置
   - 认证系统集成
   - 测试框架配置

4. **现代化的工程实践**：
   - Monorepo架构
   - TurboRepo构建系统
   - Docker容器化
   - CI/CD流水线

5. **可扩展性**：
   - 易于添加新模板
   - 模块化生成器设计
   - 支持自定义模板仓库

这种交互式生成器设计允许开发者根据项目需求灵活选择技术栈，同时确保生成的项目结构遵循最佳实践，大大减少了项目初始化时间并提高了开发效率。