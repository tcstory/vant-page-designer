<template>
  <article>
    <node :comp="comp"/>
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
      this.selectedContainer$.next({ type: 'SET', payload: this.comp })
    }
  },
  created () {
    this.component$.next({
      type: 'SET_ROOT_COMP',
      payload: this.comp
    })
  },
  mounted () {
    this.setAsDefaultSelected()
  }
}
</script>
