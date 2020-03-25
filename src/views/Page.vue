<template>
  <article class="iphone-wrap">
    <div id="iphone">
      <node :comp="comp" v-bind:style="{'width': '100%', 'height': '100%'}"/>
    </div>
  </article>
</template>

<script>
import { createInstance } from '../registry'
import Node from '../components/Node'
import Container from '../widgets/Container.js'

export default {
  name: 'Page',
  components: {
    Node
  },
  data () {
    return {
      comp: createInstance(Container.info.id)
    }
  },
  methods: {
    setAsDefaultSelected () {
      this.selectedNode$.next({ type: 'SET', payload: this.comp })
    }
  },
  created () {
    this.component$.next({
      type: 'ADD',
      payload: this.comp
    })
  },
  mounted () {
    this.setAsDefaultSelected()
  }
}
</script>

<style lang="scss" scoped>
  .iphone-wrap {
    width: 100%;
    background-position: 0 0,13px 13px;
    background-size: 26px 26px;
    background-image: linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0),linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0);
  }

  #iphone {
    width: 375px;
    height: 667px;
    /*contain: strict;*/
    will-change: transform;
    margin: 20px auto 0;
    background-color: white;
  }
</style>
