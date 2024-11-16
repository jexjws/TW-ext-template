import { createApp } from "vue";
import "./base.css";
import WaterBox from "./componets/WaterBox.vue";
import { Extensions } from "..";
window.__VUE_OPTIONS_API__ = false;
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
window.ScratchWaterBoxed = {
    extensions: {
        register(extensionLoaded: any) {
            window.ScratchWaterBoxed ? window.ScratchWaterBoxed.currentExtensionPlain = extensionLoaded.objectPlain : null;
        },
        unsandboxed: true
    },
    translate: 0 as any,
    currentExtensionPlain: null,
    currentExtension: null,
    loadTempExt() {
        if (window.tempExt && window.ScratchWaterBoxed) {
            let ext = new window.tempExt.Extension(window.ScratchWaterBoxed);
            window.ScratchWaterBoxed.currentExtension = ext;
            window.tempExt = undefined;
        }
    },
};
createApp(WaterBox).mount("#ui");