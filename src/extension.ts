import { ColorDefine } from "./fs-context/internal";
import { Block, Collaborator, Extension, Menu, Translator } from "./fs-context/structs";
let translator = new Translator();
//部署中文l10n表，其他语言同理
translator.store("zh-cn", {
    name: "我的拓展",
    des: "这是我的第一个拓展",
    tanchuang: "弹窗",
    towin: "到浏览器窗口",
    suffix: "并使用后缀",
    printRun: "打印runtime"
});
//英文
translator.store("en", {
    name: "My Extension",
    des: "This is my first extension",
    tanchuang: "Alert",
    towin: "to browser window",
    suffix: "with suffix",
    printRun: "Print Runtime"
});
//只需要把拓展的类作为一个ES默认导出即可
export default class MyExtension extends Extension {
    id = "myextension";
    displayName = translator.load("name");
    //只有在非沙盒中运行，积木方法中才能使用this.runtime
    allowSandboxed = false;
    blocks = [
        Block.create(
            //使用load方法加载当前语言的l10n
            translator.load("tanchuang"),
            {
                //积木参数的name字段必须用$或_开头，否则ts将会编译不通过且方法中也不会有字段类型提示
                name: "$content",
                inputType: "string",
                value: "something"
            },
            translator.load("towin"),
            translator.load("suffix"),
            {
                name: "$suffix",
                inputType: "menu",
                //inputType为menu时，value字段必须为一个已定义的Menu的名称
                value: "suffix"
            }
        ).config({
            type: "command",
            method(args) {
                alert(args.$content + " " + args.$suffix);
            },
            //积木文字可能变动，手动设置opcode
            opcode: "alertSth"
        }),
        Block.create(
            translator.load("printRun"),
        ).config({
            type: "command",
            method() {
                console.log("runtime", this.runtime);
            }
            //积木应该不会变动，不手动设置opcode，允许自动计算
        })
    ];
    menus = [
        new Menu("suffix", [
            { name: "已打印", value: "printed" },
            { name: "已输出", value: "output" },
            { name: "已显示", value: "displayed" }
        ])
    ];
    description = translator.load("des");
    collaborators = [
        new Collaborator("FallingShrimp", "https://f-shrimp.solariix.com")
    ];
    colors: ColorDefine = {
        theme: "#ff0000"
    };
}