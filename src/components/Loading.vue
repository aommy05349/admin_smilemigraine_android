<template>
    <div class="wrapper">
        <div class="lds-grid">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
        <div class="loadingText">
            กำลังโหลด
        </div>
    </div>
</template>

<script>
export default {

}
</script>


<style lang="scss" scoped>
@import '@/theme/variables.scss';

.wrapper {
    position: fixed;
    background-color: rgba(197, 197, 197, 0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.loadingText {
    color: #FFF;
    margin-top: 10px;
    font-weight: bold;
}
.lds-grid {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
}
.lds-grid div {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: $loading-color;
    animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
    top: 6px;
    left: 6px;
    animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
    top: 6px;
    left: 26px;
    animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
    top: 6px;
    left: 45px;
    animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
    top: 26px;
    left: 6px;
    animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
    top: 26px;
    left: 26px;
    animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
    top: 26px;
    left: 45px;
    animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
    top: 45px;
    left: 6px;
    animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
    top: 45px;
    left: 26px;
    animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
    top: 45px;
    left: 45px;
    animation-delay: -1.6s;
}
@keyframes lds-grid {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
        background-color: #FFF;
    }
}
</style>
