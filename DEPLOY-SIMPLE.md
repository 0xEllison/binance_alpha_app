# Cloudflare Pages简易部署指南

## 方法一：直接连接GitHub仓库（推荐）

1. 登录Cloudflare Dashboard：https://dash.cloudflare.com/
2. 导航到 **Pages** > **创建应用程序**
3. 选择"连接到Git"
4. 选择GitHub作为Git提供者并授权Cloudflare
5. 选择您的仓库
6. 配置构建设置:
   - 项目名称: binance-alpha-app
   - 生产分支: main
   - 构建命令: `npm install && npm run build`
   - 构建输出目录: `out`
   - 环境变量: 根据需要添加
7. 点击"保存并部署"

## 方法二：手动上传静态文件

如果您不想连接GitHub仓库，也可以手动上传构建好的静态文件：

1. 在本地构建项目：
```bash
npm install
npm run build
```

2. 在Cloudflare Dashboard中，转到**Pages** > **创建应用程序**
3. 选择"直接上传"
4. 拖放`out`目录中的文件或点击上传按钮选择文件
5. 点击"部署站点"

## 方法三：使用Wrangler CLI

1. 安装Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录Cloudflare账号：
```bash
wrangler login
```

3. 构建并部署项目：
```bash
npm run deploy:cloudflare
```

## 自定义域名设置

1. 在Cloudflare Pages中找到你的项目
2. 转到"自定义域"标签
3. 添加你想要使用的域名
4. 按照说明更新DNS设置 