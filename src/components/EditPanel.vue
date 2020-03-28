<template>
  <div class="edit-panel p-2" :class="{active: isActive}">
    <div class="form-group" v-for="keyVal of panel.propsKey" :key="keyVal.key">
      <template v-if="keyVal.type ==='string'">
        <label class="form-label" :for="keyVal.key">{{keyVal.label}}</label>
        <input class="form-input" type="text" :id="keyVal.key" :value="panel.propsValue[keyVal.key]"
               v-on:input="onInput($event, panel, keyVal)">
      </template>
      <template v-if="keyVal.type ==='number'">
        <label class="form-label" :for="keyVal.key">{{keyVal.label}}</label>
        <input class="form-input" type="number" :id="keyVal.key" :value="panel.propsValue[keyVal.key]"
               v-on:input="onInput($event, panel, keyVal)">
      </template>
      <template v-if="keyVal.type ==='image'">
        <image-uploader :src="panel.propsValue[keyVal.key]" :object-id="panel.objectId" :key-val="keyVal"
          v-on:image-src-change="onInput($event, panel, keyVal)"/>
      </template>
    </div>
  </div>
</template>

<script>
import ImageUploader from './ImageUploader'

export default {
  name: 'EditPanel',
  components: {
    ImageUploader
  },
  props: {
    panel: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onInput (ev, panel, keyVal) {
      const value = ev.target.value

      panel.propsValue[keyVal.key] = value

      this.node$.next({
        type: 'UPDATE_PROP_VALUE',
        payload: {
          objectId: panel.objectId,
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
  .edit-panel {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    &.active {
      opacity: 1;
      z-index: 10;
    }
  }
</style>
