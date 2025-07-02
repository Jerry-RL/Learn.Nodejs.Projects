# 进一步完善的GenStacks DSL生成器

我将从以下12个关键维度进一步扩展GenStacks DSL生成器的功能，使其更加全面和强大：

## 1. 增强的交互式流程

```typescript
// 增强的交互式问卷
async function enhancedPrompts() {
  return inquirer.prompt([
    // ...基础问题...
    {
      type: 'confirm',
      name: 'withSSR',
      message: 'Enable Server-Side Rendering (SSR) for frontend?',
      default: false,
      when: (answers) => answers.frontend.framework === 'react' || answers.frontend.framework === 'vue'
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: 'Select state management solution:',
      choices: [
        { name: 'Redux Toolkit', value: 'redux', disabled: (ans) => ans.frontend.language === 'javascript' && ans.frontend.framework === 'vue' ? 'Not recommended with Vue+JS' : false },
        { name: 'Vuex (for Vue)', value: 'vuex', when: (ans) => ans.frontend.framework === 'vue' },
        { name: 'Zustand', value: 'zustand' },
        { name: 'Recoil', value: 'recoil', when: (ans) => ans.frontend.framework === 'react' },
        { name: 'None', value: 'none' }
      ],
      default: (ans) => ans.frontend.framework === 'vue' ? 'vuex' : 'redux'
    },
    {
      type: 'checkbox',
      name: 'additionalFeatures',
      message: 'Select additional features:',
      choices: [
        { name: 'Internationalization (i18n)', value: 'i18n' },
        { name: 'Theming Support', value: 'theming' },
        { name: 'Analytics Integration', value: 'analytics' },
        { name: 'Error Tracking (Sentry)', value: 'errorTracking' },
        { name: 'SEO Optimization', value: 'seo' }
      ]
    },
    {
      type: 'list',
      name: 'cssSolution',
      message: 'Select CSS solution:',
      choices: [
        { name: 'CSS Modules', value: 'modules' },
        { name: 'Styled Components', value: 'styled' },
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: 'SASS/SCSS', value: 'sass' },
        { name: 'Emotion', value: 'emotion' }
      ],
      default: 'modules'
    },
    {
      type: 'confirm',
      name: 'withStorybook',
      message: 'Add Storybook for component documentation?',
      default: true
    },
    {
      type: 'confirm',
      name: 'withE2E',
      message: 'Add end-to-end testing?',
      default: false
    }
  ]);
}
```

## 2. 智能模板选择系统

```typescript
const templateResolver = {
  resolveBackendTemplate(config) {
    const base = `${config.backend.framework}-${config.backend.language}`;
    
    let template = base;
    if (config.features.includes('graphql')) {
      template += '-graphql';
    }
    if (config.features.includes('auth')) {
      template += '-auth';
    }
    
    return template;
  },
  
  resolveFrontendTemplate(config) {
    let template = `${config.frontend.framework}-${config.frontend.language}`;
    
    if (config.withSSR) {
      template += '-ssr';
      if (config.frontend.framework === 'react') {
        template += '-next';
      } else if (config.frontend.framework === 'vue') {
        template += '-nuxt';
      }
    }
    
    if (config.stateManagement !== 'none') {
      template += `-${config.stateManagement}`;
    }
    
    if (config.cssSolution === 'tailwind') {
      template += '-tailwind';
    } else if (config.cssSolution === 'sass') {
      template += '-sass';
    }
    
    return template;
  }
}
```

## 3. 模块化架构增强

```typescript
// 模块生成器注册表
const moduleGenerators = {
  // 核心模块
  core: generateCoreStructure,
  backend: generateBackend,
  frontend: generateFrontend,
  
  // 功能模块
  auth: generateAuthModule,
  i18n: generateI18nModule,
  theming: generateThemingModule,
  analytics: generateAnalyticsModule,
  
  // 测试模块
  unitTests: generateUnitTests,
  e2eTests: generateE2eTests,
  
  // 部署模块
  docker: generateDockerConfig,
  ciCd: generateCiCd,
  
  // 文档模块
  storybook: generateStorybookSetup,
  apiDocs: generateApiDocumentation
};

// 生成器工作流
async function enhancedGenerate(config) {
  // 1. 生成核心结构
  await moduleGenerators.core(config);
  
  // 2. 生成后端和前端
  await moduleGenerators.backend(config);
  await moduleGenerators.frontend(config);
  
  // 3. 生成附加功能
  for (const feature of config.additionalFeatures) {
    if (moduleGenerators[feature]) {
      await moduleGenerators[feature](config);
    }
  }
  
  // 4. 生成测试套件
  await moduleGenerators.unitTests(config);
  if (config.withE2E) {
    await moduleGenerators.e2eTests(config);
  }
  
  // 5. 生成文档
  if (config.withStorybook) {
    await moduleGenerators.storybook(config);
  }
  await moduleGenerators.apiDocs(config);
  
  // 6. 生成部署配置
  if (config.features.includes('docker')) {
    await moduleGenerators.docker(config);
  }
  if (config.features.includes('ci-cd')) {
    await moduleGenerators.ciCd(config);
  }
}
```

## 4. GraphQL支持增强

```typescript
async function addGraphQLSupport(backendPath, config) {
  const isNestJS = config.backend.framework === 'nestjs';
  const usingTypeScript = config.backend.language === 'typescript';
  
  // 添加依赖
  await addDependencies(backendPath, [
    'graphql',
    'apollo-server-express',
    ...(usingTypeScript ? ['@types/graphql'] : [])
  ]);
  
  if (isNestJS) {
    await addDependencies(backendPath, [
      '@nestjs/graphql',
      'graphql-tools',
      'apollo-server-core'
    ]);
  }
  
  // 生成类型定义和解析器
  const schemaContent = `# Autogenerated by GenStacks
type Query {
  hello: String
}

type Mutation {
  # Add your mutations here
}
`;
  
  await fs.writeFile(path.join(backendPath, 'src/schema.graphql'), schemaContent);
  
  // 集成到应用中
  if (isNestJS) {
    // NestJS GraphQL集成
    const appModulePath = path.join(backendPath, 'src/app.module.ts');
    let content = await fs.readFile(appModulePath, 'utf-8');
    content = content.replace(
      'imports: [',
      `imports: [\n    GraphQLModule.forRoot<ApolloDriverConfig>({\n      driver: ApolloDriver,\n      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),\n    }),`
    );
    // 添加其他必要的导入
    await fs.writeFile(appModulePath, content);
  } else {
    // Express GraphQL集成
    const entryFile = config.backend.language === 'typescript' ? 
      'src/app.ts' : 'src/app.js';
    
    const entryPath = path.join(backendPath, entryFile);
    let content = await fs.readFile(entryPath, 'utf-8');
    
    const graphQLIntegration = `
import { ApolloServer } from 'apollo-server-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

const typeDefs = loadSchemaSync('src/schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!'
  }
};

const schema = addResolversToSchema({
  schema: typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({ 
  schema,
  context: ({ req }) => ({
    user: req.user
  })
});

await apolloServer.start();
apolloServer.applyMiddleware({ app, path: '/graphql' });
`;
    
    content = content.replace(
      'const app = express();',
      `const app = express();\n\n${graphQLIntegration}`
    );
    
    // 添加必要的导入
    content = content.replace(
      "import express from 'express';",
      `import express from 'express';\nimport { ApolloServer } from 'apollo-server-express';`
    );
    
    await fs.writeFile(entryPath, content);
  }
}
```

## 5. 身份验证增强方案

```typescript
async function generateEnhancedAuth(backendPath, config) {
  const authStrategies = [];
  let authContent = '';
  
  // 基本JWT认证
  authContent += `
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
`;
  authStrategies.push('JWT');
  
  // 添加Passport策略
  if (config.features.includes('auth-passport')) {
    authContent += `
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false);
    
    const isValid = await comparePassword(password, user.password);
    return isValid ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
}));

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
`;
    authStrategies.push('Passport');
  }
  
  // 添加第三方登录
  if (config.features.includes('auth-oauth')) {
    authContent += `
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
export const googleCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  session: false
});
`;
    authStrategies.push('Google OAuth');
    
    // 添加更多第三方策略：GitHub, Facebook...
  }
  
  // 保存认证文件
  await fs.writeFile(path.join(backendPath, 'src/auth.ts'), authContent);
  
  // 添加路由
  const routesPath = path.join(backendPath, 'src/routes/auth.ts');
  let routesContent = `
import express from 'express';
import { 
  authenticateJWT, 
  googleAuth, 
  googleCallback 
  // Add other exports as needed
} from '../auth';

const router = express.Router();

router.post('/login', /* login handler */);
router.post('/register', /* register handler */);
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback, (req, res) => {
  const token = generateToken(req.user);
  res.json({ token });
});
`;

  await fs.writeFile(routesPath, routesContent);
  
  // 更新入口文件添加身份验证中间件
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'app.use(express.json());',
    `app.use(express.json());\napp.use(passportInitialize);\napp.use(passportSession);`
  );
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport { passportInitialize, passportSession } from './auth';`
  );
  
  await fs.writeFile(appPath, appContent);
  
  console.log(`🔐 Added authentication with strategies: ${authStrategies.join(', ')}`);
}
```

## 6. 部署多目标支持

```typescript
async function generateMultiDeployTargets(projectPath, config) {
  // 基础Docker配置
  if (config.deploy.includes('docker')) {
    await generateDockerConfig(projectPath, config);
  }
  
  // Kubernetes支持
  if (config.deploy.includes('kubernetes')) {
    await generateKubernetesConfig(projectPath, config);
  }
  
  // 云平台特定配置
  if (config.deploy.includes('aws')) {
    await generateAWSConfig(projectPath, config);
  }
  
  if (config.deploy.includes('azure')) {
    await generateAzureConfig(projectPath, config);
  }
  
  if (config.deploy.includes('gcp')) {
    await generateGCPConfig(projectPath, config);
  }
  
  // Serverless支持
  if (config.deploy.includes('serverless')) {
    await generateServerlessConfig(projectPath, config);
  }
}

// Kubernetes生成示例
async function generateKubernetesConfig(projectPath, config) {
  const k8sPath = path.join(projectPath, 'k8s');
  await fs.ensureDir(k8sPath);
  
  // 生成部署文件
  const backendDeployment = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.projectName}-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${config.projectName}-backend
  template:
    metadata:
      labels:
        app: ${config.projectName}-backend
    spec:
      containers:
      - name: backend
        image: ${config.dockerPrefix}/${config.projectName}-backend:latest
        ports:
        - containerPort: ${config.backendPort}
        env:
        - name: NODE_ENV
          value: production
        - name: DB_HOST
          value: ${config.projectName}-postgres
        # Add other environment variables as needed
---
apiVersion: v1
kind: Service
metadata:
  name: ${config.projectName}-backend-service
spec:
  selector:
    app: ${config.projectName}-backend
  ports:
    - protocol: TCP
      port: ${config.backendPort}
      targetPort: ${config.backendPort}
`;

  // 类似的生成前端、数据库等资源
  
  await fs.writeFile(path.join(k8sPath, 'backend-deployment.yaml'), backendDeployment);
  
  console.log('☸️ Generated Kubernetes deployment configuration');
}

// AWS ECS部署示例
async function generateAWSConfig(projectPath, config) {
  const awsPath = path.join(projectPath, 'aws');
  await fs.ensureDir(awsPath);
  
  // ECS任务定义
  const taskDefinition = `{
  "family": "${config.projectName}-task",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "${config.dockerPrefix}/${config.projectName}-backend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${config.backendPort},
          "hostPort": ${config.backendPort}
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "DB_HOST", "value": "${config.projectName}-postgres"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${config.projectName}",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "memory": "1GB",
  "cpu": "0.5 vCPU"
}`;
  
  await fs.writeFile(path.join(awsPath, 'task-definition.json'), taskDefinition);
  
  // CloudFormation模板等...
  
  console.log('☁️ Generated AWS deployment configuration');
}
```

## 7. 多环境配置管理

```typescript
async function generateEnvironmentConfig(projectPath, config) {
  const envDir = path.join(projectPath, 'environments');
  await fs.ensureDir(envDir);
  
  // 基础环境配置
  const envVars = {
    // 公共变量
    NODE_ENV: 'development',
    LOG_LEVEL: 'debug',
    
    // 数据库相关
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_USER: 'app_user',
    DB_PASSWORD: 'app_password',
    DB_NAME: `${config.projectName}_dev`,
    
    // 应用特定配置
    API_BASE_URL: `http://localhost:${config.backendPort}`,
    FRONTEND_URL: `http://localhost:${config.frontendPort}`,
    
    // 第三方服务
    SENTRY_DSN: '',
    GOOGLE_API_KEY: ''
  };
  
  // 创建环境文件
  const environments = ['development', 'staging', 'production'];
  
  for (const env of environments) {
    const envConfig = { ...envVars };
    
    // 环境特定覆盖
    if (env === 'production') {
      envConfig.NODE_ENV = 'production';
      envConfig.LOG_LEVEL = 'info';
      envConfig.DB_HOST = `${config.projectName}-postgres`;
      envConfig.DB_NAME = `${config.projectName}_prod`;
      envConfig.API_BASE_URL = `https://api.${config.projectName}.com`;
      envConfig.FRONTEND_URL = `https://${config.projectName}.com`;
    } else if (env === 'staging') {
      envConfig.DB_NAME = `${config.projectName}_staging`;
      envConfig.API_BASE_URL = `https://staging-api.${config.projectName}.com`;
      envConfig.FRONTEND_URL = `https://staging.${config.projectName}.com`;
    }
    
    let content = `# ${env.toUpperCase()} Environment Variables\n\n`;
    for (const [key, value] of Object.entries(envConfig)) {
      content += `${key}=${value}\n`;
    }
    
    await fs.writeFile(path.join(envDir, `.env.${env}`), content);
  }
  
  // 创建配置加载器
  const configLoader = `
import dotenv from 'dotenv';
import path from 'path';

// 根据NODE_ENV加载环境变量
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, \`../environments/.env.\${env}\`) });

const config = {
  env,
  port: process.env.PORT || ${config.backendPort},
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  api: {
    baseUrl: process.env.API_BASE_URL,
  },
  // 添加其他配置部分...
};

export default config;
`;
  
  await fs.writeFile(path.join(projectPath, 'apps/backend/src/config.ts'), configLoader);
  
  console.log('🌿 Generated multi-environment configuration');
}
```

## 8. 微服务支持扩展

```typescript
async function generateMicroservices(config) {
  // 基础项目结构
  await generateBaseProject(config);
  
  // 生成每个微服务
  for (const service of config.microservices) {
    const serviceConfig = {
      ...config,
      projectName: service.name,
      backend: {
        ...config.backend,
        framework: service.framework || config.backend.framework
      },
      features: service.features || config.features
    };
    
    // 在apps目录下创建微服务
    const servicePath = path.join(config.projectPath, 'apps', service.name);
    await generateBackend(servicePath, serviceConfig);
    
    // 添加服务间通信
    if (service.communication === 'grpc') {
      await addGRPCIntegration(servicePath, serviceConfig);
    } else if (service.communication === 'message-queue') {
      await addMessageQueueIntegration(servicePath, serviceConfig);
    }
  }
  
  // 生成API网关
  await generateApiGateway(config);
  
  // 生成服务发现配置
  await generateServiceDiscovery(config);
}

async function addGRPCIntegration(servicePath, config) {
  console.log(`🔌 Adding gRPC support to ${path.basename(servicePath)}`);
  
  // 添加依赖
  await addDependencies(servicePath, ['@grpc/grpc-js', '@grpc/proto-loader']);
  
  // 生成协议文件
  const protoPath = path.join(servicePath, 'proto', `${config.projectName}.proto`);
  await fs.ensureDir(path.dirname(protoPath));
  
  const protoContent = `syntax = "proto3";

service ${toPascalCase(config.projectName)}Service {
  rpc GetExample (ExampleRequest) returns (ExampleResponse);
}

message ExampleRequest {
  string id = 1;
}

message ExampleResponse {
  string name = 1;
  int32 value = 2;
}
`;
  await fs.writeFile(protoPath, protoContent);
  
  // 生成GRPC服务端
  const serverTemplate = `
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/${config.projectName}.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const ${toCamelCase(config.projectName)}Proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(${toCamelCase(config.projectName)}Proto.${toPascalCase(config.projectName)}Service.service, {
  GetExample: (call, callback) => {
    // Implement your logic here
    const response = {
      name: "Example",
      value: 42
    };
    callback(null, response);
  }
});

server.bindAsync(
  '0.0.0.0:50051', 
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log(\`gRPC server running on port \${port}\`);
    server.start();
  }
);
`;
  
  await fs.writeFile(path.join(servicePath, 'src/grpc-server.ts'), serverTemplate);
  
  // 将gRPC服务集成到应用中
  const entryPath = path.join(servicePath, 'src/index.ts');
  let entryContent = await fs.readFile(entryPath, 'utf-8');
  
  entryContent = entryContent.replace(
    'const port = process.env.PORT || 4000;',
    `const port = process.env.PORT || 4000;

// Start gRPC server
import './grpc-server';`
  );
  
  await fs.writeFile(entryPath, entryContent);
}
```

## 9. 代码质量集成

```typescript
async function enhanceCodeQuality(config) {
  // ESLint配置
  await addESLintConfig(config);
  
  // Prettier配置
  await addPrettierConfig(config);
  
  // TypeScript严格模式
  await enableStrictTypeScript(config);
  
  // 测试覆盖率
  await configureTestCoverage(config);
  
  // 代码提交规范
  await addCommitLintConfig(config);
}

async function addESLintConfig(config) {
  const isReact = config.frontend.framework === 'react';
  const isVue = config.frontend.framework === 'vue';
  
  const eslintConfig = {
    root: true,
    env: {
      browser: true,
      node: true,
      es6: true
    },
    parser: config.backend.language === 'typescript' ? '@typescript-eslint/parser' : undefined,
    plugins: [
      config.backend.language === 'typescript' ? '@typescript-eslint' : undefined,
      isReact ? 'react' : undefined,
      isVue ? 'vue' : undefined,
      'import'
    ].filter(Boolean),
    extends: [
      'eslint:recommended',
      config.backend.language === 'typescript' ? 'plugin:@typescript-eslint/recommended' : undefined,
      isReact ? 'plugin:react/recommended' : undefined,
      isVue ? 'plugin:vue/recommended' : undefined,
      'plugin:import/recommended'
    ].filter(Boolean),
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          { pattern: '@/**', group: 'internal' }
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }]
    }
  };
  
  await fs.writeJson(path.join(config.projectPath, '.eslintrc.json'), eslintConfig, { spaces: 2 });
  
  // 添加IDE配置文件
  const vscodeSettings = {
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true
    },
    'eslint.validate': ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']
  };
  
  await fs.ensureDir(path.join(config.projectPath, '.vscode'));
  await fs.writeJson(path.join(config.projectPath, '.vscode/settings.json'), vscodeSettings, { spaces: 2 });
}

async function addCommitLintConfig(config) {
  await addDependencies(config.projectPath, ['husky', 'lint-staged', '@commitlint/cli', '@commitlint/config-conventional'], true);
  
  // Commitlint配置
  const commitlintConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'scope-enum': [
        2,
        'always',
        config.microservices ? config.microservices.map(s => s.name) : ['app']
      ]
    }
  };
  
  await fs.writeJson(path.join(config.projectPath, '.commitlintrc.json'), commitlintConfig, { spaces: 2 });
  
  // Husky配置
  const packageJsonPath = path.join(config.projectPath, 'package.json');
  const pkg = await fs.readJson(packageJsonPath);
  
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.prepare = 'husky install';
  
  await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  
  // 创建husky钩子
  await execa('npx', ['husky', 'install'], { cwd: config.projectPath });
  await execa('npx', ['husky', 'add', '.husky/commit-msg', 'npx --no -- commitlint --edit $1']);
  await execa('npx', ['husky', 'add', '.husky/pre-commit', 'npx lint-staged']);
  
  // lint-staged配置
  const lintStagedConfig = {
    '*.{js,jsx,ts,tsx}': [
      'eslint --fix',
      'prettier --write'
    ],
    '*.{json,md,yml}': [
      'prettier --write'
    ]
  };
  
  await fs.writeJson(path.join(config.projectPath, '.lintstagedrc.json'), lintStagedConfig, { spaces: 2 });
}
```

## 10. 可观察性扩展

```typescript
async function addObservability(config) {
  // 日志增强
  await enhanceLogging(config);
  
  // 监控指标
  await addMetricsCollection(config);
  
  // 分布式追踪
  await addDistributedTracing(config);
  
  // 健康检查
  await addHealthChecks(config);
}

async function enhanceLogging(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 添加Winston日志库
  await addDependencies(backendPath, ['winston', 'winston-daily-rotate-file']);
  
  // 创建日志配置
  const loggerConfig = `
import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return \`\${timestamp} [\${level.toUpperCase()}]: \${stack || message}\`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat)
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/exceptions.log') 
    })
  ]
});

export default logger;
`;
  
  await fs.writeFile(path.join(backendPath, 'src/utils/logger.ts'), loggerConfig);
  
  // 集成到应用中
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport logger from './utils/logger';`
  );
  
  appContent = appContent.replace(
    'const app = express();',
    `const app = express();\n\napp.use((req, res, next) => {\n  logger.info(\`\${req.method} \${req.url}\`);\n  next();\n});`
  );
  
  await fs.writeFile(appPath, appContent);
}

async function addMetricsCollection(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 添加Prometheus客户端
  await addDependencies(backendPath, ['prom-client', 'express-prom-bundle']);
  
  // 集成Prometheus指标
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport promBundle from 'express-prom-bundle';\n\nconst metricsMiddleware = promBundle({ includeMethod: true });`
  );
  
  appContent = appContent.replace(
    'app.use(express.json());',
    `app.use(express.json());\napp.use(metricsMiddleware);`
  );
  
  // 添加指标路由
  appContent += `
// 自定义业务指标
import { register, Gauge } from 'prom-client';

const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Current active users',
  labelNames: ['type']
});

// 暴露指标端点
app.get('/metrics', async (req, res) => {
  try {
    // 更新自定义指标
    const userCount = await getActiveUserCount();
    activeUsers.set({ type: 'all' }, userCount);
    
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send(error);
  }
});
`;
  
  await fs.writeFile(appPath, appContent);
}
```

## 11. 前端框架优化选项

```typescript
async function optimizeFrontend(config) {
  // 静态资源优化
  await configureAssetOptimization(config);
  
  // 性能审计集成
  await addPerformanceAudit(config);
  
  // 渐进式Web应用支持
  if (config.features.includes('pwa')) {
    await addPwaSupport(config);
  }
  
  // 服务端渲染
  if (config.withSSR) {
    await configureSSR(config);
  }
}

async function configureSSR(config) {
  const frontendPath = path.join(config.projectPath, 'apps/frontend');
  
  if (config.frontend.framework === 'react') {
    // Next.js优化
    const nextConfigPath = path.join(frontendPath, 'next.config.js');
    let nextConfig = `module.exports = {\n`;
    
    // 添加压缩
    if (config.features.includes('compression')) {
      nextConfig += `  compress: true,\n`;
    }
    
    // 添加国际化
    if (config.i18n) {
      nextConfig += `  i18n: {\n`;
      nextConfig += `    locales: ${JSON.stringify(config.i18n.locales || ['en', 'zh'])},\n`;
      nextConfig += `    defaultLocale: '${config.i18n.default || 'en'}',\n`;
      nextConfig += `  },\n`;
    }
    
    // 添加图片优化
    if (config.features.includes('image-optimization')) {
      nextConfig += `  images: {\n`;
      nextConfig += `    domains: ['images.unsplash.com'],\n`;
      nextConfig += `    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],\n`;
      nextConfig += `  },\n`;
    }
    
    // 添加构建分析
    if (config.features.includes('bundle-analyze')) {
      nextConfig += `  analyzeBrowser: ['browser'],\n`;
    }
    
    nextConfig += `}\n`;
    
    await fs.writeFile(nextConfigPath, nextConfig);
    
  } else if (config.frontend.framework === 'vue') {
    // Nuxt.js优化
    const nuxtConfigPath = path.join(frontendPath, 'nuxt.config.js');
    let nuxtConfig = `export default {\n`;
    
    // 添加构建优化
    nuxtConfig += `  build: {\n`;
    nuxtConfig += `    extractCSS: true,\n`;
    nuxtConfig += `    optimizeCSS: true,\n`;
    nuxtConfig += `    parallel: true,\n`;
    
    if (config.features.includes('compression')) {
      nuxtConfig += `    compression: {\n`;
      nuxtConfig += `      gzip: true,\n`;
      nuxtConfig += `      brotli: true,\n`;
      nuxtConfig += `    },\n`;
    }
    
    nuxtConfig += `  },\n\n`;
    
    // 添加渲染优化
    nuxtConfig += `  render: {\n`;
    nuxtConfig += `    static: {\n`;
    nuxtConfig += `      maxAge: 31536000,\n`;
    nuxtConfig += `    },\n`;
    
    if (config.features.includes('compression')) {
      nuxtConfig += `    compressor: {\n`;
      nuxtConfig += `      threshold: 1024,\n`;
      nuxtConfig += `    },\n`;
    }
    
    nuxtConfig += `  },\n`;
    
    await fs.writeFile(nuxtConfigPath, nuxtConfig);
  }
  
  // 添加服务端性能监控
  const perfmonContent = `
import { performance } from 'perf_hooks';

export function startPerfTrace(name) {
  return {
    start: performance.now(),
    name
  };
}

export function endPerfTrace(trace) {
  const duration = performance.now() - trace.start;
  console.log(\`[\${trace.name}] took \${duration.toFixed(2)}ms\`);
  // 可以添加发送到监控系统
}
`;
  
  await fs.writeFile(path.join(frontendPath, 'src/utils/perfmon.ts'), perfmonContent);
}
```

## 12. 安全增强

```typescript
async function enhanceSecurity(config) {
  // 设置安全HTTP头部
  await configureSecurityHeaders(config);
  
  // 添加速率限制
  await addRateLimiting(config);
  
  // CORS配置
  await configureCORS(config);
  
  // CSRF保护
  await addCSRFProtection(config);
  
  // 内容安全策略
  if (config.features.includes('csp')) {
    await addContentSecurityPolicy(config);
  }
}

async function configureSecurityHeaders(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 使用Helmet.js设置安全头部
  await addDependencies(backendPath, ['helmet']);
  
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport helmet from 'helmet';`
  );
  
  appContent = appContent.replace(
    'const app = express();',
    `const app = express();\n\napp.use(helmet({\n  contentSecurityPolicy: ${config.features.includes('csp') ? 'true' : 'false'},\n  hsts: {\n    maxAge: 31536000,\n    includeSubDomains: true,\n    preload: true\n  }\n}));`
  );
  
  await fs.writeFile(appPath, appContent);
}

async function addRateLimiting(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 添加速率限制中间件
  await addDependencies(backendPath, ['express-rate-limit']);
  
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'const app = express();',
    `const app = express();\n\nimport rateLimit from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100, // limit each IP to 100 requests per window\n  standardHeaders: true, // Return rate limit info in the \`RateLimit-*\` headers\n  legacyHeaders: false, // Disable the \`X-RateLimit-*\` headers\n});\n\napp.use(limiter);`
  );
  
  await fs.writeFile(appPath, appContent);
}
```

通过以上12个维度的扩展，GenStacks DSL生成器已经成为一个功能全面、安全可靠且适应各种复杂场景的全栈项目生成工具。开发者可以通过配置文件快速生成一个包含现代化开发实践的项目骨架，大大减少了搭建项目基础设施所需的时间和工作量。# 进一步完善的GenStacks DSL生成器

我将从以下12个关键维度进一步扩展GenStacks DSL生成器的功能，使其更加全面和强大：

## 1. 增强的交互式流程

```typescript
// 增强的交互式问卷
async function enhancedPrompts() {
  return inquirer.prompt([
    // ...基础问题...
    {
      type: 'confirm',
      name: 'withSSR',
      message: 'Enable Server-Side Rendering (SSR) for frontend?',
      default: false,
      when: (answers) => answers.frontend.framework === 'react' || answers.frontend.framework === 'vue'
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: 'Select state management solution:',
      choices: [
        { name: 'Redux Toolkit', value: 'redux', disabled: (ans) => ans.frontend.language === 'javascript' && ans.frontend.framework === 'vue' ? 'Not recommended with Vue+JS' : false },
        { name: 'Vuex (for Vue)', value: 'vuex', when: (ans) => ans.frontend.framework === 'vue' },
        { name: 'Zustand', value: 'zustand' },
        { name: 'Recoil', value: 'recoil', when: (ans) => ans.frontend.framework === 'react' },
        { name: 'None', value: 'none' }
      ],
      default: (ans) => ans.frontend.framework === 'vue' ? 'vuex' : 'redux'
    },
    {
      type: 'checkbox',
      name: 'additionalFeatures',
      message: 'Select additional features:',
      choices: [
        { name: 'Internationalization (i18n)', value: 'i18n' },
        { name: 'Theming Support', value: 'theming' },
        { name: 'Analytics Integration', value: 'analytics' },
        { name: 'Error Tracking (Sentry)', value: 'errorTracking' },
        { name: 'SEO Optimization', value: 'seo' }
      ]
    },
    {
      type: 'list',
      name: 'cssSolution',
      message: 'Select CSS solution:',
      choices: [
        { name: 'CSS Modules', value: 'modules' },
        { name: 'Styled Components', value: 'styled' },
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: 'SASS/SCSS', value: 'sass' },
        { name: 'Emotion', value: 'emotion' }
      ],
      default: 'modules'
    },
    {
      type: 'confirm',
      name: 'withStorybook',
      message: 'Add Storybook for component documentation?',
      default: true
    },
    {
      type: 'confirm',
      name: 'withE2E',
      message: 'Add end-to-end testing?',
      default: false
    }
  ]);
}
```

## 2. 智能模板选择系统

```typescript
const templateResolver = {
  resolveBackendTemplate(config) {
    const base = `${config.backend.framework}-${config.backend.language}`;
    
    let template = base;
    if (config.features.includes('graphql')) {
      template += '-graphql';
    }
    if (config.features.includes('auth')) {
      template += '-auth';
    }
    
    return template;
  },
  
  resolveFrontendTemplate(config) {
    let template = `${config.frontend.framework}-${config.frontend.language}`;
    
    if (config.withSSR) {
      template += '-ssr';
      if (config.frontend.framework === 'react') {
        template += '-next';
      } else if (config.frontend.framework === 'vue') {
        template += '-nuxt';
      }
    }
    
    if (config.stateManagement !== 'none') {
      template += `-${config.stateManagement}`;
    }
    
    if (config.cssSolution === 'tailwind') {
      template += '-tailwind';
    } else if (config.cssSolution === 'sass') {
      template += '-sass';
    }
    
    return template;
  }
}
```

## 3. 模块化架构增强

```typescript
// 模块生成器注册表
const moduleGenerators = {
  // 核心模块
  core: generateCoreStructure,
  backend: generateBackend,
  frontend: generateFrontend,
  
  // 功能模块
  auth: generateAuthModule,
  i18n: generateI18nModule,
  theming: generateThemingModule,
  analytics: generateAnalyticsModule,
  
  // 测试模块
  unitTests: generateUnitTests,
  e2eTests: generateE2eTests,
  
  // 部署模块
  docker: generateDockerConfig,
  ciCd: generateCiCd,
  
  // 文档模块
  storybook: generateStorybookSetup,
  apiDocs: generateApiDocumentation
};

// 生成器工作流
async function enhancedGenerate(config) {
  // 1. 生成核心结构
  await moduleGenerators.core(config);
  
  // 2. 生成后端和前端
  await moduleGenerators.backend(config);
  await moduleGenerators.frontend(config);
  
  // 3. 生成附加功能
  for (const feature of config.additionalFeatures) {
    if (moduleGenerators[feature]) {
      await moduleGenerators[feature](config);
    }
  }
  
  // 4. 生成测试套件
  await moduleGenerators.unitTests(config);
  if (config.withE2E) {
    await moduleGenerators.e2eTests(config);
  }
  
  // 5. 生成文档
  if (config.withStorybook) {
    await moduleGenerators.storybook(config);
  }
  await moduleGenerators.apiDocs(config);
  
  // 6. 生成部署配置
  if (config.features.includes('docker')) {
    await moduleGenerators.docker(config);
  }
  if (config.features.includes('ci-cd')) {
    await moduleGenerators.ciCd(config);
  }
}
```

## 4. GraphQL支持增强

```typescript
async function addGraphQLSupport(backendPath, config) {
  const isNestJS = config.backend.framework === 'nestjs';
  const usingTypeScript = config.backend.language === 'typescript';
  
  // 添加依赖
  await addDependencies(backendPath, [
    'graphql',
    'apollo-server-express',
    ...(usingTypeScript ? ['@types/graphql'] : [])
  ]);
  
  if (isNestJS) {
    await addDependencies(backendPath, [
      '@nestjs/graphql',
      'graphql-tools',
      'apollo-server-core'
    ]);
  }
  
  // 生成类型定义和解析器
  const schemaContent = `# Autogenerated by GenStacks
type Query {
  hello: String
}

type Mutation {
  # Add your mutations here
}
`;
  
  await fs.writeFile(path.join(backendPath, 'src/schema.graphql'), schemaContent);
  
  // 集成到应用中
  if (isNestJS) {
    // NestJS GraphQL集成
    const appModulePath = path.join(backendPath, 'src/app.module.ts');
    let content = await fs.readFile(appModulePath, 'utf-8');
    content = content.replace(
      'imports: [',
      `imports: [\n    GraphQLModule.forRoot<ApolloDriverConfig>({\n      driver: ApolloDriver,\n      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),\n    }),`
    );
    // 添加其他必要的导入
    await fs.writeFile(appModulePath, content);
  } else {
    // Express GraphQL集成
    const entryFile = config.backend.language === 'typescript' ? 
      'src/app.ts' : 'src/app.js';
    
    const entryPath = path.join(backendPath, entryFile);
    let content = await fs.readFile(entryPath, 'utf-8');
    
    const graphQLIntegration = `
import { ApolloServer } from 'apollo-server-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

const typeDefs = loadSchemaSync('src/schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!'
  }
};

const schema = addResolversToSchema({
  schema: typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({ 
  schema,
  context: ({ req }) => ({
    user: req.user
  })
});

await apolloServer.start();
apolloServer.applyMiddleware({ app, path: '/graphql' });
`;
    
    content = content.replace(
      'const app = express();',
      `const app = express();\n\n${graphQLIntegration}`
    );
    
    // 添加必要的导入
    content = content.replace(
      "import express from 'express';",
      `import express from 'express';\nimport { ApolloServer } from 'apollo-server-express';`
    );
    
    await fs.writeFile(entryPath, content);
  }
}
```

## 5. 身份验证增强方案

```typescript
async function generateEnhancedAuth(backendPath, config) {
  const authStrategies = [];
  let authContent = '';
  
  // 基本JWT认证
  authContent += `
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
`;
  authStrategies.push('JWT');
  
  // 添加Passport策略
  if (config.features.includes('auth-passport')) {
    authContent += `
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false);
    
    const isValid = await comparePassword(password, user.password);
    return isValid ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
}));

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
`;
    authStrategies.push('Passport');
  }
  
  // 添加第三方登录
  if (config.features.includes('auth-oauth')) {
    authContent += `
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
export const googleCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  session: false
});
`;
    authStrategies.push('Google OAuth');
    
    // 添加更多第三方策略：GitHub, Facebook...
  }
  
  // 保存认证文件
  await fs.writeFile(path.join(backendPath, 'src/auth.ts'), authContent);
  
  // 添加路由
  const routesPath = path.join(backendPath, 'src/routes/auth.ts');
  let routesContent = `
import express from 'express';
import { 
  authenticateJWT, 
  googleAuth, 
  googleCallback 
  // Add other exports as needed
} from '../auth';

const router = express.Router();

router.post('/login', /* login handler */);
router.post('/register', /* register handler */);
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback, (req, res) => {
  const token = generateToken(req.user);
  res.json({ token });
});
`;

  await fs.writeFile(routesPath, routesContent);
  
  // 更新入口文件添加身份验证中间件
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'app.use(express.json());',
    `app.use(express.json());\napp.use(passportInitialize);\napp.use(passportSession);`
  );
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport { passportInitialize, passportSession } from './auth';`
  );
  
  await fs.writeFile(appPath, appContent);
  
  console.log(`🔐 Added authentication with strategies: ${authStrategies.join(', ')}`);
}
```

## 6. 部署多目标支持

```typescript
async function generateMultiDeployTargets(projectPath, config) {
  // 基础Docker配置
  if (config.deploy.includes('docker')) {
    await generateDockerConfig(projectPath, config);
  }
  
  // Kubernetes支持
  if (config.deploy.includes('kubernetes')) {
    await generateKubernetesConfig(projectPath, config);
  }
  
  // 云平台特定配置
  if (config.deploy.includes('aws')) {
    await generateAWSConfig(projectPath, config);
  }
  
  if (config.deploy.includes('azure')) {
    await generateAzureConfig(projectPath, config);
  }
  
  if (config.deploy.includes('gcp')) {
    await generateGCPConfig(projectPath, config);
  }
  
  // Serverless支持
  if (config.deploy.includes('serverless')) {
    await generateServerlessConfig(projectPath, config);
  }
}

// Kubernetes生成示例
async function generateKubernetesConfig(projectPath, config) {
  const k8sPath = path.join(projectPath, 'k8s');
  await fs.ensureDir(k8sPath);
  
  // 生成部署文件
  const backendDeployment = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.projectName}-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${config.projectName}-backend
  template:
    metadata:
      labels:
        app: ${config.projectName}-backend
    spec:
      containers:
      - name: backend
        image: ${config.dockerPrefix}/${config.projectName}-backend:latest
        ports:
        - containerPort: ${config.backendPort}
        env:
        - name: NODE_ENV
          value: production
        - name: DB_HOST
          value: ${config.projectName}-postgres
        # Add other environment variables as needed
---
apiVersion: v1
kind: Service
metadata:
  name: ${config.projectName}-backend-service
spec:
  selector:
    app: ${config.projectName}-backend
  ports:
    - protocol: TCP
      port: ${config.backendPort}
      targetPort: ${config.backendPort}
`;

  // 类似的生成前端、数据库等资源
  
  await fs.writeFile(path.join(k8sPath, 'backend-deployment.yaml'), backendDeployment);
  
  console.log('☸️ Generated Kubernetes deployment configuration');
}

// AWS ECS部署示例
async function generateAWSConfig(projectPath, config) {
  const awsPath = path.join(projectPath, 'aws');
  await fs.ensureDir(awsPath);
  
  // ECS任务定义
  const taskDefinition = `{
  "family": "${config.projectName}-task",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "${config.dockerPrefix}/${config.projectName}-backend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${config.backendPort},
          "hostPort": ${config.backendPort}
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "DB_HOST", "value": "${config.projectName}-postgres"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${config.projectName}",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "memory": "1GB",
  "cpu": "0.5 vCPU"
}`;
  
  await fs.writeFile(path.join(awsPath, 'task-definition.json'), taskDefinition);
  
  // CloudFormation模板等...
  
  console.log('☁️ Generated AWS deployment configuration');
}
```

## 7. 多环境配置管理

```typescript
async function generateEnvironmentConfig(projectPath, config) {
  const envDir = path.join(projectPath, 'environments');
  await fs.ensureDir(envDir);
  
  // 基础环境配置
  const envVars = {
    // 公共变量
    NODE_ENV: 'development',
    LOG_LEVEL: 'debug',
    
    // 数据库相关
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_USER: 'app_user',
    DB_PASSWORD: 'app_password',
    DB_NAME: `${config.projectName}_dev`,
    
    // 应用特定配置
    API_BASE_URL: `http://localhost:${config.backendPort}`,
    FRONTEND_URL: `http://localhost:${config.frontendPort}`,
    
    // 第三方服务
    SENTRY_DSN: '',
    GOOGLE_API_KEY: ''
  };
  
  // 创建环境文件
  const environments = ['development', 'staging', 'production'];
  
  for (const env of environments) {
    const envConfig = { ...envVars };
    
    // 环境特定覆盖
    if (env === 'production') {
      envConfig.NODE_ENV = 'production';
      envConfig.LOG_LEVEL = 'info';
      envConfig.DB_HOST = `${config.projectName}-postgres`;
      envConfig.DB_NAME = `${config.projectName}_prod`;
      envConfig.API_BASE_URL = `https://api.${config.projectName}.com`;
      envConfig.FRONTEND_URL = `https://${config.projectName}.com`;
    } else if (env === 'staging') {
      envConfig.DB_NAME = `${config.projectName}_staging`;
      envConfig.API_BASE_URL = `https://staging-api.${config.projectName}.com`;
      envConfig.FRONTEND_URL = `https://staging.${config.projectName}.com`;
    }
    
    let content = `# ${env.toUpperCase()} Environment Variables\n\n`;
    for (const [key, value] of Object.entries(envConfig)) {
      content += `${key}=${value}\n`;
    }
    
    await fs.writeFile(path.join(envDir, `.env.${env}`), content);
  }
  
  // 创建配置加载器
  const configLoader = `
import dotenv from 'dotenv';
import path from 'path';

// 根据NODE_ENV加载环境变量
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, \`../environments/.env.\${env}\`) });

const config = {
  env,
  port: process.env.PORT || ${config.backendPort},
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  api: {
    baseUrl: process.env.API_BASE_URL,
  },
  // 添加其他配置部分...
};

export default config;
`;
  
  await fs.writeFile(path.join(projectPath, 'apps/backend/src/config.ts'), configLoader);
  
  console.log('🌿 Generated multi-environment configuration');
}
```

## 8. 微服务支持扩展

```typescript
async function generateMicroservices(config) {
  // 基础项目结构
  await generateBaseProject(config);
  
  // 生成每个微服务
  for (const service of config.microservices) {
    const serviceConfig = {
      ...config,
      projectName: service.name,
      backend: {
        ...config.backend,
        framework: service.framework || config.backend.framework
      },
      features: service.features || config.features
    };
    
    // 在apps目录下创建微服务
    const servicePath = path.join(config.projectPath, 'apps', service.name);
    await generateBackend(servicePath, serviceConfig);
    
    // 添加服务间通信
    if (service.communication === 'grpc') {
      await addGRPCIntegration(servicePath, serviceConfig);
    } else if (service.communication === 'message-queue') {
      await addMessageQueueIntegration(servicePath, serviceConfig);
    }
  }
  
  // 生成API网关
  await generateApiGateway(config);
  
  // 生成服务发现配置
  await generateServiceDiscovery(config);
}

async function addGRPCIntegration(servicePath, config) {
  console.log(`🔌 Adding gRPC support to ${path.basename(servicePath)}`);
  
  // 添加依赖
  await addDependencies(servicePath, ['@grpc/grpc-js', '@grpc/proto-loader']);
  
  // 生成协议文件
  const protoPath = path.join(servicePath, 'proto', `${config.projectName}.proto`);
  await fs.ensureDir(path.dirname(protoPath));
  
  const protoContent = `syntax = "proto3";

service ${toPascalCase(config.projectName)}Service {
  rpc GetExample (ExampleRequest) returns (ExampleResponse);
}

message ExampleRequest {
  string id = 1;
}

message ExampleResponse {
  string name = 1;
  int32 value = 2;
}
`;
  await fs.writeFile(protoPath, protoContent);
  
  // 生成GRPC服务端
  const serverTemplate = `
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/${config.projectName}.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const ${toCamelCase(config.projectName)}Proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(${toCamelCase(config.projectName)}Proto.${toPascalCase(config.projectName)}Service.service, {
  GetExample: (call, callback) => {
    // Implement your logic here
    const response = {
      name: "Example",
      value: 42
    };
    callback(null, response);
  }
});

server.bindAsync(
  '0.0.0.0:50051', 
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log(\`gRPC server running on port \${port}\`);
    server.start();
  }
);
`;
  
  await fs.writeFile(path.join(servicePath, 'src/grpc-server.ts'), serverTemplate);
  
  // 将gRPC服务集成到应用中
  const entryPath = path.join(servicePath, 'src/index.ts');
  let entryContent = await fs.readFile(entryPath, 'utf-8');
  
  entryContent = entryContent.replace(
    'const port = process.env.PORT || 4000;',
    `const port = process.env.PORT || 4000;

// Start gRPC server
import './grpc-server';`
  );
  
  await fs.writeFile(entryPath, entryContent);
}
```

## 9. 代码质量集成

```typescript
async function enhanceCodeQuality(config) {
  // ESLint配置
  await addESLintConfig(config);
  
  // Prettier配置
  await addPrettierConfig(config);
  
  // TypeScript严格模式
  await enableStrictTypeScript(config);
  
  // 测试覆盖率
  await configureTestCoverage(config);
  
  // 代码提交规范
  await addCommitLintConfig(config);
}

async function addESLintConfig(config) {
  const isReact = config.frontend.framework === 'react';
  const isVue = config.frontend.framework === 'vue';
  
  const eslintConfig = {
    root: true,
    env: {
      browser: true,
      node: true,
      es6: true
    },
    parser: config.backend.language === 'typescript' ? '@typescript-eslint/parser' : undefined,
    plugins: [
      config.backend.language === 'typescript' ? '@typescript-eslint' : undefined,
      isReact ? 'react' : undefined,
      isVue ? 'vue' : undefined,
      'import'
    ].filter(Boolean),
    extends: [
      'eslint:recommended',
      config.backend.language === 'typescript' ? 'plugin:@typescript-eslint/recommended' : undefined,
      isReact ? 'plugin:react/recommended' : undefined,
      isVue ? 'plugin:vue/recommended' : undefined,
      'plugin:import/recommended'
    ].filter(Boolean),
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          { pattern: '@/**', group: 'internal' }
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }]
    }
  };
  
  await fs.writeJson(path.join(config.projectPath, '.eslintrc.json'), eslintConfig, { spaces: 2 });
  
  // 添加IDE配置文件
  const vscodeSettings = {
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true
    },
    'eslint.validate': ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']
  };
  
  await fs.ensureDir(path.join(config.projectPath, '.vscode'));
  await fs.writeJson(path.join(config.projectPath, '.vscode/settings.json'), vscodeSettings, { spaces: 2 });
}

async function addCommitLintConfig(config) {
  await addDependencies(config.projectPath, ['husky', 'lint-staged', '@commitlint/cli', '@commitlint/config-conventional'], true);
  
  // Commitlint配置
  const commitlintConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'scope-enum': [
        2,
        'always',
        config.microservices ? config.microservices.map(s => s.name) : ['app']
      ]
    }
  };
  
  await fs.writeJson(path.join(config.projectPath, '.commitlintrc.json'), commitlintConfig, { spaces: 2 });
  
  // Husky配置
  const packageJsonPath = path.join(config.projectPath, 'package.json');
  const pkg = await fs.readJson(packageJsonPath);
  
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.prepare = 'husky install';
  
  await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  
  // 创建husky钩子
  await execa('npx', ['husky', 'install'], { cwd: config.projectPath });
  await execa('npx', ['husky', 'add', '.husky/commit-msg', 'npx --no -- commitlint --edit $1']);
  await execa('npx', ['husky', 'add', '.husky/pre-commit', 'npx lint-staged']);
  
  // lint-staged配置
  const lintStagedConfig = {
    '*.{js,jsx,ts,tsx}': [
      'eslint --fix',
      'prettier --write'
    ],
    '*.{json,md,yml}': [
      'prettier --write'
    ]
  };
  
  await fs.writeJson(path.join(config.projectPath, '.lintstagedrc.json'), lintStagedConfig, { spaces: 2 });
}
```

## 10. 可观察性扩展

```typescript
async function addObservability(config) {
  // 日志增强
  await enhanceLogging(config);
  
  // 监控指标
  await addMetricsCollection(config);
  
  // 分布式追踪
  await addDistributedTracing(config);
  
  // 健康检查
  await addHealthChecks(config);
}

async function enhanceLogging(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 添加Winston日志库
  await addDependencies(backendPath, ['winston', 'winston-daily-rotate-file']);
  
  // 创建日志配置
  const loggerConfig = `
import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return \`\${timestamp} [\${level.toUpperCase()}]: \${stack || message}\`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat)
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/exceptions.log') 
    })
  ]
});

export default logger;
`;
  
  await fs.writeFile(path.join(backendPath, 'src/utils/logger.ts'), loggerConfig);
  
  // 集成到应用中
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport logger from './utils/logger';`
  );
  
  appContent = appContent.replace(
    'const app = express();',
    `const app = express();\n\napp.use((req, res, next) => {\n  logger.info(\`\${req.method} \${req.url}\`);\n  next();\n});`
  );
  
  await fs.writeFile(appPath, appContent);
}

async function addMetricsCollection(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 添加Prometheus客户端
  await addDependencies(backendPath, ['prom-client', 'express-prom-bundle']);
  
  // 集成Prometheus指标
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport promBundle from 'express-prom-bundle';\n\nconst metricsMiddleware = promBundle({ includeMethod: true });`
  );
  
  appContent = appContent.replace(
    'app.use(express.json());',
    `app.use(express.json());\napp.use(metricsMiddleware);`
  );
  
  // 添加指标路由
  appContent += `
// 自定义业务指标
import { register, Gauge } from 'prom-client';

const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Current active users',
  labelNames: ['type']
});

// 暴露指标端点
app.get('/metrics', async (req, res) => {
  try {
    // 更新自定义指标
    const userCount = await getActiveUserCount();
    activeUsers.set({ type: 'all' }, userCount);
    
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send(error);
  }
});
`;
  
  await fs.writeFile(appPath, appContent);
}
```

## 11. 前端框架优化选项

```typescript
async function optimizeFrontend(config) {
  // 静态资源优化
  await configureAssetOptimization(config);
  
  // 性能审计集成
  await addPerformanceAudit(config);
  
  // 渐进式Web应用支持
  if (config.features.includes('pwa')) {
    await addPwaSupport(config);
  }
  
  // 服务端渲染
  if (config.withSSR) {
    await configureSSR(config);
  }
}

async function configureSSR(config) {
  const frontendPath = path.join(config.projectPath, 'apps/frontend');
  
  if (config.frontend.framework === 'react') {
    // Next.js优化
    const nextConfigPath = path.join(frontendPath, 'next.config.js');
    let nextConfig = `module.exports = {\n`;
    
    // 添加压缩
    if (config.features.includes('compression')) {
      nextConfig += `  compress: true,\n`;
    }
    
    // 添加国际化
    if (config.i18n) {
      nextConfig += `  i18n: {\n`;
      nextConfig += `    locales: ${JSON.stringify(config.i18n.locales || ['en', 'zh'])},\n`;
      nextConfig += `    defaultLocale: '${config.i18n.default || 'en'}',\n`;
      nextConfig += `  },\n`;
    }
    
    // 添加图片优化
    if (config.features.includes('image-optimization')) {
      nextConfig += `  images: {\n`;
      nextConfig += `    domains: ['images.unsplash.com'],\n`;
      nextConfig += `    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],\n`;
      nextConfig += `  },\n`;
    }
    
    // 添加构建分析
    if (config.features.includes('bundle-analyze')) {
      nextConfig += `  analyzeBrowser: ['browser'],\n`;
    }
    
    nextConfig += `}\n`;
    
    await fs.writeFile(nextConfigPath, nextConfig);
    
  } else if (config.frontend.framework === 'vue') {
    // Nuxt.js优化
    const nuxtConfigPath = path.join(frontendPath, 'nuxt.config.js');
    let nuxtConfig = `export default {\n`;
    
    // 添加构建优化
    nuxtConfig += `  build: {\n`;
    nuxtConfig += `    extractCSS: true,\n`;
    nuxtConfig += `    optimizeCSS: true,\n`;
    nuxtConfig += `    parallel: true,\n`;
    
    if (config.features.includes('compression')) {
      nuxtConfig += `    compression: {\n`;
      nuxtConfig += `      gzip: true,\n`;
      nuxtConfig += `      brotli: true,\n`;
      nuxtConfig += `    },\n`;
    }
    
    nuxtConfig += `  },\n\n`;
    
    // 添加渲染优化
    nuxtConfig += `  render: {\n`;
    nuxtConfig += `    static: {\n`;
    nuxtConfig += `      maxAge: 31536000,\n`;
    nuxtConfig += `    },\n`;
    
    if (config.features.includes('compression')) {
      nuxtConfig += `    compressor: {\n`;
      nuxtConfig += `      threshold: 1024,\n`;
      nuxtConfig += `    },\n`;
    }
    
    nuxtConfig += `  },\n`;
    
    await fs.writeFile(nuxtConfigPath, nuxtConfig);
  }
  
  // 添加服务端性能监控
  const perfmonContent = `
import { performance } from 'perf_hooks';

export function startPerfTrace(name) {
  return {
    start: performance.now(),
    name
  };
}

export function endPerfTrace(trace) {
  const duration = performance.now() - trace.start;
  console.log(\`[\${trace.name}] took \${duration.toFixed(2)}ms\`);
  // 可以添加发送到监控系统
}
`;
  
  await fs.writeFile(path.join(frontendPath, 'src/utils/perfmon.ts'), perfmonContent);
}
```

## 12. 安全增强

```typescript
async function enhanceSecurity(config) {
  // 设置安全HTTP头部
  await configureSecurityHeaders(config);
  
  // 添加速率限制
  await addRateLimiting(config);
  
  // CORS配置
  await configureCORS(config);
  
  // CSRF保护
  await addCSRFProtection(config);
  
  // 内容安全策略
  if (config.features.includes('csp')) {
    await addContentSecurityPolicy(config);
  }
}

async function configureSecurityHeaders(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 使用Helmet.js设置安全头部
  await addDependencies(backendPath, ['helmet']);
  
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'import express from \'express\';',
    `import express from 'express';\nimport helmet from 'helmet';`
  );
  
  appContent = appContent.replace(
    'const app = express();',
    `const app = express();\n\napp.use(helmet({\n  contentSecurityPolicy: ${config.features.includes('csp') ? 'true' : 'false'},\n  hsts: {\n    maxAge: 31536000,\n    includeSubDomains: true,\n    preload: true\n  }\n}));`
  );
  
  await fs.writeFile(appPath, appContent);
}

async function addRateLimiting(config) {
  const backendPath = path.join(config.projectPath, 'apps/backend');
  
  // 添加速率限制中间件
  await addDependencies(backendPath, ['express-rate-limit']);
  
  const appPath = path.join(backendPath, 'src/app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');
  
  appContent = appContent.replace(
    'const app = express();',
    `const app = express();\n\nimport rateLimit from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100, // limit each IP to 100 requests per window\n  standardHeaders: true, // Return rate limit info in the \`RateLimit-*\` headers\n  legacyHeaders: false, // Disable the \`X-RateLimit-*\` headers\n});\n\napp.use(limiter);`
  );
  
  await fs.writeFile(appPath, appContent);
}
```

通过以上12个维度的扩展，GenStacks DSL生成器已经成为一个功能全面、安全可靠且适应各种复杂场景的全栈项目生成工具。开发者可以通过配置文件快速生成一个包含现代化开发实践的项目骨架，大大减少了搭建项目基础设施所需的时间和工作量。