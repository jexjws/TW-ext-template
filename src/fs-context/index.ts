import { Scratch, ScratchWaterBoxed } from "./internal";
import { Extension } from "./structs";
export namespace Extensions {
    const inputTypeCastToScratch: any = {
        bool: "Boolean",
        "hat-paramater": "ccw_hat_parameter"
    }
    function generateConstructor(extension: new () => Extension): any {
        var constructor = new extension();
        function ExtensionConstructor(this: any, runtime: Scratch) {
            console.log(runtime);
            if (!runtime.extensions.unsandboxed && !constructor.allowSandboxed) {
                throw new Error(`FSExtension "${constructor.id}" must be supported unsandboxed.`)
            }
            if (!constructor.allowSandboxed) constructor.runtime = runtime;
            let blocks: any[] = [];
            for (let block of constructor.blocks) {
                let args: any = {};
                let currentBlock = {
                    opcode: block.opcode,
                    blockType: block.type,
                    text: block.text,
                    arguments: args
                };
                for (let arg of block.arguments) {
                    if (arg.type === "input") {
                        let currentArg: any = {
                            type: Object.hasOwn(inputTypeCastToScratch, arg.inputType) ? inputTypeCastToScratch[arg.inputType] : arg.inputType,
                        }
                        if (arg.inputType === "menu") {
                            currentArg.menu = arg.value;
                        } else {
                            currentArg.defaultValue = arg.value;
                        }
                        args[arg.content] = currentArg;
                    }
                }
                this[currentBlock.opcode] = (arg: any) => {
                    block.method.call(constructor, arg);
                };
                blocks.push(currentBlock);
            }
            let menus: any = {};
            for (let menu of constructor.menus) {
                menus[menu.name] = {
                    acceptReporters: menu.acceptReporters,
                    items: menu.items.map((item) => {
                        return {
                            text: item.name,
                            value: item.value ? item.value : item.name
                        };
                    })
                };
            }
            constructor.calcColor();
            this.getInfo = function () {
                return {
                    id: constructor.id,
                    name: constructor.displayName,
                    blocks,
                    menus,
                    color1: constructor.colors.block,
                    color2: constructor.colors.inputer,
                    color3: constructor.colors.menu
                }
            }
        }
        return ExtensionConstructor;
    }
    export function isInWaterBoxed() {
        return !!window.ScratchWaterBoxed;
    }
    export function getScratch(): Scratch | ScratchWaterBoxed | null {
        if (window.ScratchWaterBoxed) return window.ScratchWaterBoxed;
        if (window.Scratch) return window.Scratch;
        return null;
    }
    export function load(extension: new () => Extension) {
        let constructorPlain = extension
        let constructorGenerated = generateConstructor(extension);
        let objectPlain = new constructorPlain();
        let objectGenerated = new constructorGenerated(getScratch());
        return {
            objectPlain,
            objectGenerated,
            to(...platforms: ("TurboWarp" | "GandiIDE")[]) {
                for (let platform of platforms) {
                    console.log(`Trying to load FSExtension "${objectPlain.id}" on platform "${platform}"...`);
                    if (platform === "TurboWarp") {
                        getScratch()?.extensions.register(objectGenerated);
                    } else if (platform === "GandiIDE") {
                        window.tempExt = {
                            Extension: extension,
                            info: {
                                extensionId: objectPlain.id,
                                name: objectPlain.displayName,
                                description: objectPlain.description,
                                featured: true,
                                disabled: false,
                                collaboratorList: objectPlain.collaborators
                            }
                        };
                    } else {
                        throw new Error(`Unknown platform "${platform}"`);
                    };
                }
                return this;
            },
            debugPrint() {
                console.log("constructor:", constructorGenerated);
                console.log("constructed:", objectGenerated);
                console.log("info:", objectGenerated.getInfo());
                return this;
            }
        }
    }
}