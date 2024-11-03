import { ArgumentDefine, ArgumentPart, BlockType, MethodFunction } from "./internal";
export class Extension {
    id: string = "example-extension";
    displayName: string = "Example extension";
    allowSandboxed: boolean = true;
    blocks: Block[] = [];
}
export class Block<T = any> {
    method: MethodFunction<T> = () => { };
    arguments: ArgumentPart[] = [];
    opcode: string = "exampleBlock";
    type: BlockType = "command";
    constructor(data: {
        method?: MethodFunction<T>,
        arguments?: (string | ArgumentDefine)[],
        type?: BlockType,
        opcode: string
    }) {
        data.method && (this.method = data.method);
        data.type && (this.type = data.type);
        this.opcode = data.opcode;
        if (data.arguments) {
            for (let i = 0; i < data.arguments.length; i++) {
                var currentPart: ArgumentPart;
                if (typeof data.arguments[i] === "string") {
                    currentPart = new ArgumentPart(data.arguments[i] as string, "text");
                } else {
                    var currentArgument: ArgumentDefine = data.arguments[i] as ArgumentDefine;
                    currentPart = new ArgumentPart(
                        currentArgument.name,
                        "input",
                        currentArgument.value,
                        currentArgument.inputType
                    );
                }
                this.arguments.push(currentPart);
            }
        }
    };
}