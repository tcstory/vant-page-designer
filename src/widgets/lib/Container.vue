<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
import baseComp from '../../mixin/baseComp'

export default {
  name: 'Container',
  mixins: [baseComp]
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
  }
</style>
