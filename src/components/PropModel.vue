<template>
  <div class="box-model">
    <template v-if="show && node.parent">
      <Form label-position="right" :label-width="100">
        <FormItem :label="keyVal.label" v-for="keyVal of node.propsKey" :key="keyVal.key">
          <template v-if="keyVal.type === 'string'">
            <Input
              type="text"
              :value="node.propsValue[keyVal.key]"
              v-on:on-change="onInput($event, keyVal)"
            />
          </template>
          <template v-if="keyVal.type === 'number'">
            <Input
              class="form-input"
              type="number"
              :value="node.propsValue[keyVal.key]"
              v-on:on-change="onInput($event, keyVal)"
            />
          </template>
          <template v-if="keyVal.type === 'select'">
            <Select :value="node.propsValue[keyVal.key]" v-on:on-change="onInput($event, keyVal)">
              <Option v-for="op in keyVal.options" :value="op.value" :key="op.value">{{ op.key }}</Option>
            </Select>
          </template>
          <template v-if="keyVal.type === 'image'">
            <image-uploader
              :src="node.propsValue[keyVal.key]"
              :object-id="node.objectId"
              :key-val="keyVal"
              v-on:image-src-change="onInput($event, keyVal)"
            />
          </template>
        </FormItem>
      </Form>
    </template>
  </div>
</template>

<script>
import { Input, Form, FormItem, Select, Option } from 'view-design'

import ImageUploader from './ImageUploader'

export default {
  name: 'PropModel',
  components: {
    ImageUploader,
    Input,
    Form,
    FormItem,
    Select,
    Option
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
    onInput (ev, keyVal) {
      let value

      if (ev.target) {
        value = ev.target.value
      } else {
        value = ev
      }

      if (keyVal.type === 'number') {
        value = Number(value)
      }

      this.node$.next({
        type: 'action/update_prop_value/request',
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

</style>
