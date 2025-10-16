#!/usr/bin/env node
/**
 * Vercel构建修复脚本 - CommonJS版本
 * 完全绕过Vite CLI，直接使用Vite API
 */

const { build } = require('vite');
const path = require('path');
const fs = require('fs');

async function performBuild() {
  console.log('🚀 开始Vercel构建修复...');

  try {
    // 直接调用Vite构建API
    console.log('📦 正在构建项目...');

    await build({
      root: __dirname,
      logLevel: 'info',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html')
          }
        }
      }
    });

    console.log('✅ 构建成功完成！');

    // 验证构建输出
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      console.log('📁 构建文件:', files);
    }

  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

// 执行构建
performBuild();