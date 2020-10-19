<template>
  <div id="app">
    <loading v-if="loading"/>
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'

export default {
  name: 'app',
  components: {
    NavBar,
    Loading,
  },
  computed: {
    ...mapState({
        loading: state => state.loading.data,
    }),
  }
}
</script>

<style lang="scss">
@import '@/theme/responsive.scss';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: 'Noto Sans Thai';
  font-style: normal;
  font-weight: 400;
  src: url("./assets/fonts/NotoSansThai-Regular.ttf") format('truetype');
}

@font-face {
  font-family: 'Noto Sans Thai';
  font-style: normal;
  font-weight: 700;
  src: url("./assets/fonts/NotoSansThai-Bold.ttf") format('truetype');
}

#app {
  font-size: 16px;
  height: 100%;
  width: 100%;
  font-family: "Noto Sans Thai", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

#app, body, html {
    height: 100%;
    width: 100%;
}

textarea, input, button, select, option {
  font-family: "Noto Sans Thai", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>
