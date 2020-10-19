<template>
    <div class="image-modal-wrapper">
        <img
            class="close-page"
            @click="onClose"
            src="@/assets/close.png"
        >
        <div class="image-wrapper">
            <img :src="image" alt="image">
        </div>
    </div>
</template>


<script>
export default {
    props: [ 'onClose', 'image' ]
}
</script>

<style lang="scss" scoped>


.image-modal-wrapper {
    z-index: 10000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    > .close-page {
        position: absolute;
        top: 20px;
        right: 20px;
        color: #ffffff;
        width: 24px;
        height: 24px;
    }

    >.image-wrapper {
        max-width: 80%;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
            width: auto;
            max-height: 100%;
        }
    }
}
</style>

