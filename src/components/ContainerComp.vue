<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { createCompInfo } from '../utils'

import baseComp from '../mixin/baseComp'

const compInfo = createCompInfo({
  version: 'latest',
  name: 'ContainerComp',
  label: '容器',
  coverImg: '',
  children: []
})

export default {
  name: compInfo.id,
  mixins: [baseComp],
  compInfo
}
</script>

<style scoped>

</style>
