# Cloudflare Pages部署指南

## 准备工作

在部署前，请确保您的package.json和package-lock.json文件是同步的：

```bash
# 在本地更新package-lock.json
npm install
# 然后提交更新后的文件
git add package-lock.json
git commit -m "更新package-lock.json"
git push
```

## 通过命令行部署

1. 确保已安装Wrangler CLI：
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

## 通过Cloudflare Pages网页控制台部署

1. 登录Cloudflare Dashboard：https://dash.cloudflare.com/
2. 进入Pages > 创建应用程序
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

## 手动部署

如果你在Cloudflare Pages自动化部署中遇到问题，可以尝试手动部署：

1. 构建项目：
```bash
npm install
npm run build
```

2. 在Cloudflare Dashboard中，转到Pages > 你的项目
3. 点击"上传"
4. 将`out`目录中的文件拖放到上传区域

## 故障排除

如果你在部署过程中遇到错误，请检查以下几点：

1. **构建错误**：确保你的项目可以在本地成功构建
2. **package-lock.json同步问题**：如果出现`npm ci`错误，请在本地运行`npm install`并提交更新后的package-lock.json
3. **权限问题**：确保Wrangler已正确登录到你的Cloudflare账户
4. **路径问题**：确保`out`目录存在并包含所有必要的构建文件
5. **配置问题**：检查`next.config.js`中的`output: 'export'`设置是否正确

## 自定义域名设置

1. 在Cloudflare Pages中找到你的项目
2. 转到"自定义域"标签
3. 添加你想要使用的域名
4. 按照说明更新DNS设置

## 环境变量

如果你的应用程序需要环境变量，可以在Cloudflare Pages的"设置">"环境变量"部分添加它们。 