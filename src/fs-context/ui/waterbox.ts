import { createApp } from "vue";
import "./base.css";
import WaterBox from "./componets/WaterBox.vue";
window.__VUE_OPTIONS_API__ = false;
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
window.ScratchWaterBoxed = {
    extensions: {
        register(extensionLoaded: any) {
            window.ScratchWaterBoxed ? window.ScratchWaterBoxed.currentExtension = extensionLoaded.objectPlain : null;
        },
        unsandboxed: true
    },
    translate: {
        language: "zh-cn"
    },
    currentExtension: null,
    loadTempExt() {
        if (window.tempExt && window.ScratchWaterBoxed) {
            window.ScratchWaterBoxed.currentExtension = new window.tempExt.Extension;
            window.ScratchWaterBoxed.currentExtension ? window.ScratchWaterBoxed.currentExtension.runtime = window.ScratchWaterBoxed : null;
            window.tempExt = undefined;
        }
    },
};
createApp(WaterBox).mount("#ui");