<template>
  <component v-if="node && isContainer"
             :class="{
               'node': true,
               'container-node': true,
               'is-selected': isSelected,
               'no-children': !hasChildren,
               'is-root': !node.parent
             }"
             @select="handleSelect"
             v-bind:is="node.id" :objectId="node.objectId" v-bind:propsValue="getPropsValue">
    <node v-for="item in node.children" :key="item.objectId" :node="item"/>
  </component>
  <component v-else v-bind:is="node.id"
             class="node base-node" :class="{'is-root': !node.parent, 'is-selected': isSelected,}"
             :key="node.objectId"
             @select="handleSelect"
             v-bind:eventValue="getEventValue"
             v-bind:propsValue="getPropsValue" :objectId="node.objectId">
    <template v-slot:select-box>
      <div class="circle num1"></div>
      <div class="circle num2"></div>
      <div class="circle num3"></div>
      <div class="circle num4"></div>
    </template>
  </component>
</template>

<script>
import Container from '../Container/entry'
import { filter } from 'rxjs/operators'

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
    handleSelect () {
      this.q.sendMsg('DEMO/SET_SELECTED', this.node.objectId)

      if (this.isContainer) {
        this.q.sendMsg('DEMO/SET_CONTAINER', this.node.objectId)
      }
    }
  },
  created () {
    this.subscribtion = this.node$.pipe(
      filter(action => action.type === 'SET_SELECTED.demo')
    ).subscribe((action) => {
      this.isSelected = action.payload === this.node
    })
  },
  beforeDestroy () {
    this.subscribtion.unsubscribe()
  }
}
</script>

<style scoped lang="scss">

  .base-node {
    /*display: inline-block;*/
    position: relative;

    &.is-selected {
      outline: 1px dashed #009688;

      .circle {
        opacity: .5;
      }
    }

    .circle {
      width: 12px;
      height: 12px;
      background-color: #fff;
      border: 1px solid #009688;
      border-radius: 12px;
      display: block;
      position: absolute;
      opacity: 0;

      &.num1 {
        left: -6px;
        top: -6px;
      }

      &.num2 {
        right: -6px;
        top: -6px;
      }

      &.num3 {
        right: -6px;
        bottom: -6px;
      }

      &.num4 {
        left: -6px;
        bottom: -6px;
      }
    }

  }

  .container-node {
    /*flex: 1;*/
    /*display: block;*/

    &.is-root {
      width: 100%;
      height: 100%;
    }

    &.no-children {
      height: 64px;
    }

    &.is-selected {
      outline: 1px dashed #009688;
      background: radial-gradient(#B2DFDB 15%, transparent 16%) 0 0;
      background-size: 16px 16px;
    }
  }
</style>
