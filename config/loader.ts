type LoaderConfig = import("@framework/internal").LoaderConfig;
const config: LoaderConfig = {
    target: import("@src/extension"),
    errorCatches: [],
    platform: ["TurboWarp"]
}
export default { ...config };