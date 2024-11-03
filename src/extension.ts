import { Extensions } from "./fs-context";
import { Block, Extension } from "./fs-context/structs";
class MyExtension extends Extension {
    id = "my-extension";
    displayName = "My Extension";
    allowSandboxed = true;
    blocks = [
        new Block<{
            content: string
        }>({
            opcode: "showAlert",
            type: "command",
            arguments: [
                "弹窗",
                {
                    name: "content",
                    inputType: "number",
                    value: 0
                },
                "到浏览器窗口中"
            ],
            method(args) {
                alert(args.content + "printed");
            },
        })
    ];
}
Extensions.loadFor("TurboWarp", MyExtension);
Extensions.debugPrint(MyExtension);