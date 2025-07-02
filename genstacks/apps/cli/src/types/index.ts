export interface ProjectConfig {
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
  features: ('docker' | 'auth' | 'testing' | 'ci-cd' | 'graphql' | 'auth-passport' | 'auth-oauth' | 'i18n' | 'theming' | 'analytics' | 'errorTracking' | 'seo' | 'pwa' | 'compression' | 'image-optimization' | 'bundle-analyze')[];
  withSSR?: boolean;
  stateManagement?: 'redux' | 'vuex' | 'zustand' | 'recoil' | 'none';
  additionalFeatures?: ('i18n' | 'theming' | 'analytics' | 'errorTracking' | 'seo')[];
  cssSolution?: 'modules' | 'styled' | 'tailwind' | 'sass' | 'emotion';
  withStorybook?: boolean;
  withE2E?: boolean;
  deploy?: ('docker' | 'kubernetes' | 'aws' | 'azure' | 'gcp' | 'serverless')[];
  backendPort?: number;
  frontendPort?: number;
  dockerPrefix?: string;
  microservices?: {
    name: string;
    framework?: string;
    features?: string[];
    communication?: 'grpc' | 'message-queue';
  }[];
} 