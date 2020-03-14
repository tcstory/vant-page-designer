<template>
  <article>
    <node :compId="compId"/>
  </article>
</template>

<script>
import Node from '../components/Node'
import ContainerComp from '../components/ContainerComp'

export default {
  name: 'Page',
  components: {
    Node
  },
  data () {
    return {
      compId: ContainerComp.compInfo.id
    }
  },
  created () {
    this.component$.next({
      type: 'SET_ROOT_COMP',
      payload: ContainerComp.compInfo.id
    })
  }
}
</script>
