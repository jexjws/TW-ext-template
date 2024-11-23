import { GlobalResourceMachine, LoaderConfig, ObjectInclude, PlatformSupported, Scratch, ScratchWaterBoxed } from "./internal";
import { Extension, Menu, Version } from "./structs";
import loaderConfig from "@config/loader";
export namespace Extensions {
    const inputTypeCastToScratch: any = {
        bool: "Boolean",
        "hat-paramater": "ccw_hat_parameter"
    }
    function generateConstructor(extension: new () => Extension): any {
        var constructor = new extension();
        var context = getFSContext();
        function ExtensionConstructor(this: any, runtime: Scratch) {
            if (!runtime.extensions?.unsandboxed && !constructor.allowSandboxed) {
                throw new Error(`FSExtension "${constructor.id}" must be supported unsandboxed.`)
            };
            for (let i in constructor.requires) {
                if (!Object.keys(context.EXTENSIONS).includes(i)) {
                    throw new Error(`FSExtension "${constructor.id}" requires ${i} to be loaded.`)
                }
                if (Version.compare(context.EXTENSIONS[i], constructor.requires[i]) === constructor.requires[i]) {
                    throw new Error(`FSExtension "${constructor.id}" requires ${i} to be at least ${constructor.requires[i]}.`)
                };
            };
            constructor.init(runtime);
            constructor.blocks.forEach(block => {
                block.arguments.forEach((arg) => {
                    if (arg.inputType === "menu" && arg.value instanceof Menu) {
                        constructor.menus.push(arg.value);
                        arg.value = arg.value.name;
                    }
                });
            });
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
                this[currentBlock.opcode] = (arg: any) => JSON.stringify(block.method.call(constructor, arg));
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
    export const config: ObjectInclude<LoaderConfig, "loader"> = {
        loader: loaderConfig as LoaderConfig
    }
    export function isInWaterBoxed() {
        return !!window.ScratchWaterBoxed;
    }
    export function getScratch(): Scratch | ScratchWaterBoxed | null {
        if (window.ScratchWaterBoxed) return window.ScratchWaterBoxed;
        if (window.Scratch) return window.Scratch;
        return null;
    }
    export function getFSContext(): GlobalResourceMachine {
        if (!window._FSContext) {
            window._FSContext = {
                EXTENSIONS: {},
                EXPORTED: {}
            };
        }
        return window._FSContext;
    }
    export function load(extension: new () => Extension) {
        let constructorPlain = extension
        let constructorGenerated = generateConstructor(extension);
        let objectPlain = new constructorPlain();
        let objectGenerated = new constructorGenerated(getScratch());
        let scratch = getScratch() as ScratchWaterBoxed;
        return {
            objectPlain,
            objectGenerated,
            to(...platforms: PlatformSupported[]) {
                for (let platform of platforms) {
                    console.log(`Trying to load FSExtension "${objectPlain.id}" on platform "${platform}"...`);
                    if (platform === "TurboWarp") {
                        scratch.extensions.register(objectGenerated);
                    } else if (platform === "GandiIDE") {
                        window.tempExt = {
                            Extension: constructorGenerated,
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
                    if (isInWaterBoxed()) {
                        scratch.currentExtension = objectGenerated;
                        scratch.currentExtensionPlain = objectPlain;
                    };
                    getFSContext().EXTENSIONS[objectPlain.id] = objectPlain.version;
                }
                return this;
            },
            debugPrint() {
                console.log("plainObject:");
                console.dir(objectPlain);
                console.log("generatedObject:");
                console.dir(objectGenerated);
                console.log("info:");
                console.dir(objectGenerated.getInfo());
                return this;
            }
        }
    }
}