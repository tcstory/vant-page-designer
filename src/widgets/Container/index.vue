<template>
  <div v-bind:style="styleValue" @click.stop="$emit('select', $event)">
    <slot></slot>
  </div>
</template>

<script>
import { pick } from 'loadsh'
import { propsKey } from './common'

function getStyleKey () {
  return propsKey.filter(keyVal => {
    return keyVal.tag === 'style'
  })
}

export default {
  name: 'Container',
  props: {
    objectId: {
      type: String,
      required: true
    },
    propsValue: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    styleValue () {
      console.log('这是啥???')
      return pick(this.propsValue, getStyleKey())
    }
  }
}
</script>

<style scoped>
  .container {
  }
</style>
