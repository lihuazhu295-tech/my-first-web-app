#!/usr/bin/env node
// 直接调用Vite构建，绕过所有命令行问题
const { build } = require('vite');
const path = require('path');

console.log('Starting Vite build process...');

// 直接调用Vite的build函数
build({
  root: __dirname,
  logLevel: 'info'
}).then(() => {
  console.log('Build completed successfully!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});