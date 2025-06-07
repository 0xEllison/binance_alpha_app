# 币安Alpha积分计算工具

## Cloudflare Pages部署指南

本项目可以部署到Cloudflare Workers/Pages上，以下是部署步骤：

### 先决条件

1. 拥有Cloudflare账户
2. 安装Node.js (v16+)
3. 安装npm或yarn

### 配置Cloudflare

1. 登录Cloudflare仪表盘：https://dash.cloudflare.com/
2. 创建Cloudflare API令牌：
   - 导航到"我的配置文件" > "API令牌"
   - 创建具有"Workers脚本"、"Workers Routes"和"Account Settings"权限的令牌
   - 记录生成的令牌值

### 部署步骤

#### 1. 安装Wrangler CLI

```bash
npm install -g wrangler
```

#### 2. 登录Cloudflare账号

```bash
wrangler login
```

按照提示完成登录流程。

#### 3. 部署项目

方法一：使用简单部署命令：

```bash
npm run deploy:cloudflare
```

方法二：手动步骤：

```bash
# 构建项目
npm run build

# 准备Cloudflare Pages部署
npm run pages:build

# 部署到Cloudflare Pages
wrangler pages deploy .vercel/output/static
```

### 使用GitHub Actions自动部署

本项目已配置GitHub Actions工作流程，可以在推送代码到主分支时自动部署到Cloudflare Pages。

#### 配置GitHub Secrets

在GitHub仓库中添加以下Secrets：

1. `CLOUDFLARE_API_TOKEN` - 您的Cloudflare API令牌
2. `CLOUDFLARE_ACCOUNT_ID` - 您的Cloudflare账户ID

##### 获取Cloudflare账户ID

1. 登录Cloudflare仪表盘：https://dash.cloudflare.com/
2. 选择您的网站
3. 在右侧面板中找到"Account ID"

#### 工作流程说明

工作流程文件位于`.github/workflows/cloudflare-pages-deploy.yml`，包含以下步骤：

1. 检出代码
2. 设置Node.js环境
3. 安装依赖
4. 构建项目
5. 准备Cloudflare部署
6. 部署到Cloudflare Pages

每次推送到主分支时，都会触发自动部署。

### 直接连接GitHub仓库到Cloudflare Pages（推荐）

最简单的方法是直接将GitHub仓库连接到Cloudflare Pages，无需配置GitHub Actions。

#### 步骤：

1. 登录Cloudflare仪表盘 (https://dash.cloudflare.com/)
2. 进入Pages > 创建应用程序
3. 选择"连接到Git"
4. 选择GitHub作为Git提供者并授权Cloudflare
5. 选择您的仓库
6. 配置构建设置:
   - 项目名称: binance-alpha-app
   - 生产分支: main (或您的主分支)
   - 构建命令: npm run build && npm run pages:build
   - 构建输出目录: .vercel/output/static
   - 环境变量: 根据需要添加
7. 点击"保存并部署"

#### 优点:
- 无需手动部署
- 无需配置CI/CD工作流程
- 无需管理Cloudflare API令牌
- 每次推送自动部署
- 可以为每个PR创建预览部署

更多详细信息，请查看 `.github/direct-pages-setup.md` 文件。

### 自定义域名

1. 在Cloudflare仪表盘中导航到"Pages"
2. 选择您的项目
3. 点击"自定义域"
4. 添加您的域名并按照提示进行DNS配置

### 环境变量

如果您的项目需要环境变量，您可以在Cloudflare仪表盘中设置：

1. 导航到"Pages" > 您的项目 > "设置" > "环境变量"
2. 添加所需的环境变量

### 开发与调试

本地开发并测试Cloudflare Pages部署：

```bash
npm run pages:dev
```

此命令将启动本地开发服务器，模拟Cloudflare Pages环境。

### 更多信息

- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/) 