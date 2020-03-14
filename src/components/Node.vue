<template>
    <div class="node m-1" :class="{'is-container': isContainer, 'is-selected': isSelected}" @click.stop="handleSelect">
      <div class="tool-row bg-secondary pt-1 pb-1" v-if="!isContainer">
        <p class="mb-0 ml-1 h6">{{compName}}</p>
        <div class="btn-wrap mr-1">
          <button class="btn btn-sm btn-primary mr-1"><i class="icon icon-menu"></i></button>
          <button class="btn btn-sm btn-error" @click="handleDelete"><i class="icon icon-delete"></i></button>
        </div>
      </div>

      <template v-if="isContainer">
        <component v-if="compId" v-bind:is="compId">
          <node v-for="item in children" :key="item._createdTime" :compId="item.id"/>
        </component>
      </template>
      <component v-else v-bind:is="compId"/>
    </div>
</template>

<script>
import baseNode from '../mixin/baseNode'

export default {
  name: 'Node',
  mixins: [baseNode],
  props: {
    compId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      children: [],
      isSelected: false
    }
  },
  computed: {
    isContainer () {
      return this.getComponent(this.compId).name === 'Container'
    },
    compName () {
      return this.getComponent(this.compId).name
    }
  },
  methods: {
    handleDelete () {
    },
    handleSelect () {
      this.selectedContainer$.next({ type: 'SET', payload: this._createdTime })
    }
  },
  created () {
    this.selectedContainer$.onChange((value) => {
      this.isSelected = value === this._createdTime
    })

    this.component$.onChange('ADD', (value) => {
      this.children = value.children
      console.log('children', this.children)
    })
  }
}
</script>

<style scoped lang="scss">
  @import "node_modules/spectre.css/src/variables";

  .node {
    min-height: 64px;
  }

  .is-selected {
    outline: 2px solid $primary-color;
  }

  .is-container {
    flex: 1;
    width: 100%;
  }

  .tool-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .btn {
  }
</style>
