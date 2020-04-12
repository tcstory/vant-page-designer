<template>
  <div class="tool" id="tool">
    <div class="action-bar">
      <div class="action-btn c-hand" :class="{'is-selected': selectedTool === 1}" @click="changeToolArea(1)">組件</div>
      <div class="action-btn c-hand" :class="{'is-selected': selectedTool === 2}" @click="changeToolArea(2)">樹</div>
    </div>
    <div :key="1" class="tool-area">
      <div class="header pl-2">基础组件</div>
      <ul class="menu pl-0" v-if="this.selectedTab === 0">
        <li class="menu-item" v-for="comp in vantComponentList" :key="comp.objectId" @click="handleAddVantWidget(comp)">
          <a class="text-gray">{{`${comp.name} ${comp.label}`}}</a>
        </li>
      </ul>
    </div>
    <div :key="2" class="tool-area split" id="split">
      <div class="float-panel">
        <div class="header pl-2">組件樹</div>
        <node-tree />
      </div>
    </div>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'

import vantWidget from '../vantWidget'

import NodeTree from './NodeTree'
require('perfect-scrollbar/css/perfect-scrollbar.css')

export default {
  name: 'Toolbar',
  components: {
    NodeTree
  },
  data () {
    return {
      vantComponentList: [],
      selectedTab: 0,
      selectedTool: 1
    }
  },
  methods: {
    handleChangeTab (val) {
      this.selectedTab = val
    },
    handleAddDefaultWidget (comp) {
      this.node$.next({
        type: 'ADD',
        payload: vantWidget.createInstance(comp.id)
      })
    },
    handleAddVantWidget (comp) {
      this.node$.next({
        type: 'ADD',
        payload: vantWidget.createInstance(comp.id)
      })
    },
    changeToolArea (val) {
      this.selectedTool = val
    }
  },
  created () {
    this.vantComponentList = vantWidget.getComponents()
  },
  mounted () {
    this.ps = new PerfectScrollbar('#split')
    console.log('this.ps', this.ps)
  },
  beforeDestroy () {
    this.ps.destroy()
  }
}
</script>

<style scoped lang="scss">
  @import "node_modules/spectre.css/src/variables";

  .tab {
    border-bottom: none!important;
    margin: 0!important;
  }

  .tab-item {
    text-align: unset!important;
    & > a {
      border-bottom: none!important;
    }
  }

  .menu {
    transform: none!important;
    background-color: transparent;
  }

  .menu-item {
    & > a:hover {
      background-color: $gray-color-dark!important;
      color: $light-color!important;
    }
  }

.tool {
  height: 100%;
  width: 300px;
  flex-shrink: 0;
  flex-grow: 0;
  padding-left: 0;
  display: flex;
  position: relative;
}

.tool-area {
  flex-grow: 1;

  &.split {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    height: 50%;
  }
}

.header {
  height: 28px;
  color: white;
  background-color: #2a2d35;
  font-size: 13px;
  line-height: 28px;
}

.action-bar {
  width: 48px;
  height: 100%;
  background-color: #2a2d35;
  padding-top: 24px;
  flex-shrink: 0;
  display: none;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  margin: 0 auto 16px;
  font-size: 14px;

  &.is-selected {
    border: 1px solid #87aab3;
  }
}
</style>
