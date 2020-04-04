<template>
  <div class="box-model mb-2">
    <p @click="handleClick" class="c-hand bg-secondary title-bar">
      属性
      <i class="icon icon-arrow-up" v-if="show"></i>
      <i class="icon icon-arrow-down" v-if="!show"></i>
    </p>
    <template v-if="show && node.parent">
      <div class="form-group" v-for="keyVal of node.propsKey" :key="keyVal.key">
        <template v-if="keyVal.type ==='string'">
          <label class="form-label" :for="keyVal.key">{{keyVal.label}}</label>
          <input class="form-input" type="text" :id="keyVal.key" :value="node.propsValue[keyVal.key]"
                 v-on:input="onInput($event, keyVal)">
        </template>
        <template v-if="keyVal.type ==='number'">
          <label class="form-label" :for="keyVal.key">{{keyVal.label}}</label>
          <input class="form-input" type="number" :id="keyVal.key" :value="node.propsValue[keyVal.key]"
                 v-on:input="onInput($event, keyVal)">
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
import { filter } from 'rxjs/operators'
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

      this.node.propsValue[keyVal.key] = value

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
  },
  created () {
    this.node$.pipe(
      filter(action => action.type === 'UPDATE_STYLE_VALUE')
    ).subscribe((action) => {
      console.log('action', action)
    })
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
  }

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    position: relative;
  }

  .dot {
    position: absolute;
  }

  .dot-top {
    top: 0
  }

  .dot-right {
    right: 0;
  }

  .dot-bottom {
    bottom: 0;
  }

  .dot-left {
    left: 0;
  }

  .content-border {
    @extend .box;

    width: 100px;
    height: 40px;
    background-color: #cff0fb;
  }

  .padding-border {
    @extend .box;

    width: 140px;
    height: 80px;
    background-color: #e3dcff;
  }

  .margin-border {
    @extend .box;

    margin: 0 auto;
    width: 180px;
    height: 120px;
    background-color: #fdffdf;
  }
</style>
