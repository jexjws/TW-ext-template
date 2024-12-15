import { Scratch } from "@framework/internal";
import { Collaborator, Extension, Translator, Version, BlockType } from "@framework/structs";
import { GlobalContext, Unnecessary } from "@framework/tools";
import "./style.css";
const translator = Translator.create("zh-cn", {
    name: "内嵌Python",
    description: "使用pyscript嵌入Python",
    run: "设置[console:string]中的代码[code:string=print('hello world')]",
    create: "创建控制台[name:string]",
    startRendering: "开始渲染[console:string]"
});
export default class FSIFrame extends Extension {
    id = "pyinner";
    displayName = translator.load("name");
    version = new Version(1, 0, 0);
    description = translator.load("description");
    collaborators = [
        new Collaborator("FallingShrimp", "https://rundll86.github.io")
    ];
    init(runtime: Scratch) {
        runtime.renderer.canvas.parentElement?.appendChild(
            dataStore.read("rootBase").result
        );
        document.head.appendChild(
            Unnecessary.elementTree("script")
                .attribute("src", "https://pyscript.net/releases/2024.11.1/core.js")
                .attribute("type", "module")
                .result
        );
    };
    @BlockType.Command(translator.load("create"))
    create(arg: Record<string, any>) {
        dataStore.read("consoles")[arg.name] = Unnecessary.elementTree("mpy-script" as any);
    };
    @BlockType.Command(translator.load("run"))
    run(arg: Record<string, any>) {
        dataStore.read("consoles")[arg.console].attribute("innerHTML", arg.code);
    };
    @BlockType.Command(translator.load("startRendering"))
    startRendering(arg: Record<string, any>) {
        dataStore.read("rootBase").child(dataStore.read("consoles")[arg.console]);
    };
};
const dataStore = GlobalContext.createDataStore(FSIFrame, {
    consoles: {} as Record<string, any>,
    rootBase: Unnecessary.elementTree("div").class("fsi-base")
});