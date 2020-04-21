<template>
  <van-image v-bind="propsValue" v-on:click="onClick" class="img"/>
</template>

<script>
import VanImage from 'vant/lib/image'
import 'vant/lib/image/style'
export default {
  name: 'vaning-image',
  components: {
    'van-image': VanImage
  },
  props: {
    objectId: {
      type: String,
      required: true
    },
    propsValue: {
      type: Object,
      required: true
    },
    eventValue: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick () {
      this.eventBus$.next({
        type: 'click',
        payload: {
          sender: this.objectId,
          eventType: 'click'
        }
      })
    }
  }
}
</script>

<style scoped>
  .img {
    vertical-align: top;
  }
</style>
