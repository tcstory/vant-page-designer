<template>
  <article>
    <node :comp="comp"/>
  </article>
</template>

<script>
import { createComponent } from '../registry'
import Node from '../components/Node'
import ContainerComp from '../components/ContainerComp'

export default {
  name: 'Page',
  components: {
    Node
  },
  data () {
    return {
      comp: createComponent(ContainerComp.compInfo.id)
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
