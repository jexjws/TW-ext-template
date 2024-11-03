import { ArgumentPart, PlainScratch } from "./internal";
import { Extension } from "./structs";
export namespace Extensions {
    export function blockArgumentsToText(args: ArgumentPart[]): string {
        let result: string = "";
        for (let arg of args) {
            if (arg.type === "text") {
                result += arg.content;
            } else {
                result += `[${arg.content}]`;
            }
        }
        return result;
    }
    export function generateConstructor(extension: new () => Extension): any {
        var constructor = new extension();
        var scratch = getScratch();
        function ExtensionConstructor(this: any) {
            if (scratch.extensions.unsandboxed !== undefined && !scratch.extensions.unsandboxed && constructor.allowSandboxed) {
                throw new Error(`FSExtension "${constructor.id}" must be supported unsandboxed.`)
            }
            let blocks: any[] = [];
            for (let block of constructor.blocks) {
                let args: any = {};
                let currentBlock = {
                    opcode: block.opcode,
                    blockType: block.type,
                    text: blockArgumentsToText(block.arguments),
                    arguments: args
                };
                for (let arg of block.arguments) {
                    if (arg.type === "input") {
                        args[arg.content] = {
                            type: arg.inputType,
                            defaultValue: arg.value
                        }
                    }
                }
                this[currentBlock.opcode] = block.method;
                blocks.push(currentBlock);
            }
            this.getInfo = function () {
                return {
                    id: constructor.id,
                    name: constructor.displayName,
                    blocks
                }
            }
        }
        Object.defineProperty(ExtensionConstructor, "name", { value: extension.name });
        return ExtensionConstructor;
    }
    export function debugPrint(extension: new () => Extension) {
        let obj = new (generateConstructor(extension))();
        console.log("object:", obj);
        console.log("info:", obj.getInfo())
    }
    export function loadFor(platform: "TurboWarp" | "GandiIDE", extension: new () => Extension) {
        if (platform === "TurboWarp") getScratch().extensions.register(new (generateConstructor(extension)));
    }
    export function getScratch(): PlainScratch {
        return (window as any).Scratch;
    }
}