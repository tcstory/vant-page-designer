<template>
    <div class="node" :class="{
      'is-container': isContainer,
      'is-selected': isSelected,
      'no-children': !hasChildren
    }" @click.stop="handleSelect">
      <template v-if="isContainer">
        <component v-if="node" v-bind:is="node.id">
          <node v-for="item in node.children" :key="item._createdTime" :node="item"/>
        </component>
      </template>
      <component v-else v-bind:is="node.id" v-bind="getPropsValue"/>
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
    node: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      children: [],
      isSelected: false
    }
  },
  computed: {
    getPropsValue () {
      return this.node.propsValue
    },
    isContainer () {
      return this.node.name === Container.info.name
    },
    hasChildren () {
      if (this.isContainer) {
        return this.node.children.length !== 0
      } else {
        return false
      }
    }
  },
  methods: {
    handleDelete () {
    },
    handleSelect () {
      this.q.sendMsg('SET_SELECTED.request', this.node.objectId)
      if (this.isContainer) {
        this.q.sendMsg('SET_CONTAINER.request', this.node.objectId)
      }
    }
  },
  created () {
    this.node$.pipe(
      filter(action => action.type === 'SET_SELECTED.order')
    ).subscribe((action) => {
      this.isSelected = action.payload === this.node
    })
  }
}
</script>

<style scoped lang="scss">
  @import "node_modules/spectre.css/src/variables";

  .node {
    box-shadow: inset 0 0 0 1px $secondary-color;

    &.is-selected {
      box-shadow: inset 0 0 0 1px $primary-color;
    }
  }

  .is-container {
    flex: 1;

    &.no-children {
      min-height: 64px;
    }
  }
</style>
