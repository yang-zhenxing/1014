# 创业项目市场调查数据终端演示版

这是一个用于展示信息架构和主要页面的 Windows 桌面演示工程。当前所有业务记录均为虚构示例，不连接真实数据库或第三方数据源。

## 当前内容

- 登录页：预设账号 `admin`，密码 `123123`；可从顶部右侧账号菜单退出。登录状态仅在当前窗口会话中保留。
- 10 个一级页面：工作台、数据资源、主体档案、综合检索、调查分析、投资关系、企业画像、项目推荐、资讯舆情、数据与设置。
- 项目列表与详情抽屉；综合检索支持本地关键词和赛道筛选。
- 其余图表、关系、资讯和指标为演示内容。未实现的业务操作会显示提示。
- Windows 便携版打包配置已预留，当前开发阶段无需生成 `.exe`。

## 本地开发

要求 Node.js 22 和 npm 10 或兼容版本。

```powershell
npm install
npm run dev
```

如果 Electron 的二进制文件下载停滞，可在当前 PowerShell 窗口先执行
`$env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'`，再运行
`npm install`；若依赖已装好但缺少 Electron 程序，执行 `npm rebuild electron`。

检查类型与构建：

```powershell
npm run typecheck
npm run build
```

项目结束时可使用 `npm run build:win` 构建 Windows 便携版；正式交付前还需在目标电脑上验证启动和静态资源显示。

## 目录

- `src/main`：Electron 主进程与窗口设置。
- `src/preload`：为后续备份导入导出保留的受限桌面接口位置。
- `src/renderer/src/App.tsx`：应用布局与页面。
- `src/renderer/src/data/demo.ts`：虚构演示数据。
- `electron-builder.yml`：Windows 便携版打包预留配置。

下一阶段优先完善五类主体的示例数据与页面，再增加收藏和本地保存。完整系统的采集、权限、AI 与服务端不属于当前演示工程。

当前登录校验只在前端进行，用于限制界面进入；账号密码随应用代码提供，不具备生产系统的身份认证安全性。
