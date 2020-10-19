<template>
    <div class="layout-wrapper">
        <NavBar />
        <router-view />
    </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
    components: {
        NavBar
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

.layout-wrapper {
    padding-left: 220px;
    height: 100%;
    background-color: #ffffff;
}
</style>