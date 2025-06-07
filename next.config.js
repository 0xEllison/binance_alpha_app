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
}

module.exports = nextConfig 