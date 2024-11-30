declare module "*.vue";
declare module "*.html";
declare interface Window {
    ScratchWaterBoxed?: import("./internal").ScratchWaterBoxed;
    Scratch?: import("./internal").Scratch;
    __VUE_OPTIONS_API__: boolean;
    __VUE_PROD_DEVTOOLS__: boolean;
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: boolean;
    tempExt?: {
        Extension: new (runtime: import("./internal").Scratch) => any,
        info: {
            extensionId: string,
            name: string,
            description: string,
            featured: boolean,
            disabled: boolean,
            collaboratorList: import("./structs").Collaborator[]
        }
    }
    _FSContext?: import("./internal").GlobalResourceMachine
}