/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 设置构建输出目标为静态HTML导出
  output: 'export',
  // 配置静态图片优化
  images: {
    unoptimized: true,
  },
  // 将静态文件输出到out目录
  distDir: 'out',
  // 启用Cloudflare Pages兼容性
  experimental: {
    // 使用appDir时确保兼容性
    appDir: false,
  },
}

module.exports = nextConfig 