<template>
    <div class="container">
        <div class="frame">
            <span class="title">
                WaterBox for FSExtension
                <span v-if="extensionLoaded">- {{ extName }}({{ extId }})</span>
            </span>
            <div class="tools">
                <button @click="reloadExtension()">加载拓展</button>
                <button @click="copyExtensionUrl()">复制拓展脚本url</button>
            </div>
            <div class="blocks">
                <ScratchBlock v-for="block in blocks" :colorBlock="colorBlock" :colorInputer="colorInputer"
                    :colorMenu="colorMenu" :opcode="block.opcode">
                    <span v-for="arg in block.arguments" :class="{ 'texts': true, 'input': arg.type === 'input' }">
                        <span v-if="arg.type === 'text'" class="text">{{ arg.content }}</span>
                        <span v-if="arg.type === 'input'" class="label">{{ arg.content }}:</span>
                        <input type="text" v-if="arg.type === 'input' && arg.inputType !== 'menu'" :value="arg.value"
                            class="inputer" />
                        <select v-if="arg.type === 'input' && arg.inputType === 'menu'" class="inputer select" :style="{
                            backgroundColor: colorInputer,
                            borderColor: colorMenu
                        }"
                            :value="findMenu(arg.value).items[0].value ? findMenu(arg.value).items[0].value : findMenu(arg.value).items[0].name">
                            <option v-for="option in findMenu(arg.value).items"
                                :value="option.value ? option.value : option.name">{{ option.name }}</option>
                        </select>
                    </span>
                </ScratchBlock>
            </div>
        </div>
    </div>
</template>
<script>
console.log("WaterBox loading");
</script>
<script setup>
import ScratchBlock from "./ScratchBlock.vue";
import { ref } from "vue";
function reloadExtension() {
    import("../../entry").then(() => {
        let ext = window.ScratchWaterBoxed.currentExtension;
        ext.calcColor();
        colorBlock.value = ext.colors.block;
        colorInputer.value = ext.colors.inputer;
        colorMenu.value = ext.colors.menu;
        blocks.value = ext.blocks;
        menus.value = ext.menus;
        extName.value = ext.displayName;
        extId.value = ext.id;
        extensionLoaded.value = true;
    });
}
function copyExtensionUrl() {
    let url = window.location.href + "extension.dist.js";
    try {
        navigator.clipboard.writeText(url);
    }
    catch {
        console.log("Copy failed.");
    }
    finally {
        alert("已尝试自动复制，若复制失败请手动选中复制：\n" + url);
    }
}
function findMenu(name) {
    return menus.value.find(menu => menu.name === name);
}
var colorBlock = ref("orange");
var colorInputer = ref("purple");
var colorMenu = ref("pink");
var blocks = ref([]);
var menus = ref([]);
var extName = ref("");
var extId = ref("");
var extensionLoaded = ref(false);
</script>
<style scoped>
.container {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.frame {
    padding: 15px;
    border: gray 3px solid;
    display: flex;
    flex-direction: column;
}

button {
    padding: 3px 5px;
    border: rgb(128, 128, 128) 2px solid;
    background-color: rgb(230, 230, 230);
    color: black;
    border-radius: 5px;
}

button:hover {
    border-color: rgb(64, 64, 64);
    background-color: rgb(200, 200, 200);
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.tools * {
    margin: 0 5px;
}

.blocks {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px 10px;
}

.blocks * {
    margin-left: 5px;
}

.texts {
    display: flex;
    align-items: center;
}

.text {
    color: white;
    text-wrap: nowrap;
}

.inputer {
    color: black;
    background-color: white;
    padding: 5px;
    border-radius: 5px;
}

.select {
    border-width: 2px;
    border-style: solid;
    color: white;
}

.label {
    color: white;
    background-color: rgb(255, 255, 255, 0.25);
    border-radius: 5px;
    padding: 0 5px;
}
</style>