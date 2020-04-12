<template>
  <div class="box-model mb-2">
    <p @click="handleClick" class="c-hand title-bar">
      属性
      <i class="icon icon-arrow-up" v-if="show"></i>
      <i class="icon icon-arrow-down" v-if="!show"></i>
    </p>
    <template v-if="show && node.parent">
      <div class="form-group" v-for="keyVal of node.propsKey" :key="keyVal.key">
        <template v-if="keyVal.type ==='string'">
          <div class="input-group">
            <span class="input-group-addon addon-sm">{{keyVal.label}}</span>
            <input class="form-input input-sm" type="text" :value="node.propsValue[keyVal.key]"
                   v-on:input="onInput($event, keyVal)">
          </div>
        </template>
        <template v-if="keyVal.type ==='number'">
          <div class="input-group">
            <span class="input-group-addon addon-sm">{{keyVal.label}}</span>
            <input class="form-input input-sm" type="number" :value="node.propsValue[keyVal.key]"
                   v-on:input="onInput($event, keyVal)">
          </div>
        </template>
        <template v-if="keyVal.type ==='image'">
          <image-uploader :src="node.propsValue[keyVal.key]" :object-id="node.objectId" :key-val="keyVal"
                          v-on:image-src-change="onInput($event, keyVal)"/>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import ImageUploader from './ImageUploader'

export default {
  name: 'PropModel',
  components: {
    ImageUploader
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    handleClick () {
      this.show = !this.show
    },
    onInput (ev, keyVal) {
      let value = ev.target.value

      if (keyVal.type === 'number') {
        value = Number(value)
      }

      this.node$.next({
        type: 'UPDATE_PROP_VALUE',
        payload: {
          objectId: this.node.objectId,
          key: keyVal.key,
          type: keyVal.type,
          value
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .title-bar {
    font-size: 14px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2a2d35;
  }
</style>
