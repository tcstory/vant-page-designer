<template>
  <div id="app">
    <header class="navbar bg-primary" id="nav">
      <section class="navbar-section">
        Notion Vue
      </section>
    </header>
    <main id="stage">
      <toolbar/>
      <router-view/>
      <edit-panel-list />
    </main>
  </div>
</template>

<script>
import Vue from 'vue'

import defaultWidget from '@/defaultWidget.js'
import vantWidget from '@/vantWidget'

import Toolbar from '@/components/Toolbar'
import EditPanelList from '@/components/EditPanelList'
import { Subject } from 'rxjs'

defaultWidget.install()
vantWidget.install()

require('spectre.css/dist/spectre-icons.min.css')

const node$ = new Subject()

Vue.prototype.node$ = node$

export default {
  name: 'App',
  components: {
    Toolbar,
    EditPanelList
  }
}
</script>

<style lang="scss">
@import "~spectre.css";
@import "~spectre.css/dist/spectre-exp.css";

html, body {
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}

$nav-height: 44px;

#nav {
  height: $nav-height;
}

#stage {
  height: calc(100% - #{$nav-height});
  display: flex;
}

</style>
