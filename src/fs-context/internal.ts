import { Block, Extension } from "./structs";
export class ArgumentPart {
    content: string;
    type: ArgumentPartType;
    value: string | number = "";
    inputType: InputType = "string";
    constructor(content: string, type: ArgumentPartType, value?: string | number, inputType?: InputType) {
        this.content = content;
        this.type = type;
        if (value !== undefined) this.value = value;
        if (inputType !== undefined) this.inputType = inputType;
    }
}
export interface ArgumentDefine {
    name: `${"_" | "$"}${string}`;
    value?: string | number;
    inputType?: InputType;
}
export type MethodFunction<T = any> = (this: Extension, args: T) => any;
export interface Scratch {
    extensions: {
        register: (target: new () => any) => void;
        unsandboxed?: boolean;
    },
    translate: {
        language: LanguageSupported;
    }
}
export interface ScratchWaterBoxed extends Scratch {
    currentExtension: Extension | null;
    loadTempExt: () => void;
}
export type BlockType = "command" | "reporter";
export type ExtractField<A extends (string | { [key: string]: any })[], F extends string> = {
    [K in keyof A as A[K] extends { [key: string]: any } ? (F extends keyof A[K] ? A[K][F] : never) : never]:
    A[K] extends { [key: string]: any } ? InputTypeCast["inputType" extends keyof A[K] ? A[K]["inputType"] : "string"] : never;
}
export interface BlockConfig<T extends (string | ArgumentDefine)[]> {
    method?: MethodFunction<ExtractField<T, "name">>;
    type?: BlockType;
    opcode?: string;
}
export interface BlockConfiger<T extends (string | ArgumentDefine)[]> {
    config: (arg: BlockConfig<T>) => Block;
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
export type LanguageStored = { [key: string]: string; };
export type ArgumentPartType = "text" | "input";
export type InputType = "string" | "number" | "bool" | "menu" | "angle" | "color" | "hat-paramater";