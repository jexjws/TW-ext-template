<template>
    <div class="block">
        <div class="content">
            <slot></slot>
        </div>
        <canvas id="scratch-stage">
            <!-- <slot></slot> -->
        </canvas>
    </div>
</template>
<style scoped>
canvas {
    width: 640px;
    height: 360px;
    border-radius: 5px;
    border: 2px solid gray;
}

.block {
    position: relative;
    display: inline-block;
    margin: 20px;
    user-select: none;
}

.content {
    position: absolute;
    left: 0;
    top: 0;
    width: 640px;
    height: 360px;
    justify-content: center;
    align-items: center;
    display: flex;
}
</style>