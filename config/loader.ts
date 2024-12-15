import { ExtensionLoadError } from "@framework/exceptions";
type LoaderConfig = import("@framework/internal").LoaderConfig;
const config: LoaderConfig = {
    target: import("@samples/py/extension"),
    errorCatches: [Error, ExtensionLoadError],
    platform: ["TurboWarp"]
};
export default { ...config };