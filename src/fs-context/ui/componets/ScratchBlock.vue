<template>
    <div class="block" :style="{ backgroundColor: colorBlock, borderColor: colorInputer }">
        <button class="oval" :style="{ backgroundColor: colorMenu }">Run</button>
        <button class="oval" :style="{ backgroundColor: colorMenu }">View</button>
        <button class="oval" :style="{ backgroundColor: colorMenu }" @click="alertArgs($el)">Arg</button>
        <slot></slot>
    </div>
</template>
<script setup>
function alertArgs(ele) {
    alert(ele);
}
</script>
<script>
export default {
    props: {
        colorBlock: {
            type: String,
            default: '#FF0000'
        },
        colorInputer: {
            type: String,
            default: '#00FF00'
        },
        colorMenu: {
            type: String,
            default: '#0000FF'
        }
    }
}
</script>
<style scoped>
.block {
    border: 3px solid transparent;
    padding: 3px 5px;
    display: inline-flex;
    border-radius: 5px;
    align-items: center;
}

.oval {
    height: 25px;
    border-radius: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 14px;
    padding: 5px;
    color: white;
}

.oval::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}

.oval:hover::before {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>