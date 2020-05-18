<template>
  <div class="box-model mb-2">
    <template v-if="show && node.parent">
      <div class="form-row" v-for="keyVal of node.propsKey" :key="keyVal.key">
        <template v-if="keyVal.type === 'string'">
          <span class="form-label">{{ keyVal.label }}</span>
          <input
            class="form-input"
            type="text"
            :value="node.propsValue[keyVal.key]"
            v-on:input="onInput($event, keyVal)"
          />
        </template>
        <template v-if="keyVal.type === 'number'">
          <span class="form-label">{{ keyVal.label }}</span>
          <input
            class="form-input"
            type="number"
            :value="node.propsValue[keyVal.key]"
            v-on:input="onInput($event, keyVal)"
          />
        </template>
        <template v-if="keyVal.type === 'select'">
          <span class="form-label">{{ keyVal.label }}</span>
          <div class="form-select">
            <my-select
              :value="node.propsValue[keyVal.key]"
              @input="onInput($event, keyVal)"
              :options="keyVal.options"
            ></my-select>
          </div>
        </template>
        <template v-if="keyVal.type === 'image'">
          <image-uploader
            :src="node.propsValue[keyVal.key]"
            :object-id="node.objectId"
            :key-val="keyVal"
            v-on:image-src-change="onInput($event, keyVal)"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import ImageUploader from './ImageUploader'
import Select from './Select'

export default {
  name: 'PropModel',
  components: {
    ImageUploader,
    'my-select': Select
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
        type: 'UPDATE_PROP_VALUE.propModel',
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

<style>
  .form-row {
    margin-bottom: 4px;
    min-height: 24px;
    display: flex;
    justify-content: space-between;
  }

  .form-label {
    color: rgba(255, 255, 255, 0.7);
    width: 60px;
    display: inline-block;
  }

  .form-input,
  .form-select {
    width: 180px;
    padding: 0 6px;
    background-color: rgba(255, 255, 255, 0.08);
    display: inline-block;
  }

  .form-select {
    padding: 0;
  }
</style>
