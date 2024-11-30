import { ColorDefine } from "@framework/internal";
import { Block, Collaborator, Extension, Menu, Translator, Version } from "@framework/structs";
import { GlobalContext, Unnecessary } from "@framework/tools";
let translator = Translator.create("zh-cn", {
    name: "我的拓展",
    des: "这是我的第一个拓展",
    alert: "向窗口中弹窗$sth，后缀为_suffix",
    eat: "吃掉水果，$fruit",
    eatenTip: "你吃了一个"
});
translator.store("en", {
    name: "My Extension",
    des: "This is my first extension",
    alert: "alert $sth to window with suffix _suffix",
    eat: "eat fruit,$fruit",
    eatenTip: "You ate a(n)"
});
export default class MyExtension extends Extension {
    id = "myextension";
    displayName = translator.load("name");
    version = new Version(1, 0, 0);
    blocks = [
        Block.create(
            translator.load("alert"),
            {
                arguments: [
                    {
                        name: "$sth",
                        value: "Hello World",
                        inputType: "string"
                    },
                    {
                        name: "_suffix",
                        value: new Menu("suffixes", [
                            { name: "已打印", value: "printed" },
                            { name: "已输出", value: "output" },
                            { name: "已显示", value: "displayed" }
                        ]),
                        inputType: "menu"
                    }
                ],
            },
            function alertSth(args) {
                alert(args.$sth + " " + args._suffix);
                dataStore.write("alertedSth", args.$sth.toString());
                dataStore.write("lastSuffix", args._suffix.toString());
                console.log(dataStore.read("tools"));
            }
        ),
        Block.create(
            translator.load("eat"),
            {
                arguments: [
                    {
                        name: "$fruit",
                        value: "fruits",
                        inputType: "menu"
                    }
                ]
            },
            function eat(args) {
                dataStore.write("fruitsEaten", args.$fruit.toString());
                alert(`${translator.load("eatenTip")} ${args.$fruit}`);
            }
        )
    ];
    menus = [
        new Menu("fruits", [
            { name: "苹果", value: "apple" },
            { name: "香蕉", value: "banana" },
            { name: "橙子", value: "orange" },
            { name: "西瓜", value: "watermelon" }
        ]),
        new Menu("vegetables", [
            "土豆=potato",
            "胡萝卜=carrot",
            "Unnamed vegitable",
            {
                name: "Named vegitable of Onion",
                value: "onion"
            },
            "Cabbage白菜"
        ]),
        new Menu("sauces", "番茄酱=ketchup,蛋黄酱=mayonnaise,mushroom,辣椒酱=hot sauce")
    ]
    description = translator.load("des");
    collaborators = [
        new Collaborator("FallingShrimp", "https://f-shrimp.solariix.com")
    ];
    colors: ColorDefine = {
        theme: "#ff0000"
    };
    autoDeriveColors = true;
}
let dataStore = GlobalContext.createDataStore(MyExtension, {
    alertedSth: [] as string[],
    lastSuffix: "",
    tools: Unnecessary,
    fruitsEaten: [] as string[]
});