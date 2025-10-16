#!/bin/bash
echo "Starting Vercel build process..."

# 确保Vite可用
npx vite --version

# 运行构建
echo "Running Vite build..."
npx vite build

echo "Build completed successfully!"