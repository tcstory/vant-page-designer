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
    </main>
  </div>
</template>

<script>
import './registry.js'

import Toolbar from './components/Toolbar'

require('spectre.css/dist/spectre-icons.min.css')

export default {
  name: 'App',
  components: {
    Toolbar
  }
}
</script>

<style lang="scss">
@import "~spectre.css";

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
