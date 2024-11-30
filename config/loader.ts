type LoaderConfig = import("@framework/internal").LoaderConfig;
const config: LoaderConfig = {
    target: import("@samples/fs-mdown/extension"),
    errorCatches: [],
    platform: ["TurboWarp"]
}
export default { ...config };