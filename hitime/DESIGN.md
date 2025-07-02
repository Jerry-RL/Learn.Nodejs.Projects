# HiTime 设计稿与规范

## Figma 设计稿
- [Figma 原型链接（占位）](https://www.figma.com/file/xxxx/HiTime-Design)
- 包含日历主界面、事件类型、侧边栏、编辑模态框、响应式断点等

## Storybook 组件库
- 启动：`npm run storybook`（前端目录）
- 预览所有核心 UI 组件，便于复用与测试

## 设计规范
- 风格：macOS 日历/提醒事项融合，Neumorphism 新拟物，玻璃拟态
- 色板：系统主色、语义色、13级灰度
- 间距：8px 基础网格
- 图标：SF Symbols 风格，线性/填充双模式
- 动效：拖拽、切换、打卡等微交互

## 国际化（i18n）
- 支持多语言（en、zh-CN 等），见 frontend/src/locales/
- 组件/页面均用 key/value 方式适配

## 响应式断点
- <640px：单列，侧边栏汉堡菜单
- 640-1024px：双栏，紧凑月视图
- >1024px：三栏，完整周视图

--- 