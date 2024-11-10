import { Extensions } from ".";
import { ArgumentDefine, ArgumentPart, BlockConfiger, BlockType, ColorDefine, MethodFunction, HexColorString, MenuItem, Scratch, TranslatorStoredData, LanguageSupported } from "./internal";
import md5 from "md5";
function hexToRgb(str: HexColorString): number[] {
    let hexs: any[] = [];;
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(str)) throw new Error('Invalid hex color string');
    str = str.replace('#', '') as HexColorString;
    hexs = str.match(/../g) || [];
    for (let i = 0; i < hexs.length; i++) hexs[i] = parseInt(hexs[i], 16);
    return hexs;
}
function getDarkColor(color: HexColorString, level: number): HexColorString {
    let rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb[i] - (rgb[i] * level))
    }
    return `#${rgb.map((i) => i.toString(16).padStart(2, "0")).join('')}`;
}
export class Extension {
    id: string = "example-extension";
    displayName: string = "Example extension";
    allowSandboxed: boolean = true;
    blocks: Block[] = [];
    menus: Menu[] = [];
    description: string = "An example extension";
    collaborators: Collaborator[] = [];
    autoDeriveColors: boolean = true;
    colors: ColorDefine = {
        theme: "#FF0000"
    };
    runtime: Scratch | null = null;
    calcColor() {
        if (this.autoDeriveColors) {
            if (this.colors.theme) {
                this.colors.block = getDarkColor(this.colors.theme, 0);
                this.colors.inputer = getDarkColor(this.colors.theme, 0.15);
                this.colors.menu = getDarkColor(this.colors.theme, 0.3);
            } else {
                throw new Error(`FSExtension "${this.id}" can auto derive this.colors but have no theme color.`);
            }
        }
        return this.colors;
    }
}
export class Block<T = any> {
    method: MethodFunction<T> = () => { };
    arguments: ArgumentPart[] = [];
    type: BlockType = "command";
    private _opcode: string | null = null;
    get opcode(): string {
        return this._opcode ? this._opcode : md5(JSON.stringify(this.arguments));
    }
    get text(): string {
        let result: string = "";
        for (let arg of this.arguments) {
            if (arg.type === "text") {
                result += arg.content;
            } else {
                result += `[${arg.content}]`;
            }
        }
        return result;
    }
    static create<T extends (string | ArgumentDefine)[]>(...args: T): BlockConfiger<T> {
        let result = new Block();
        for (let i = 0; i < args.length; i++) {
            var currentPart: ArgumentPart;
            if (typeof args[i] === "string") {
                currentPart = new ArgumentPart(args[i] as string, "text");
            } else {
                var currentArgument: ArgumentDefine = args[i] as ArgumentDefine;
                currentPart = new ArgumentPart(
                    currentArgument.name,
                    "input",
                    currentArgument.value,
                    currentArgument.inputType
                );
            }
            result.arguments.push(currentPart);
        }
        return {
            config(arg) {
                let data = arg;
                data.method && (result.method = data.method);
                data.type && (result.type = data.type);
                data.opcode && (result._opcode = data.opcode);
                return result;
            }
        };
    };
}
export class Collaborator {
    name?: string;
    url?: string;
    constructor(name?: string, url?: string) {
        this.name = name;
        this.url = url;
    }
}
export class Menu {
    acceptReporters: boolean = true;
    items: MenuItem[] = [];
    name: string;
    constructor(name: string, items?: MenuItem[], acceptReporters?: boolean) {
        this.name = name;
        acceptReporters && (this.acceptReporters = acceptReporters);
        items && (this.items = items);
    }
}
export class Translator {
    private stored: TranslatorStoredData = {};
    unTranslated: string = "[Untranslated keyword $keyword$ for language $language$]";
    language: LanguageSupported = Extensions.getScratch()?.translate.language || 'zh-cn';
    store(data: TranslatorStoredData) {
        this.stored = data;
    }
    load(key: string): string {
        let currentStore = this.stored[this.language];
        if (currentStore) {
            return currentStore[key] || this.unTranslatedText(key);
        } else {
            return this.unTranslatedText(key);
        }
    }
    unTranslatedText(keyword: string) {
        return this.unTranslated.replace("$keyword$", keyword).replace("$language$", this.language);
    }
}