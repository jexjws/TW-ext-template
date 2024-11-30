import { Extensions } from ".";
import { ArgumentDefine, ArgumentPart, BlockType, ColorDefine, MethodFunction, MenuItem, TranslatorStoredData, LanguageSupported, LanguageStored, BlockConfigB, ExtractField, Scratch, ObjectInclude, VersionString, KeyValueString } from "./internal";
import md5 from "md5";
import { MenuParser, Unnecessary } from "./tools";
export class Extension {
    id: string = "example-extension";
    displayName: string = "Example extension";
    version: Version = new Version("1.0.0");
    allowSandboxed: boolean = true;
    requires: ObjectInclude<Version> = {};
    blocks: Block[] = [];
    menus: Menu[] = [];
    description: string = "An example extension";
    collaborators: Collaborator[] = [];
    autoDeriveColors: boolean = true;
    colors: ColorDefine = {
        theme: "#FF0000"
    };
    runtime: Scratch | null = null;
    canvas: HTMLCanvasElement | null = null;
    calcColor() {
        if (this.autoDeriveColors) {
            if (this.colors.theme) {
                this.colors.block = Unnecessary.darken(this.colors.theme, 0);
                this.colors.inputer = Unnecessary.darken(this.colors.theme, 0.15);
                this.colors.menu = Unnecessary.darken(this.colors.theme, 0.3);
            } else {
                throw new Error(`FSExtension "${this.id}" can auto derive colors but have no theme color.`);
            }
        }
        return this.colors;
    }
    init(runtime: Scratch): any { runtime }
}
export class Block {
    method: MethodFunction<any> = () => { };
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
    static create<T extends BlockConfigB<ArgumentDefine[]>>(
        text: string,
        config: T,
        method?: (this: Extension, arg: T extends BlockConfigB<infer R> ? ExtractField<R> : never) => any
    ) {
        let realConfig: BlockConfigB<ArgumentDefine[]> = { arguments: config.arguments || [], ...config };
        let _arguments = realConfig.arguments as ArgumentDefine[];
        let realMethod = method || (() => { }) as any;
        let textLoaded: (string | ArgumentDefine)[] = [];
        let messages = Unnecessary.splitTextPart(text, _arguments.map(i => i.name));
        let args = Unnecessary.splitArgBoxPart(text, _arguments.map(i => i.name));
        for (let i = 0; i < messages.length; i++) {
            textLoaded.push(messages[i].replaceAll("[", "[").replaceAll("]", "]"));
            let current = _arguments.find(e => e.name === args[i]) as ArgumentDefine;
            if (current) {
                textLoaded.push(current);
            }
        }
        return new Block({
            method: realMethod,
            type: realConfig.type,
            opcode: method?.name
        }, ...textLoaded);
    }
    constructor(config: any, ...args: any[]) {
        let result = this;
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
        let data = config;
        data.method && (result.method = data.method);
        data.type && (result.type = data.type);
        data.opcode && (result._opcode = data.opcode);
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
    constructor(name: string, items?: (MenuItem | string | KeyValueString)[] | string, acceptReporters?: boolean) {
        this.name = name;
        acceptReporters && (this.acceptReporters = acceptReporters);
        items && (this.items = MenuParser.normalize(items));
    }
}
export class Translator<L extends LanguageSupported, D extends LanguageStored> {
    private stored: TranslatorStoredData = {};
    language: LanguageSupported = Extensions.getScratch()?.translate.language || 'zh-cn';
    defaultLanguage: L = 'zh-cn' as L;
    store<T extends LanguageSupported>(lang: T, data: D & LanguageStored) {
        this.stored[lang] = data;
    }
    load(keyword: keyof D): string {
        let currentStore = this.stored[this.language] as D;
        if (currentStore) {
            return currentStore[keyword] || this.unTranslatedText(keyword);
        } else {
            return this.unTranslatedText(keyword);
        };
    }
    unTranslatedText(keyword: keyof D) {
        let currentStore = this.stored[this.defaultLanguage] as D;
        return currentStore[keyword];
    }
    static create<T extends LanguageSupported, D extends LanguageStored>(lang: T, store: D): Translator<T, D> {
        let result = new Translator<T, D>();
        result.defaultLanguage = lang;
        result.store(lang, store);
        return result;
    }
}
export class DataStorer<T extends { [key: string]: any } = any> {
    data: T;
    constructor(data: T) {
        this.data = data;
    }
    read<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }
    write<K extends keyof T>(key: K, value: T[K] extends (infer R)[] ? R : T[K]) {
        if (Array.isArray(this.data[key])) {
            this.data[key].push(value);
        }
        else this.data[key] = value as T[K];
    }
    clear<K extends keyof T>(key: K) {
        if (Array.isArray(this.data[key])) {
            this.data[key] = [] as T[K];
        }
        else this.data[key] = undefined as T[K];
    }
}
export class Version {
    major: number = 1;
    minor: number = 0;
    patch: number = 0;
    constructor(version: VersionString)
    constructor(major: number, minor: number, patch: number)
    constructor(a: number | string = 1, b: number = 0, c: number = 0) {
        if (typeof a === "string") {
            let parts = a.split(".");
            this.major = parseInt(parts[0]);
            this.minor = parseInt(parts[1]);
            this.patch = parseInt(parts[2]);
        } else {
            this.major = a;
            this.minor = b;
            this.patch = c;
        }
    }
    toString(prefix: string = "v") {
        return `${prefix}${this.major}.${this.minor}.${this.patch}`;
    }
    static compare(a: Version, b: Version): Version {
        if (a.major > b.major) return a;
        if (a.major < b.major) return b;
        if (a.minor > b.minor) return a;
        if (a.minor < b.minor) return b;
        if (a.patch > b.patch) return a;
        if (a.patch < b.patch) return b;
        return a;
    }
}