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
    name: string;
    value?: string | number;
    inputType?: InputType;
}
export type MethodFunction<T = any> = (args: T) => any;
export type PlainScratch = { [key: string]: any };
export type BlockType = "command" | "reporter";
type ArgumentPartType = "text" | "input";
type InputType = "string" | "number" | "boolean" | "menu";