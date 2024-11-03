## 使用新的拓展开发格式开发Scratch拓展！
### 支持TurboWarp/GandiIDE

**推荐使用VSCode进行拓展开发。**

用法：
1. 克隆此项目到本地
2. 安装依赖包（即 `npm install`）
3. 调用webpack编译项目，`npm start`
4. 修改 `src/extension.ts` 即可定义新积木，保存后会自动重新编译

建议：
1. VSCode安装插件 `live-server`
2. 打开 `index.html` ，点击VSCode右下角的 `Go Live` 按钮
3. 将拓展加载到编辑器时使用URL `http://127.0.0.1:5500/dist/dist.js`
4. 不推荐将以开发环境编译的拓展发布到任何社区，请先将 `webpack.config.js` 中的 `mode` 配置项从 `development` 改为 `producion` 再发布