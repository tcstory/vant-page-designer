<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'

import { Subject } from 'rxjs'

const node$ = new Subject()

Vue.prototype.node$ = node$

// todo 考虑是不是需要使用 ReplaySubject
Vue.prototype.eventBus$ = new Subject()

export default {
  name: 'App'
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;

  .ivu-form-item {
    margin-bottom: 12px;
  }
}
</style>
