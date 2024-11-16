import { ColorDefine } from "./fs-context/internal";
import { Block, Collaborator, Extension, Menu, Translator, Version } from "./fs-context/structs";
import { GlobalContext, Unnecessary } from "./fs-context/tools";
//create方法创建一个Translator，不要直接new，参数为默认语言及其他所有语言下必须具有的键值对，之后可以调用store方法添加其他语言
//部署中文
let translator = Translator.create("zh-cn", {
    name: "我的拓展",
    des: "这是我的第一个拓展",
    //积木文字，参数前带美元符号或下划线表示积木参数
    alert: "向窗口中弹窗$sth，后缀为_suffix",
    eat: "吃掉水果，$fruit",
    eatenTip: "你吃了一个"
});
//部署英文
translator.store("en", {
    name: "My Extension",
    des: "This is my first extension",
    alert: "alert $sth to window with suffix _suffix",
    eat: "eat fruit,$fruit",
    eatenTip: "You ate a(n)"
});
//把拓展的类导出成default
export default class MyExtension extends Extension {
    /*以下两个字段无需多言*/
    id = "myextension";
    displayName = translator.load("name");
    //版本号，任意一种重载方式均可
    version = new Version(1, 0, 0);
    requires = {
        //需求的拓展id及最低版本号，任意一种重载方式均可
        /*witcat_filehelper: new Version("2.0.0")*/
    }
    //只有在非沙盒中运行，积木方法中才能使用this.runtime
    allowSandboxed = true;
    blocks = [
        Block.create(
            //可以使用translator.load方法获取积木文字的翻译
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
                        //菜单类型的积木参数有两种定义菜单的方式，一种就是下面这样，另一种是在拓展的menus字段中定义，这里填菜单的id
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
                        //第二种写法
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
        //这个字段中定义的菜单可以被积木参数所使用
        new Menu("fruits", [
            { name: "苹果", value: "apple" },
            { name: "香蕉", value: "banana" },
            { name: "橙子", value: "orange" },
            { name: "西瓜", value: "watermelon" }
        ])
    ]
    description = translator.load("des");
    collaborators = [
        //拓展的贡献者列表，可以不填
        new Collaborator("FallingShrimp", "https://f-shrimp.solariix.com")
    ];
    //三个颜色，可以直接填theme字段作为主题色，其他颜色能自动推断
    colors: ColorDefine = {
        theme: "#ff0000"
    };
    //是否自动推断颜色，如果为false，则colors字段中的颜色必须全部填写，block/inputer/menu
    autoDeriveColors = true;
}
//在全局上下文中创建dataStore，不要直接new，dataStore可以跨拓展读取，不推荐对其他拓展的dataStore写入自己的数据
let dataStore = GlobalContext.createDataStore(MyExtension, {
    alertedSth: [] as string[],
    lastSuffix: "",
    tools: Unnecessary,
    fruitsEaten: [] as string[]
});
//若需要获取其他拓展的dataStore，使用getDataStore方法，即下面的注释部分
/*let dataFromOtherExtension = GlobalContext.getDataStore<dataStore_typeDefine>("ext_id");*/