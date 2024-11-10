import { Block, Collaborator, Extension } from "./fs-context/structs";
export default class MyExtension extends Extension {
    id = "my-extension";
    displayName = "My Extension";
    allowSandboxed = true;
    blocks = [
        Block.create(
            "弹窗",
            {
                name: "$content",
                inputType: "string",
                value: "something"
            },
            "到浏览器窗口"
        ).config({
            type: "command",
            method(args) {
                alert(args.$content);
            }
        })
    ];
    description = "This is my first extension";
    collaborators = [
        new Collaborator("FallingShrimp", "https://f-shrimp.solariix.com")
    ];
}