import { createApp } from "vue";
import "./base.css";
import WaterBox from "./componets/WaterBox.vue";
window.__VUE_OPTIONS_API__ = true;
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
window.ScratchWaterBoxed = {
    extensions: {
        register() { },
        unsandboxed: true
    },
    translate: 0 as any,
    currentExtensionPlain: null,
    currentExtension: null,
    loadTempExt() {
        if (window.tempExt && window.ScratchWaterBoxed) {
            const ext = new window.tempExt.Extension(window.ScratchWaterBoxed);
            window.ScratchWaterBoxed.currentExtension = ext;
            window.tempExt = undefined;
        }
    },
    renderer: {
        get canvas() {
            return document.getElementById("scratch-stage") as HTMLCanvasElement;
        }
    }
};
createApp(WaterBox).mount("#ui");