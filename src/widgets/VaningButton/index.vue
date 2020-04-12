<template>
  <van-button v-bind="propsValue" v-on:click="onClick" v-on:touchstart="onTouchstart" />
</template>

<script>
import VanButton from 'vant/lib/button'
import 'vant/lib/button/style'

export default {
  name: 'vaning-button',
  components: {
    'van-button': VanButton
  },
  props: {
    objectId: {
      type: String,
      required: true
    },
    propsValue: {
      type: Object,
      required: true,
    },
    eventValue: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick () {
      if (this.eventValue.click) {
        this.eventBus$.next({
          type: 'click',
          payload: {
            sender: this.objectId,
            eventType: 'click'
          }
        })
      }
    },
    onTouchstart () {
      if (this.eventValue.touchstart) {
        this.eventBus$.next({
          type: 'touchstart',
          payload: {
            sender: this.objectId,
            eventType: 'touchstart'
          }
        })
      }
    }
  }
}
</script>
