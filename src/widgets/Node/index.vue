<template>
    <div class="node" :class="{
      'base-node': !isContainer,
      'container-node': isContainer,
      'is-selected': isSelected,
      'no-children': !hasChildren
    }" @click.stop="handleSelect"  v-bind:style="getStyleValue">
      <template v-if="isContainer">
        <component v-if="node" v-bind:is="node.id" :objectId="node.objectId">
          <node v-for="item in node.children" :key="item._createdTime" :node="item"/>
        </component>
      </template>
      <component v-else v-bind:is="node.id"
                 v-bind:eventValue="getEventValue"
                 v-bind:propsValue="getPropsValue" :objectId="node.objectId"/>
    </div>
</template>

<script>
import Container from '../Container/entry'

export default {
  name: 'Node',
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
    getEventValue () {
      return this.node.eventValue
    },
    getPropsValue () {
      return this.node.propsValue
    },
    getStyleValue () {
      return this.node.styleValue
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
  }
}
</script>
