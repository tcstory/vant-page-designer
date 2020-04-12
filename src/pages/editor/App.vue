<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'

import { Subject } from 'rxjs'

// require('spectre.css/dist/spectre-icons.min.css')

const node$ = new Subject()

Vue.prototype.node$ = node$

const system$ = new Subject()

Vue.prototype.system$ = system$

// todo 考虑是不是需要使用 ReplaySubject
Vue.prototype.eventBus$ = new Subject()

export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "~spectre.css";
@import "~spectre.css/dist/spectre-exp.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
