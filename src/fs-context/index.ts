import { GlobalResourceMachine, LoaderConfig, ObjectInclude, PlatformSupported, Scratch, ScratchWaterBoxed } from "./internal";
import loaderConfig from "@config/loader";
if (!window._FSContext) {
    window._FSContext = {
        EXTENSIONS: {},
        EXPORTED: {}
    };
};
export namespace Extensions {
    async function generateConstructor(extension: new () => import("./structs").Extension): Promise<any> {
        const { Version, Menu } = await import("./structs");
        const { Unnecessary } = await import("./tools");
        var ext = new extension();
        var context = getFSContext();
        function ExtensionConstructor(this: any, runtime: Scratch) {
            if (!runtime.extensions?.unsandboxed && !ext.allowSandboxed) {
                throw new Error(`FSExtension "${ext.id}" must be supported unsandboxed.`)
            };
            for (let i in ext.requires) {
                if (!Object.keys(context.EXTENSIONS).includes(i)) {
                    throw new Error(`FSExtension "${ext.id}" requires ${i} to be loaded.`)
                }
                if (Version.compare(context.EXTENSIONS[i], ext.requires[i]) === ext.requires[i]) {
                    throw new Error(`FSExtension "${ext.id}" requires ${i} to be at least ${ext.requires[i]}.`)
                };
            };
            ext.init(runtime);
            ext.runtime = runtime;
            ext.canvas = runtime.renderer.canvas;
            ext.blocks.forEach(block => {
                block.arguments.forEach((arg) => {
                    if (arg.inputType === "menu" && arg.value instanceof Menu) {
                        ext.menus.push(arg.value);
                        arg.value = arg.value.name;
                    }
                });
            });
            let blocks: any[] = [];
            for (let block of ext.blocks) {
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
                            type: Unnecessary.castInputType(arg.inputType),
                        }
                        if (arg.inputType === "menu") {
                            currentArg.menu = arg.value;
                        } else {
                            currentArg.defaultValue = arg.value;
                        }
                        args[arg.content] = currentArg;
                    }
                }
                this[currentBlock.opcode] = (arg: any) => JSON.stringify(block.method.call(ext, arg));
                blocks.push(currentBlock);
            }
            let menus: any = {};
            for (let menu of ext.menus) {
                menus[menu.name] = {
                    acceptReporters: menu.acceptReporters,
                    items: menu.items.map((item) => {
                        return {
                            text: item.name,
                            value: item.value
                        };
                    })
                };
            }
            ext.calcColor();
            this.getInfo = function () {
                return {
                    id: ext.id,
                    name: ext.displayName,
                    blocks,
                    menus,
                    color1: ext.colors.block,
                    color2: ext.colors.inputer,
                    color3: ext.colors.menu
                }
            }
        }
        return ExtensionConstructor;
    }
    export const config: ObjectInclude<LoaderConfig, "loader"> = {
        loader: loaderConfig
    }
    export function isInWaterBoxed() {
        return window.ScratchWaterBoxed !== undefined;
    }
    export function getScratch(): Scratch | ScratchWaterBoxed | null {
        if (window.ScratchWaterBoxed) return window.ScratchWaterBoxed;
        if (window.Scratch) return window.Scratch;
        return null;
    }
    export function getFSContext(): GlobalResourceMachine {
        return window._FSContext as GlobalResourceMachine;
    }
    export async function load(extension: new () => import("./structs").Extension) {
        let constructorPlain = extension
        let constructorGenerated = await generateConstructor(extension);
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