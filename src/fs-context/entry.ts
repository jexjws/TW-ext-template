import { Extensions } from ".";
import Extension from "../extension";
import { ScratchWaterBoxed } from "./internal";
export default function load() {
    let currentScratch = Extensions.getScratch() as ScratchWaterBoxed;
    if (currentScratch) {
        let extensionLoaded = Extensions.load(Extension);
        extensionLoaded.debugPrint();
        extensionLoaded.to("GandiIDE", "TurboWarp");
        currentScratch.loadTempExt();
    }
}
load();