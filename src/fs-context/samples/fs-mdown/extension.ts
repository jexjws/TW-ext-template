import { ElementContext, Scratch } from "@framework/internal";
import { Block, Collaborator, Extension, Translator, Version } from "@framework/structs";
import { GlobalContext, Unnecessary } from "@framework/tools";
import "./style.css";
import MDRendererHTML from "./markdown.html";
import marked from "marked";
let translator = Translator.create("zh-cn", {
    name: "内嵌Markdown",
    description: "使用markdown嵌入网页",
    create: "创建名为$name的Markdown显示器于$pos，尺寸$size，图层$layer",
    setUrl: "设置$name的内容为$url",
    move: "移动$name到$pos",
    resize: "调整$name的尺寸为$size",
    setLayer: "设置$name的图层为$layer",
    remove: "移除$name"
});
let mdrendererUrl = URL.createObjectURL(new Blob([MDRendererHTML], { type: "text/html" }));
interface Position {
    x: number;
    y: number;
};
export default class FSIFrame extends Extension {
    id = "fsmdown";
    displayName = translator.load("name");
    version = new Version(1, 1, 4);
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
                },
                {
                    name: "$layer",
                    value: "0"
                }
            ]
        }, function createIF(arg) {
            if (document.getElementById(`fsiframe-${arg.$name}`)) return;
            let pos = parsePos(arg.$pos);
            let size = parsePos(arg.$size);
            let iframe = Unnecessary.elementTree("iframe")
                .class("fsi-iframe")
                .style("left", `${pos.x}px`)
                .style("top", `${pos.y}px`)
                .style("width", `${size.x}px`)
                .style("height", `${size.y}px`)
                .style("zIndex", arg.$layer)
                .attribute("id", `fsiframe-${arg.$name}`)
                .attribute("src", mdrendererUrl)
                .data("ratio-x", size.x / (this.canvas?.clientWidth || size.x))
                .data("ratio-y", size.y / (this.canvas?.clientHeight || size.y));
            dataStore.read("rootBase").child(iframe);
            dataStore.write("iframes", iframe);
            setInterval(() => {
                if (this.canvas) {
                    iframe
                        .style("width", `${this.canvas.clientWidth * iframe.data("ratio-x")}px`)
                        .style("height", `${this.canvas.clientHeight * iframe.data("ratio-y")}px`);
                }
            }, 100);
        }),
        Block.create(translator.load("setUrl"), {
            arguments: [
                {
                    name: "$name"
                },
                {
                    name: "$url",
                    value: "# 你好，世界！"
                }
            ]
        }, function setUrl(arg) {
            marked.marked(arg.$url.replaceAll("\\n", "\n"), { async: true }).then((html) => {
                let ele = (document.getElementById(`fsiframe-${arg.$name}`) as HTMLIFrameElement)
                    .contentWindow?.document
                    .getElementById("show");
                ele && (ele.innerHTML = html);
            });
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
        }),
        Block.create(translator.load("setLayer"), {
            arguments: [
                {
                    name: "$name"
                },
                {
                    name: "$layer",
                    value: "0"
                }
            ]
        }, function setLayer(arg) {
            let iframe = document.getElementById(`fsiframe-${arg.$name}`);
            iframe?.style.setProperty("zIndex", arg.$layer);
        }),
        Block.create(translator.load("remove"), {
            arguments: [
                {
                    name: "$name"
                }
            ]
        }, function remove(arg) {
            document.getElementById(`fsiframe-${arg.$name}`)?.remove();
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