#!/bin/bash

echo "Testing Cloudflare Pages build configuration..."

# 清理先前的构建
rm -rf out
echo "Cleaned previous build"

# 运行构建
echo "Running build..."
npm run build

# 检查构建输出
if [ -d "out" ]; then
  echo "✅ Build successful! 'out' directory exists."
  echo "Contents of out directory:"
  ls -la out
else
  echo "❌ Build failed! 'out' directory does not exist."
  exit 1
fi

echo "Test completed successfully!" 