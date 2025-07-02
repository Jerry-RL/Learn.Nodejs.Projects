import path from 'path';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import { ProjectConfig } from './types';

// Register Handlebars helpers
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('includes', (array, value) => array.includes(value));

// Helper to recursively walk a directory
async function walkDir(dir: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

export async function generateProject(config: ProjectConfig) {
  const projectPath = path.join(process.cwd(), config.projectName);
  
  // Create project directory
  await fs.ensureDir(projectPath);
  
  // Generate Monorepo base structure
  await generateMonorepoBase(projectPath, config);
  
  // Generate backend project
  await generateBackend(projectPath, config);
  
  // Generate frontend project
  await generateFrontend(projectPath, config);
  
  // Generate shared packages (if any, though not explicitly mentioned for now)
  await generateSharedPackages(projectPath, config);
  
  // Generate Docker configuration
  if (config.features.includes('docker')) {
    await generateDockerConfig(projectPath, config);
  }
  
  // Generate CI/CD configuration
  if (config.features.includes('ci-cd')) {
    await generateCICDConfig(projectPath, config);
  }

  // Generate GraphQL support
  if (config.features.includes('graphql')) {
    await generateGraphQLSupport(path.join(projectPath, 'apps/backend'), config);
  }

  // Generate enhanced authentication
  if (config.features.includes('auth')) {
    await generateEnhancedAuth(path.join(projectPath, 'apps/backend'), config);
  }

  // Generate multi-environment config
  await generateEnvironmentConfig(projectPath, config);

  // Generate microservices (if configured)
  if (config.microservices && config.microservices.length > 0) {
    await generateMicroservices(projectPath, config);
  }

  // Enhance code quality
  await enhanceCodeQuality(projectPath, config);

  // Add observability
  await addObservability(projectPath, config);

  // Optimize frontend
  await optimizeFrontend(projectPath, config);

  // Enhance security
  await enhanceSecurity(projectPath, config);

  // Generate multi-deploy targets
  await generateMultiDeployTargets(projectPath, config);

  // Generate README
  await generateReadme(projectPath, config);
}

async function generateMonorepoBase(projectPath: string, config: ProjectConfig) {
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
        turbo: 'latest',
        pnpm: 'latest'
      }
    }, null, 2)
  );
  
  await fs.writeFile(
    path.join(projectPath, 'pnpm-workspace.yaml'),
    `packages:\n  - 'apps/*'\n  - 'packages/*'`
  );
  
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
  
  await fs.ensureDir(path.join(projectPath, 'apps'));
  await fs.ensureDir(path.join(projectPath, 'packages'));
}

async function generateBackend(projectPath: string, config: ProjectConfig) {
  const backendPath = path.join(projectPath, 'apps', 'backend');
  const templateName = `${config.backend.framework}-${config.backend.language}`;
  
  const templatePath = path.join(__dirname, '../templates', 'backend', templateName);
  await fs.copy(templatePath, backendPath);
  
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
  
  const pkgPath = path.join(backendPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = `@${config.projectName}/backend`;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  
  if (config.databases.length > 0) {
    await addDatabaseConfig(backendPath, config);
  }
  
  if (config.features.includes('auth')) {
    await addAuthFeature(backendPath, config);
  }
}

async function generateFrontend(projectPath: string, config: ProjectConfig) {
  const frontendPath = path.join(projectPath, 'apps', 'frontend');
  const templateName = `${config.frontend.framework}-${config.frontend.language}`;
  
  const templatePath = path.join(__dirname, '../templates', 'frontend', templateName);
  await fs.copy(templatePath, frontendPath);
  
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
  
  const pkgPath = path.join(frontendPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = `@${config.projectName}/frontend`;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  
  // await addApiClient(frontendPath, config);
}

async function generateSharedPackages(projectPath: string, config: ProjectConfig) {
  // Placeholder for shared packages generation
}

async function generateDockerConfig(projectPath: string, config: ProjectConfig) {
  // Placeholder for Docker configuration generation
}

async function generateCICDConfig(projectPath: string, config: ProjectConfig) {
  // Placeholder for CI/CD configuration generation
}

async function generateGraphQLSupport(backendPath: string, config: ProjectConfig) {
  const pkgPath = path.join(backendPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  const isTypeScript = config.backend.language === 'typescript';
  const isNestJS = config.backend.framework === 'nestjs';
  const appEntryFile = isTypeScript ? 'src/app.ts' : 'src/app.js';
  const appPath = path.join(backendPath, appEntryFile);
  let appContent = await fs.readFile(appPath, 'utf-8');

  // Add GraphQL dependencies
  pkg.dependencies.graphql = '^16.8.0';
  pkg.dependencies['apollo-server-express'] = '^3.12.0';
  pkg.dependencies['@graphql-tools/load'] = '^8.0.0';
  pkg.dependencies['@graphql-tools/graphql-file-loader'] = '^8.0.0';
  pkg.dependencies['@graphql-tools/schema'] = '^10.0.0';

  if (isTypeScript) {
    pkg.devDependencies['@types/graphql'] = '^14.5.0';
    pkg.devDependencies['@types/apollo-server-express'] = '^3.5.7';
  }

  if (isNestJS) {
    pkg.dependencies['@nestjs/graphql'] = '^12.0.0';
    pkg.dependencies['@nestjs/apollo'] = '^12.0.0';
    pkg.dependencies['apollo-server-core'] = '^3.12.0'; // For ApolloDriverConfig
    pkg.dependencies['class-validator'] = '^0.14.0';
    pkg.dependencies['class-transformer'] = '^0.5.1';
  }

  // Create GraphQL schema file
  const schemaDir = path.join(backendPath, 'src');
  await fs.ensureDir(schemaDir);
  const schemaPath = path.join(schemaDir, 'schema.graphql');
  const schemaContent = `# Autogenerated by GenStacks\n\ntype Query {\n  hello: String\n}\n\ntype Mutation {\n  # Add your mutations here\n}\n`;
  await fs.writeFile(schemaPath, schemaContent);

  if (isNestJS) {
    // NestJS GraphQL integration
    const appModulePath = path.join(backendPath, 'src/app.module.ts');
    let appModuleContent = await fs.readFile(appModulePath, 'utf-8');

    // Add imports for GraphQLModule
    appModuleContent = appModuleContent.replace(
      'imports: [',
      `import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),`
    );
    await fs.writeFile(appModulePath, appModuleContent);
  } else {
    // Express GraphQL integration
    const graphQLIntegration = `
${isTypeScript ? "import { ApolloServer } from 'apollo-server-express';\nimport { loadSchemaSync } from '@graphql-tools/load';\nimport { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';\nimport { addResolversToSchema } from '@graphql-tools/schema';" : "const { ApolloServer } = require('apollo-server-express');\nconst { loadSchemaSync } = require('@graphql-tools/load');\nconst { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');\nconst { addResolversToSchema } = require('@graphql-tools/schema');"}

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

async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}
startApolloServer();
`;

    appContent = appContent.replace(
      isTypeScript ? "import express from 'express';" : "const express = require('express');",
      `${isTypeScript ? "import express from 'express';" : "const express = require('express');"}\n${graphQLIntegration}`
    );
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  await fs.writeFile(appPath, appContent);

  console.log(`📡 Added GraphQL support to the backend.`);
}

async function generateEnhancedAuth(backendPath: string, config: ProjectConfig) {
  // Placeholder for enhanced authentication generation
}

async function generateEnvironmentConfig(projectPath: string, config: ProjectConfig) {
  const envDir = path.join(projectPath, 'environments');
  await fs.ensureDir(envDir);
  
  const backendPath = path.join(projectPath, 'apps/backend');

  const envVars = {
    NODE_ENV: 'development',
    LOG_LEVEL: 'debug',
    DB_HOST: 'localhost',
    DB_PORT: config.databases.includes('postgres') ? '5432' : '',
    DB_USER: 'app_user',
    DB_PASSWORD: 'app_password',
    DB_NAME: `${config.projectName}_dev`,
    MONGO_URI: config.databases.includes('mongo') ? 'mongodb://localhost:27017/mydatabase' : '',
    API_BASE_URL: `http://localhost:${config.backendPort}`,
    FRONTEND_URL: `http://localhost:${config.frontendPort}`,
    JWT_SECRET: 'supersecretjwtkey',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    SENTRY_DSN: '',
  };
  
  const environments = ['development', 'staging', 'production'];
  
  for (const env of environments) {
    const envConfig = { ...envVars };
    
    if (env === 'production') {
      envConfig.NODE_ENV = 'production';
      envConfig.LOG_LEVEL = 'info';
      envConfig.DB_HOST = `${config.projectName}-postgres`;
      envConfig.DB_NAME = `${config.projectName}_prod`;
      if (config.databases.includes('mongo')) {
        envConfig.MONGO_URI = `mongodb://${config.projectName}-mongodb:27017/${config.projectName}_prod`;
      }
      envConfig.API_BASE_URL = `https://api.${config.projectName}.com`;
      envConfig.FRONTEND_URL = `https://${config.projectName}.com`;
    } else if (env === 'staging') {
      envConfig.DB_NAME = `${config.projectName}_staging`;
      if (config.databases.includes('mongo')) {
        envConfig.MONGO_URI = `mongodb://${config.projectName}-mongodb:27017/${config.projectName}_staging`;
      }
      envConfig.API_BASE_URL = `https://staging-api.${config.projectName}.com`;
      envEND_CODE
      envConfig.FRONTEND_URL = `https://staging.${config.projectName}.com`;
    }
    
    let content = `# ${env.toUpperCase()} Environment Variables\n\n`;
    for (const [key, value] of Object.entries(envConfig)) {
      content += `${key}=${value}\n`;
    }
    
    await fs.writeFile(path.join(envDir, `.env.${env}`), content);
  }
  
  const configLoaderContent = `
${config.backend.language === 'typescript' ? "import dotenv from 'dotenv';\nimport path from 'path';" : "const dotenv = require('dotenv');\nconst path = require('path');"}

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, \`../environments/.env.\${env}\`) });

const appConfig = {
  env,
  port: process.env.PORT || ${config.backendPort},
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    mongoUri: process.env.MONGO_URI,
  },
  api: {
    baseUrl: process.env.API_BASE_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  sentryDsn: process.env.SENTRY_DSN,
};

export default appConfig;
`;
  
  await fs.writeFile(path.join(backendPath, 'src/config.ts'), configLoaderContent);
  
  console.log('🌿 Generated multi-environment configuration');
}

async function generateMicroservices(projectPath: string, config: ProjectConfig) {
  // Placeholder for core logic, as the actual template generation is handled by generateBackend for each microservice
  console.log('⚙️ Generating microservices...');

  // Generate each microservice
  for (const service of config.microservices!) {
    const serviceConfig: ProjectConfig = {
      ...config,
      projectName: service.name,
      backend: {
        ...config.backend,
        framework: service.framework || config.backend.framework
      },
      features: service.features || config.features
    };
    
    const servicePath = path.join(projectPath, 'apps', service.name);
    await fs.ensureDir(servicePath); // Ensure service directory exists
    await generateBackend(projectPath, serviceConfig); // Use existing backend generator for each service

    // Add inter-service communication
    if (service.communication === 'grpc') {
      await addGRPCIntegration(servicePath, serviceConfig);
    } else if (service.communication === 'message-queue') {
      await addMessageQueueIntegration(servicePath, serviceConfig);
    }
  }

  // Generate API Gateway
  await generateApiGateway(projectPath, config);

  // Generate Service Discovery configuration
  await generateServiceDiscovery(projectPath, config);

  console.log(`✅ Microservices generated.`);
}

async function addGRPCIntegration(servicePath: string, config: ProjectConfig) {
  console.log(`🔌 Adding gRPC support to ${path.basename(servicePath)}`);
  
  const pkgPath = path.join(servicePath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  const isTypeScript = config.backend.language === 'typescript';

  // Add dependencies
  pkg.dependencies['@grpc/grpc-js'] = '^1.9.0';
  pkg.dependencies['@grpc/proto-loader'] = '^0.1.0';
  if (isTypeScript) {
    pkg.devDependencies['@types/google-protobuf'] = '^3.15.6';
    pkg.devDependencies['@types/grpc__grpc-js'] = '^1.6.5';
  }
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  
  // Generate protocol file
  const protoDir = path.join(servicePath, 'proto');
  await fs.ensureDir(protoDir);
  const protoPath = path.join(protoDir, `${config.projectName}.proto`);
  const protoContent = `syntax = \"proto3\";\\n\\nservice ${toPascalCase(config.projectName)}Service {\\n  rpc GetExample (ExampleRequest) returns (ExampleResponse);\\n}\\n\\nmessage ExampleRequest {\\n  string id = 1;\\n}\\n\\nmessage ExampleResponse {\\n  string name = 1;\\n  int32 value = 2;\\n}\\n`;
  await fs.writeFile(protoPath, protoContent);
  
  // Generate gRPC server
  const grpcServerPath = path.join(servicePath, 'src/grpc-server.ts');
  const grpcServerContent = `
  const appEntryFile = isTypeScript ? 'src/app.ts' : 'src/app.js';
  const appPath = path.join(backendPath, appEntryFile);
  let appContent = await fs.readFile(appPath, 'utf-8');

  // Add dependencies based on selected databases
  if (config.databases.includes('postgres')) {
    pkg.dependencies.pg = '^8.11.0';
    pkg.dependencies.typeorm = '^0.3.17';
    if (isTypeScript) {
      pkg.devDependencies['@types/pg'] = '^8.11.0';
      pkg.devDependencies['@types/typeorm'] = '^0.2.20';
    }
    // Add PostgreSQL connection logic
    const postgresImport = isTypeScript ? "import { DataSource } from 'typeorm';" : "const { DataSource } = require('typeorm');";
    const postgresConfig = isTypeScript ? `
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: true,
  logging: false,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL connected!")
  })
  .catch((error) => console.log(error));
` : `
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: true,
  logging: false,
  entities: ["./**/*.entity.js"],
  migrations: ["./migration/**/*.js"],
  subscribers: ["./subscriber/**/*.js"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL connected!")
  })
  .catch((error) => console.log(error));
`;
    appContent = appContent.replace(
      isTypeScript ? "import express from 'express';" : "const express = require('express');",
      `${isTypeScript ? "import express from 'express';" : "const express = require('express');"}\n${postgresImport}\n${postgresConfig}`
    );
  }

  if (config.databases.includes('mongo')) {
    pkg.dependencies.mongoose = '^7.4.3';
    // Add MongoDB connection logic
    const mongoImport = isTypeScript ? "import mongoose from 'mongoose';" : "const mongoose = require('mongoose');";
    const mongoConfig = `
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));
`;
    appContent = appContent.replace(
      isTypeScript ? "import express from 'express';" : "const express = require('express');",
      `${isTypeScript ? "import express from 'express';" : "const express = require('express');"}\n${mongoImport}\n${mongoConfig}`
    );
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  await fs.writeFile(appPath, appContent);
}

async function addAuthFeature(backendPath: string, config: ProjectConfig) {
  const pkgPath = path.join(backendPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  const isTypeScript = config.backend.language === 'typescript';
  const appEntryFile = isTypeScript ? 'src/app.ts' : 'src/app.js';
  const appPath = path.join(backendPath, appEntryFile);
  let appContent = await fs.readFile(appPath, 'utf-8');

  const authStrategies: string[] = [];
  let authContent = '';
  let appAuthIntegration = '';
  let appAuthImports = '';

  // Basic JWT authentication
  pkg.dependencies.jsonwebtoken = '^9.0.0';
  pkg.dependencies.bcrypt = '^5.1.0';
  if (isTypeScript) {
    pkg.devDependencies['@types/jsonwebtoken'] = '^9.0.0';
    pkg.devDependencies['@types/bcrypt'] = '^5.0.0';
  }
  authStrategies.push('JWT');

  authContent += `
${isTypeScript ? "import jwt from 'jsonwebtoken';\nimport bcrypt from 'bcrypt';" : "const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcrypt');"}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SALT_ROUNDS = 10;

export const hashPassword = async (password${isTypeScript ? ': string' : ''}) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password${isTypeScript ? ': string' : ''}, hash${isTypeScript ? ': string' : ''}) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user${isTypeScript ? ': any' : ''}) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateJWT = (req${isTypeScript ? ': any' : ''}, res${isTypeScript ? ': any' : ''}, next${isTypeScript ? ': any' : ''}) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err${isTypeScript ? ': any' : ''}, user${isTypeScript ? ': any' : ''}) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
`;

  // Add Passport strategies
  if (config.features.includes('auth-passport')) {
    pkg.dependencies.passport = '^0.6.0';
    pkg.dependencies['passport-local'] = '^1.0.0';
    pkg.dependencies['passport-jwt'] = '^4.0.1';
    if (isTypeScript) {
      pkg.devDependencies['@types/passport'] = '^0.5.9';
      pkg.devDependencies['@types/passport-local'] = '^1.0.34';
      pkg.devDependencies['@types/passport-jwt'] = '^4.0.1';
    }
    authStrategies.push('Passport');

    authContent += `
${isTypeScript ? "import passport from 'passport';\nimport { Strategy as LocalStrategy } from 'passport-local';\nimport { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';" : "const passport = require('passport');\nconst LocalStrategy = require('passport-local').Strategy;\nconst JwtStrategy = require('passport-jwt').Strategy;\nconst ExtractJwt = require('passport-jwt').ExtractJwt;"}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email${isTypeScript ? ': string' : ''}, password${isTypeScript ? ': string' : ''}, done${isTypeScript ? ': any' : ''}) => {
  try {
    // This User model needs to be defined based on ORM/ODM choices
    const User = {}; // Placeholder
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

passport.use(new JwtStrategy(jwtOptions, async (payload${isTypeScript ? ': any' : ''}, done${isTypeScript ? ': any' : ''}) => {
  try {
    const User = {}; // Placeholder
    const user = await User.findById(payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error);
  }
}));

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
`;

    appAuthIntegration += `\napp.use(passportInitialize);\napp.use(passport.session());`;
    appAuthImports += `\nimport { passportInitialize } from './auth';\nimport passport from 'passport';`;
  }

  // Add OAuth (Google) support
  if (config.features.includes('auth-oauth')) {
    pkg.dependencies['passport-google-oauth20'] = '^2.0.0';
    if (isTypeScript) {
      pkg.devDependencies['@types/passport-google-oauth20'] = '^2.0.11';
    }
    authStrategies.push('Google OAuth');

    authContent += `
${isTypeScript ? "import { Strategy as GoogleStrategy } from 'passport-google-oauth20';" : "const GoogleStrategy = require('passport-google-oauth20').Strategy;"}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback'
}, async (accessToken${isTypeScript ? ': string' : ''}, refreshToken${isTypeScript ? ': string' : ''}, profile${isTypeScript ? ': any' : ''}, done${isTypeScript ? ': any' : ''}) => {
  try {
    const User = {}; // Placeholder
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
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
    appAuthImports += `\nimport { googleAuth, googleCallback } from './auth';`;
  }

  // Save authentication file
  await fs.writeFile(path.join(backendPath, 'src/auth.ts'), authContent);

  // Add auth routes
  const routesDir = path.join(backendPath, 'src/routes');
  await fs.ensureDir(routesDir);
  const routesPath = path.join(routesDir, 'auth.ts');
  let routesContent = `
${isTypeScript ? "import express from 'express';" : "const express = require('express');"}
${isTypeScript ? `import { 
  authenticateJWT, 
  ${config.features.includes('auth-oauth') ? 'googleAuth, \n  googleCallback,' : ''}
} from '../auth';` : `const { authenticateJWT, ${config.features.includes('auth-oauth') ? 'googleAuth, googleCallback,' : ''} } = require('../auth');`}

const router = express.Router();

router.post('/login', authenticateJWT, (req${isTypeScript ? ': any' : ''}, res${isTypeScript ? ': any' : ''}) => {
  // Implement login logic
  res.json({ message: 'Login successful', user: req.user });
});

router.post('/register', (req${isTypeScript ? ': any' : ''}, res${isTypeScript ? ': any' : ''}) => {
  // Implement registration logic
  res.json({ message: 'Registration successful' });
});

${config.features.includes('auth-oauth') ? `
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback, (req${isTypeScript ? ': any' : ''}, res${isTypeScript ? ': any' : ''}) => {
  // Handle successful Google OAuth callback
  res.json({ message: 'Google Auth successful', user: req.user });
});
` : ''}

export default router;
`;
  await fs.writeFile(routesPath, routesContent);

  // Update entry file to add authentication middleware and routes
  appContent = appContent.replace(
    isTypeScript ? "import express from 'express';" : "const express = require('express');",
    `${isTypeScript ? "import express from 'express';" : "const express = require('express');"}\n${appAuthImports}\nimport { passportInitialize } from './auth';\nimport passport from 'passport';`
  );

  appContent = appContent.replace(
    isTypeScript ? "app.use(express.json());" : "app.use(express.json());",
    `${isTypeScript ? "app.use(express.json());" : "app.use(express.json());"}\n${appAuthIntegration}\napp.use('/api/auth', authRoutes);`
  );

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  await fs.writeFile(appPath, appContent);

  console.log(`🔐 Added authentication with strategies: ${authStrategies.join(', ')}`);
} 