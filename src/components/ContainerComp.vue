<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import baseComp from '../mixin/baseComp'

const compInfo = {
  id: '',
  version: 'latest',
  name: 'Container',
  label: '容器',
  coverImg: '',
  children: []
}

compInfo.id = `${compInfo.name}-${compInfo.version}`

export default {
  name: compInfo.id,
  mixins: [baseComp],
  compInfo
}
</script>

<style scoped>

</style>
