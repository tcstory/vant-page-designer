<template>
  <div class="container" v-bind:style="styleValue">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'Container',
  props: {
    objectId: {
      type: String,
      required: true
    },
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
