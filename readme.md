## 使用更全面的ts提示与功能脚手架开发Scratch拓展！
### 支持TurboWarp/GandiIDE

**推荐使用VSCode进行拓展开发。**

用法：
1. 克隆此项目到本地。
2. 安装依赖包（即 `npm install`）。
3. 启动webpack开发服务器，`npm run dev`，等待开发服务器显示 `compiled successfully` 后会自动打开网页 `http://127.0.0.1:25565`，初次响应需要十几秒等待webpack编译，此后修改拓展代码会自动热重载，无需手动刷新。
4. 修改 `src/extension.ts` 即可定义新积木，可在WaterBox中调试积木，或点击复制链接后将其加载到TurboWarp/GandiIDE中。
5. 检查所有积木功能无误后编译到生产环境，`npm run dist`。
6. 编译结果输出于 `dist` 文件夹中的 `extension.dist.js`。
7. 对于 `src/fs-context` 中的文件/夹均为框架代码，勿动。