<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'Container',
  props: {
    styleValue: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped>
  .container {
  }
</style>
