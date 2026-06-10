# 炉光记忆 WebAR

面向实体 3D 打印树脂白模的 WebAR 扫描体验。第一版使用 Vite + A-Frame + AR.js，识别白模底座前方的工业铭牌 marker，不直接识别 3D 白模本体。

## 一键部署到 Google / Firebase Hosting

Firebase Hosting 属于 Google，部署后会自动提供 HTTPS 地址，适合手机测试 WebAR 摄像头。

第一次使用先登录：

```bash
npm run deploy:google:login
```

然后到 Firebase 控制台创建项目：

```text
https://console.firebase.google.com/
```

复制你的 Firebase 项目 ID，例如：

```text
furnace-memory-ar
```

一键构建并部署：

```bash
npm run deploy:google -- furnace-memory-ar
```

部署成功后终端会输出类似：

```text
Hosting URL: https://furnace-memory-ar.web.app
```

手机直接打开这个 HTTPS 地址，允许摄像头权限即可测试。

如果你已经有 Firebase 项目，也可以设置环境变量：

```bash
$env:FIREBASE_PROJECT_ID="furnace-memory-ar"
npm run deploy:google
```

注意：不要把 Gemini API Key 或其他密钥写进前端代码。这个 WebAR 项目部署不需要 Gemini Key。

## 运行项目

```bash
npm install
npm run dev
```

启动后在电脑浏览器打开终端显示的本地地址。Vite 默认会提供 `http://localhost:5173`，同一局域网手机可以访问终端里的 Network 地址。

## 手机测试

手机摄像头通常要求 HTTPS。以下场景可用：

- 电脑本机浏览器访问 `localhost`。
- 手机访问 Vercel、Netlify、GitHub Pages 等 HTTPS 部署地址。
- 手机访问局域网 IP 时，如果浏览器不允许摄像头，请改用 HTTPS 部署。

测试步骤：

1. 手机横屏打开页面。
2. 点击「启动 AR」。
3. 浏览器弹出摄像头权限时选择允许。
4. 将白模底座前方的识别铭牌完整放入画面。
5. 识别成功后，页面右上角状态会变为「铭牌已识别」。

## 打印 marker

打印文件：

```text
public/assets/marker/custom-marker.png
```

建议：

- 按正方形打印，实际尺寸约 `10cm x 10cm`。
- 使用哑光纸或哑光贴纸，避免反光。
- 不要裁掉外侧黑色边框。
- 打印后保持平整，不要弯折。

`custom-marker.patt` 是 AR.js 使用的识别文件，已经由这张铭牌图生成：

```text
public/assets/marker/custom-marker.patt
```

## 粘贴到实体白模底座

推荐摆放：

- 实体树脂白模放在展示底板中央。
- marker 贴在白模底座前方，边缘与底板方向对齐。
- marker 中心作为 AR 坐标原点。
- 当前默认校准假设白模中心在 marker 后方约 `z = -0.25m`。

如果手机画面里 AR 特效没有覆盖到实体白模上方，使用校准面板调整。

## 校准 AR 特效

点击右侧「校准模式」打开面板，可调整：

- `overlay position x`
- `overlay position y`
- `overlay position z`
- `overlay rotation x`
- `overlay rotation y`
- `overlay rotation z`
- `overlay scale`

参数会自动保存到 `localStorage`，刷新页面后仍然生效。点击「重置」会恢复默认参数：

```js
{
  px: 0,
  py: 0.02,
  pz: -0.25,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 1
}
```

校准建议：

1. 先调整 `overlay position z`，让特效整体移动到实体白模上方。
2. 再调整 `overlay position x/y`，对齐白模中心和高度。
3. 如果 marker 贴歪了，再微调 `overlay rotation y/z`。
4. 最后调整 `overlay scale`，让轮廓和热点大小接近实体比例。

## NPC 引导员与动作

当前 NPC 使用你提供的男生照片作为原型，生成了 Q 版 2D 引导员，并拆成 6 个动作状态：

```text
public/assets/images/npc/idle.png
public/assets/images/npc/scan.png
public/assets/images/npc/explain.png
public/assets/images/npc/success.png
public/assets/images/npc/calibrate.png
public/assets/images/npc/photo.png
```

`npc-action-contact-sheet.png` 是动作预览图，方便检查整套角色是否统一。

兼容路径：

```text
public/assets/images/npc-guide.png
public/assets/images/guide-worker.png
```

`npc-guide.png` 默认指向待机动作，用于旧代码兼容；`guide-worker.png` 保留为 AR 场景里的 2D 人物贴图。

替换方式：

1. 准备透明背景 PNG。
2. 按动作名覆盖 `public/assets/images/npc/` 下的同名文件。
3. 如果只替换一个默认 NPC，可以覆盖 `npc-guide.png`。
4. 刷新页面即可生效。

如果新人物比例不合适，可以在 `src/main.js` 中调整：

```js
guide.setAttribute('position', '-0.42 0.18 0.16');
guide.setAttribute('width', '0.2');
guide.setAttribute('height', '0.28');
```

NPC 的全程引导文案在 `src/main.js` 的 `setNpcMessage(...)` 调用里维护。当前会在启动前、请求摄像头、扫描中、铭牌识别成功、炉光点亮、热点显示隐藏、校准和拍照打卡时自动切换提示。

## UI 素材

按钮和面板素材在：

```text
public/assets/ui/button-primary.svg
public/assets/ui/button-tool.svg
public/assets/ui/button-tool-active.svg
public/assets/ui/panel-bubble.svg
public/assets/ui/icon-start.svg
public/assets/ui/icon-info.svg
public/assets/ui/icon-furnace.svg
public/assets/ui/icon-hotspot.svg
public/assets/ui/icon-camera.svg
public/assets/ui/icon-calibrate.svg
public/assets/ui/icon-reset.svg
```

这些 SVG 已接入开始按钮、右侧工具按钮和 NPC 对话气泡。要替换按钮风格，优先替换 `button-*.svg`；要替换图标，覆盖对应 `icon-*.svg`。

## 后续切换到 MindAR 图片识别

当前版本使用 AR.js marker-based tracking：

```html
<a-marker type="pattern" url="/assets/marker/custom-marker.patt">
```

如果后续希望识别更自然的工业铭牌、展板图片或不带黑框的图像，可以切换到 MindAR image tracking：

1. 安装或 CDN 引入 MindAR。
2. 使用 MindAR 工具把识别图编译为 `.mind` 文件。
3. 将当前 `overlay-root` 的内容迁移到 MindAR 的 image target 节点下。
4. 保留同一套校准参数逻辑，只把追踪坐标系从 AR.js marker 改为 MindAR image target。

MindAR 更适合自然图像识别；AR.js marker 更适合第一版快速稳定演示。

## 主要文件

```text
package.json
index.html
src/main.js
src/style.css
public/assets/marker/custom-marker.patt
public/assets/marker/custom-marker.png
public/assets/images/npc/idle.png
public/assets/images/npc/scan.png
public/assets/images/npc/explain.png
public/assets/images/npc/success.png
public/assets/images/npc/calibrate.png
public/assets/images/npc/photo.png
public/assets/images/npc-guide.png
public/assets/images/guide-worker.png
public/assets/images/glow-particle.png
public/assets/images/checkin-frame.png
public/assets/ui/button-primary.svg
public/assets/ui/button-tool.svg
public/assets/ui/button-tool-active.svg
public/assets/ui/panel-bubble.svg
```
