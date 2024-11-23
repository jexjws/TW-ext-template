import { ElementContext, Scratch } from "@framework/internal";
import { Block, Collaborator, Extension, Translator, Version } from "@framework/structs";
import { GlobalContext, Unnecessary } from "@framework/tools";
import "./style.css";
let translator = Translator.create("zh-cn", {
    name: "内嵌网页",
    description: "使用iframe嵌入网页",
    create: "创建名为$name的Iframe于$pos，尺寸$size",
    setUrl: "设置$name的URL为$url",
    move: "移动$name到$pos",
    resize: "调整$name的尺寸为$size"
});
interface Position {
    x: number;
    y: number;
}
export default class FSIFrame extends Extension {
    id = "fs-iframe";
    displayName = translator.load("name");
    version = new Version(1, 0, 0);
    description = translator.load("description");
    collaborators = [
        new Collaborator("FallingShrimp", "https://rundll86.github.io")
    ];
    blocks = [
        Block.create(translator.load("create"), {
            arguments: [
                {
                    name: "$name"
                },
                {
                    name: "$pos",
                    value: "0 0"
                },
                {
                    name: "$size",
                    value: "480 270"
                }
            ]
        }, function createIF(arg) {
            let pos = parsePos(arg.$pos);
            let size = parsePos(arg.$size);
            let iframe = Unnecessary.elementTree("iframe")
                .class("fsi-iframe")
                .style("left", `${pos.x}px`)
                .style("top", `${pos.y}px`)
                .style("width", `${size.x}px`)
                .style("height", `${size.y}px`)
                .attribute("id", `fsiframe-${arg.$name}`);
            dataStore.read("rootBase").child(iframe);
            dataStore.write("iframes", iframe);
        }),
        Block.create(translator.load("setUrl"), {
            arguments: [
                {
                    name: "$name"
                },
                {
                    name: "$url",
                    value: "https://rundll86.github.io"
                }
            ]
        }, function setUrl(arg) {
            document.getElementById(`fsiframe-${arg.$name}`)
                ?.setAttribute("src", arg.$url);
        }),
        Block.create(translator.load("move"), {
            arguments: [
                {
                    name: "$name"
                },
                {
                    name: "$pos",
                    value: "0 0"
                }
            ]
        }, function move(arg) {
            let pos = parsePos(arg.$pos);
            let iframe = document.getElementById(`fsiframe-${arg.$name}`);
            iframe?.style.setProperty("left", `${pos.x}px`);
            iframe?.style.setProperty("top", `${pos.y}px`);
        }),
        Block.create(translator.load("resize"), {
            arguments: [
                {
                    name: "$name"
                },
                {
                    name: "$size",
                    value: "480 270"
                }
            ]
        }, function resize(arg) {
            let size = parsePos(arg.$size);
            let iframe = document.getElementById(`fsiframe-${arg.$name}`);
            iframe?.style.setProperty("width", `${size.x}px`);
            iframe?.style.setProperty("height", `${size.y}px`);
        })
    ]
    init(runtime: Scratch) {
        runtime.renderer.canvas.parentElement?.appendChild(
            dataStore.read("rootBase").result
        );
    }
};
function parsePos(text: string): Position {
    let arr = text.split(" ");
    return {
        x: Number(arr[0]),
        y: Number(arr[1])
    }
}
let dataStore = GlobalContext.createDataStore(FSIFrame, {
    iframes: [] as ElementContext<HTMLIFrameElement>[],
    rootBase: Unnecessary.elementTree("div").class("fsi-base")
});