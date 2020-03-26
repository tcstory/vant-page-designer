<template>
    <div class="node p-1" :class="{
      'is-container': isContainer,
      'is-selected': isSelected,
      'no-children': !hasChildren
    }" @click.stop="handleSelect">
      <template v-if="isContainer">
        <component v-if="comp" v-bind:is="comp.id">
          <node v-for="item in comp.children" :key="item._createdTime" :comp="item"/>
        </component>
      </template>
      <component v-else v-bind:is="comp.id" v-bind="getPropsValue"/>
    </div>
</template>

<script>
import baseNode from '../mixin/baseNode'
import Container from '../widgets/Container.js'
import { filter } from 'rxjs/operators'

export default {
  name: 'Node',
  mixins: [baseNode],
  props: {
    comp: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      children: [],
      isSelected: false,
      tmp: {
        text: 'ok',
        type: 'info',
        'loading-text': '加载中...',
        loading: true
      }
    }
  },
  computed: {
    getPropsValue () {
      return this.comp.propsValue
    },
    isContainer () {
      return this.comp.name === Container.info.name
    },
    hasChildren () {
      if (this.isContainer) {
        return this.comp.children.length !== 0
      } else {
        return false
      }
    }
  },
  methods: {
    handleDelete () {
    },
    handleSelect () {
      this.selectedNode$.next({ type: 'SET', payload: this.comp })
    }
  },
  created () {
    this.comp.vm = this

    this.selectedNode$.pipe(
      filter(action => action.type === 'CHANGE')
    ).subscribe((action) => {
      this.isSelected = action.payload === this.comp
    })
  }
}
</script>

<style scoped lang="scss">
  @import "node_modules/spectre.css/src/variables";

  .node {
    outline: 2px solid $secondary-color;

    &.is-selected {
      outline: 2px solid $primary-color;
      z-index: 10;
    }
  }

  .is-container {
    flex: 1;

    &.no-children {
      min-height: 64px;
    }
  }
</style>
