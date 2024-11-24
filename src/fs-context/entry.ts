import { Extensions } from "."
export default async function load() {
    let currentScratch = Extensions.getScratch() as import("@framework/internal").ScratchWaterBoxed;
    if (currentScratch) {
        let loaderConfig = Extensions.config.loader;
        let { default: target } = await loaderConfig.target;
        let extensionLoaded = await Extensions.load(target);
        extensionLoaded.debugPrint();
        extensionLoaded.to(...loaderConfig.platform);
        Extensions.isInWaterBoxed() ? currentScratch.loadTempExt() : null;
    };
};
export const result = load();