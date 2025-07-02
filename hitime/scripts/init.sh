#!/bin/bash
set -e

echo '== 初始化前端依赖 =='
cd frontend && npm install && cd ..

echo '== 初始化后端依赖 =='
cd backend && go mod tidy && cd ..

echo '== 初始化数据库（如有 migrate 工具可补充）=='
# 可选：自动执行 db/schema.sql 或迁移

echo '== 初始化完成！=='
echo '可使用 docker-compose up --build 启动全部服务。'
echo '前端: http://localhost:3000  后端: http://localhost:8080  Storybook: http://localhost:6006' 