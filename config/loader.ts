type LoaderConfig = import("@framework/internal").LoaderConfig;
const config: LoaderConfig = {
    target: import("@samples/falling-anchors/extension"),
    errorCatches: [],
    platform: ["TurboWarp"]
}
export default { ...config };