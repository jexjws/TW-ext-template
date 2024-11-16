import { Extensions } from ".";
import Extension from "../extension";
import { ScratchWaterBoxed } from "./internal";
export default function load() {
    //获取Scratch和加载拓展
    let currentScratch = Extensions.getScratch() as ScratchWaterBoxed;
    if (currentScratch) {
        let extensionLoaded = Extensions.load(Extension);
        //若需要在控制台中打印调试信息，请取消注释下一行
        /*extensionLoaded.debugPrint();*/
        extensionLoaded.to("GandiIDE");
        Extensions.isInWaterBoxed() ? currentScratch.loadTempExt() : null;
    }
}
load();