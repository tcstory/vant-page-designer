<template>
  <div v-bind:style="styleValue" @click.stop="$emit('select', $event)">
    <slot></slot>
  </div>
</template>

<script>
import { pick } from 'lodash'
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
      return pick(this.propsValue, getStyleKey().map(item => item.key))
    }
  }
}
</script>

<style scoped>
  .container {
  }
</style>
