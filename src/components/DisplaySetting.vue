<template>
  <div v-if="hasDisplayStyle">
    <v-select
      @input="onInput($event, 'display')"
      outlined
      :items="myDisplayOptions"
      label="display"
      dense
      item-text="key"
      item-value="value"
    ></v-select>
    <div v-if="hasFlexValue">
      <v-select
        @input="onInput($event, 'flex-direction')"
        outlined
        :items="flexDirectionOptions"
        label="flex direction"
        dense
        item-text="key"
        item-value="value"
      ></v-select>
      <v-select
        @input="onInput($event, 'flex-wrap')"
        outlined
        :items="flexWrapOptions"
        label="flex wrap"
        dense
        item-text="key"
        item-value="value"
      ></v-select>
      <v-select
        @input="onInput($event, 'justify-content')"
        outlined
        :items="justifyContentOptions"
        label="justify content"
        dense
        item-text="key"
        item-value="value"
      ></v-select>
      <v-select
        @input="onInput($event, 'align-items')"
        outlined
        :items="alignItemsOptions"
        label="align items"
        dense
        item-text="key"
        item-value="value"
      ></v-select>
      <v-select
        @input="onInput($event, 'align-content')"
        outlined
        :items="alignContentOptions"
        label="align content"
        dense
        item-text="key"
        item-value="value"
      ></v-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisplaySetting',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      displayOptions: [
        { key: '', value: '' },
        { key: 'flex', value: 'flex' },
        { key: 'block', value: 'block' },
        { key: 'inline-block', value: 'inline-block' }
      ],
      flexDirectionOptions: [
        { key: '', value: '' },
        { key: 'row', value: 'row' },
        { key: 'column', value: 'column' }
      ],
      flexWrapOptions: [
        { key: '', value: '' },
        { key: 'wrap', value: 'wrap' },
        { key: 'nowrap', value: 'nowrap' }
      ],
      justifyContentOptions: [
        { key: '', value: '' },
        { key: 'flex-start', value: 'flex-start' },
        { key: 'flex-end', value: 'flex-end' },
        { key: 'center', value: 'center' },
        { key: 'space-between', value: 'space-between' },
        { key: 'space-around', value: 'space-around' }
      ],
      alignItemsOptions: [
        { key: '', value: '' },
        { key: 'flex-start', value: 'flex-start' },
        { key: 'flex-end', value: 'flex-end' },
        { key: 'center', value: 'center' },
        { key: 'baseline', value: 'baseline' },
        { key: 'stretch', value: 'stretch' }
      ],
      alignContentOptions: [
        { key: '', value: '' },
        { key: 'flex-start', value: 'flex-start' },
        { key: 'flex-end', value: 'flex-end' },
        { key: 'center', value: 'center' },
        { key: 'space-between', value: 'space-between' },
        { key: 'space-around', value: 'space-around' },
        { key: 'stretch', value: 'stretch' }
      ]
    }
  },
  computed: {
    hasDisplayStyle () {
      for (const keyVal of this.node.styleKey) {
        if (keyVal.key === 'display') {
          return true
        }
      }

      return false
    },
    hasFlexValue () {
      for (const keyVal of this.node.styleKey) {
        if (keyVal.key === 'display') {
          return keyVal.options.indexOf('flex') !== -1
        }
      }

      return false
    },
    myDisplayOptions () {
      if (this.hasFlexValue) {
        return this.displayOptions
      } else {
        return this.displayOptions.filter(item => item.key !== 'flex')
      }
    }
  },
  methods: {
    onInput (value, key) {
      this.node$.next({
        type: 'UPDATE_STYLE_VALUE.notify',
        payload: {
          objectId: this.node.objectId,
          key: key,
          value
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
