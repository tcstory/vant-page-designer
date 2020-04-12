<template>
  <van-rate v-bind="propsValue" />
</template>

<script>
import VanRate from 'vant/lib/rate'
import 'vant/lib/rate/style'

export default {
  name: 'vaning-rate',
  components: {
    'van-rate': VanRate
  },
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
  methods: {

  }
}
</script>

<style scoped>

</style>
