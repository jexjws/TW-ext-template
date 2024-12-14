export class ExtensionLoadError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "ExtensionLoadError";
    };
};
export class CastError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "CastError";
    };
};
export class UncaughtGenerator extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "UncaughtGenerator";
    };
};
export class SyntaxError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "SyntaxError";
    };
};
export class UncognizedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "UncognizedError";
    };
};
export class MissingError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "MissingError";
    };
};
export class OnlyInstanceWarn extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "OnlyInstanceWarn";
    };
};
export class OverwriteWarn extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "OverwriteWarn";
    };
};