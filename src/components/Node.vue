<template>
    <div class="node m-2" :class="{'is-container': isContainer, 'is-selected': isSelected}" @click.stop="handleSelect">
      <div class="tool-row bg-secondary pt-1 pb-1" v-if="!isContainer">
        <p class="mb-0 ml-1 h6">{{compName}}</p>
        <div class="btn-wrap mr-1">
          <button class="btn btn-sm btn-primary mr-1"><i class="icon icon-menu"></i></button>
          <button class="btn btn-sm btn-error" @click="handleDelete"><i class="icon icon-delete"></i></button>
        </div>
      </div>

      <template v-if="isContainer">
        <component v-if="comp" v-bind:is="comp.id">
          <node v-for="item in comp.children" :key="item._createdTime" :comp="item"/>
        </component>
      </template>
      <component v-else v-bind:is="comp.id"/>
    </div>
</template>

<script>
import baseNode from '../mixin/baseNode'
import ContainerComp from './ContainerComp'

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
      isSelected: false
    }
  },
  computed: {
    isContainer () {
      return this.comp.name === ContainerComp.compInfo.name
    },
    compName () {
      return this.comp.name
    }
  },
  methods: {
    handleDelete () {
    },
    handleSelect () {
      this.selectedContainer$.next({ type: 'SET', payload: this.comp })
    }
  },
  created () {
    this.comp.vm = this

    this.selectedContainer$.onChange((value) => {
      this.isSelected = value === this.comp
    })

    // this.component$.onChange('ADD', (value) => {
    //   this.children = value.children
    //   console.log('children', this.children)
    // })
  }
}
</script>

<style scoped lang="scss">
  @import "node_modules/spectre.css/src/variables";

  .node {
    min-height: 64px;
    outline: 2px solid $secondary-color;

    &.is-selected {
      outline: 2px solid $primary-color;
    }
  }

  .is-container {
    flex: 1;
  }

  .tool-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .btn {
  }
</style>
