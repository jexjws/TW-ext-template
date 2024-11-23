import { Extensions } from ".";
import { ScratchWaterBoxed } from "./internal";
export default async function load() {
    let currentScratch = Extensions.getScratch() as ScratchWaterBoxed;
    if (currentScratch) {
        let loaderConfig = Extensions.config.loader;
        console.log(loaderConfig);
        let { default: target } = await loaderConfig.target;
        let extensionLoaded = Extensions.load(target);
        extensionLoaded.to(...loaderConfig.platform);
        Extensions.isInWaterBoxed() ? currentScratch.loadTempExt() : null;
    };
};
load();