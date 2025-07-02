import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { generateProject } from './generator';
import { ProjectConfig } from './types';

async function enhancedPrompts() {
  return inquirer.prompt([
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
        { name: 'CI/CD Pipeline', value: 'ci-cd' },
        { name: 'GraphQL', value: 'graphql' },
        { name: 'Passport.js Auth', value: 'auth-passport' },
        { name: 'OAuth (Google)', value: 'auth-oauth' }
      ],
      default: ['docker', 'testing']
    },
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
        { name: 'Redux Toolkit', value: 'redux', disabled: (ans: any) => ans.frontend.language === 'javascript' && ans.frontend.framework === 'vue' ? 'Not recommended with Vue+JS' : false },
        { name: 'Vuex (for Vue)', value: 'vuex', when: (ans: any) => ans.frontend.framework === 'vue' },
        { name: 'Zustand', value: 'zustand' },
        { name: 'Recoil', value: 'recoil', when: (ans: any) => ans.frontend.framework === 'react' },
        { name: 'None', value: 'none' }
      ],
      default: (ans: any) => ans.frontend.framework === 'vue' ? 'vuex' : 'redux'
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
        { name: 'SEO Optimization', value: 'seo' },
        { name: 'PWA Support', value: 'pwa' },
        { name: 'Asset Compression', value: 'compression' },
        { name: 'Image Optimization', value: 'image-optimization' },
        { name: 'Bundle Analysis', value: 'bundle-analyze' }
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
      default: 'tailwind'
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
    },
    {
      type: 'checkbox',
      name: 'deploy',
      message: 'Select deployment targets:',
      choices: [
        { name: 'Docker', value: 'docker' },
        { name: 'Kubernetes', value: 'kubernetes' },
        { name: 'AWS', value: 'aws' },
        { name: 'Aliyun', value: 'aliyun' },
        { name: 'Tencent Cloud', value: 'tencent' },
        { name: 'Serverless', value: 'serverless' }
      ],
      default: ['docker']
    }
  ]);
}

async function main() {
  console.log('🚀 Welcome to GenStacks Project Generator');
  
  const answers = await enhancedPrompts();

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
    databases: answers.databases || [],
    features: answers.features || [],
    withSSR: answers.withSSR,
    stateManagement: answers.stateManagement,
    additionalFeatures: answers.additionalFeatures || [],
    cssSolution: answers.cssSolution,
    withStorybook: answers.withStorybook,
    withE2E: answers.withE2E,
    deploy: answers.deploy || [],
    backendPort: 4000, // Default backend port
    frontendPort: 3000, // Default frontend port
    dockerPrefix: 'genstacks' // Default Docker image prefix
  };

  // Save config
  await fs.writeJson(path.join(process.cwd(), 'genstacks.config.json'), config, { spaces: 2 });
  
  // Generate project
  await generateProject(config);
  
  console.log(`✅ Project ${config.projectName} generated successfully!`);
  console.log('👉 Next steps:');
  console.log(`  cd ${config.projectName}`);
  console.log('  pnpm install');
  console.log('  pnpm dev');
}

main().catch(console.error); 