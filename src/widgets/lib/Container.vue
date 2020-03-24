<template>
  <div class="wrap">
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
  .wrap {
    display: flex;
    flex-direction: column;
  }
</style>
