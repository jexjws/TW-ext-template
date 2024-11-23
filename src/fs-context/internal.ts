import { Block, DataStorer, Extension, Version } from "./structs";
export class ArgumentPart {
    content: string;
    type: ArgumentPartType;
    value: AcceptedArgType = "";
    inputType: InputType = "string";
    constructor(content: string, type: ArgumentPartType, value?: AcceptedArgType, inputType?: InputType) {
        this.content = content;
        this.type = type;
        if (value !== undefined) this.value = value;
        if (inputType !== undefined) this.inputType = inputType;
    }
}
export interface ArgumentDefine<T extends ValidArgumentName = ValidArgumentName> {
    name: T;
    value?: AcceptedArgType;
    inputType?: InputType;
}
export type ValidArgumentName = `${"$" | "_"}${string}`;
export type MethodFunction<T = any> = (this: Extension, args: T) => any;
export interface Scratch {
    extensions: {
        register: (target: new () => any) => void;
        unsandboxed?: boolean;
    },
    translate: ScratchTranslateFunction;
    renderer: {
        get canvas(): HTMLCanvasElement;
    }
}
export interface ScratchWaterBoxed extends Scratch {
    currentExtensionPlain: Extension | null;
    currentExtension: any;
    loadTempExt: () => void;
}
export type BlockType = "command" | "reporter";
export type ExtractField<A extends (string | ArgumentDefine)[]> = {
    [K in keyof A as A[K] extends ArgumentDefine<infer R> ? R : never]: any;
}
export interface BlockConfigA<T extends (string | ArgumentDefine)[]> {
    method?: MethodFunction<ExtractField<T>>;
    type?: BlockType;
    opcode?: string;
}
export interface BlockConfigB<T extends ArgumentDefine[]> {
    arguments?: T;
    type?: BlockType;
}
export interface BlockConfiger<T extends (string | ArgumentDefine)[]> {
    config: (arg: BlockConfigA<T>) => Block;
}
export type HexColorString = `#${string}`;
export interface ColorDefine {
    block?: HexColorString;
    inputer?: HexColorString;
    menu?: HexColorString;
    theme?: HexColorString;
}
export interface MenuItem {
    name: string;
    value?: any;
}
export type InputTypeCast = {
    string: string;
    number: number;
    bool: boolean;
    menu: any;
    angle: number;
    color: HexColorString;
    "hat-paramater": string;
}
export type TranslatorStoredData = {
    [K in LanguageSupported]?: LanguageStored;
}
export type LanguageSupported = "zh-cn" | "en";
export type PlatformSupported = "GandiIDE" | "TurboWarp";
export type LanguageStored = { [key: string]: string; };
export type ArgumentPartType = "text" | "input";
export type InputType = "string" | "number" | "bool" | "menu" | "angle" | "color" | "hat-paramater";
export interface GlobalResourceMachine {
    EXTENSIONS: ObjectInclude<Version>;
    EXPORTED: { [key: string]: DataStorer }
}
export interface ScratchTranslateFunction extends Function {
    language: LanguageSupported;
}
export interface ElementContext<T extends HTMLElement = any> {
    result: T;
    child: (target: ElementContext) => ElementContext<T>;
    class: (...classes: string[]) => ElementContext<T>;
    attribute: <K extends keyof FilterWritableKeys<T>>(key: K, value: T[K]) => ElementContext<T>;
    style: <K extends keyof FilterWritableKeys<CSSStyleDeclaration>>(key: K, value: CSSStyleDeclaration[K]) => ElementContext<T>;
}
export type WritableKeys<T> = {
    [K in keyof T]: If<
        Equal<Pick<T, K>, Readonly<Pick<T, K>>>,
        never,
        K
    >;
}[keyof T];
export type FilterWritableKeys<T> = {
    [K in WritableKeys<T>]: T[K];
}
export type If<C extends boolean, T, F> = C extends true ? T : F;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
export type ObjectInclude<T, K extends string | number | symbol = string> = {
    [key: string]: T;
} & {
    [C in K]: T;
}
export type VersionString = `${number}.${number}.${number}`;
export type FilterKey<T, K> = {
    [P in keyof T as P extends K ? never : P]: never;
}
export type FilterOut<T, U> = T extends U ? never : T;
export type AcceptedArgType = InputTypeCast[FilterOut<keyof InputTypeCast, "">];
export interface LoaderConfig {
    target: Promise<{ default: new () => Extension }>;
    errorCatches: string[];
    platform: PlatformSupported[];
}