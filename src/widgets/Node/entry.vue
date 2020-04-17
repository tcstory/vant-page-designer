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
      <div v-if="!isContainer" class="circle num1"></div>
      <div v-if="!isContainer" class="circle num2"></div>
      <div v-if="!isContainer" class="circle num3"></div>
      <div v-if="!isContainer" class="circle num4"></div>
    </div>
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
    display: inline-block;
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
    display: block;

    &.no-children {
      min-height: 64px;
    }

    &.is-selected {
      box-shadow: inset 0 0 0 1px #009688;
      background: radial-gradient(#B2DFDB 15%, transparent 16%) 0 0;
      background-size:16px 16px;
    }
  }
</style>
