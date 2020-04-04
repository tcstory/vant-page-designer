<template>
  <div class="tool bg-gray" id="tool">
    <div class="action-bar">
      <div class="action-btn c-hand" :class="{'is-selected': selectedTool === 1}" @click="changeToolArea(1)">組件</div>
      <div class="action-btn c-hand" :class="{'is-selected': selectedTool === 2}" @click="changeToolArea(2)">樹</div>
    </div>
    <div :key="1" class="tool-area">
      <ul class="tab tab-block">
        <li class="tab-item" :class="{active: this.selectedTab === 0}" >
          <a @click.prevent="handleChangeTab(0)" class="text-light">基础组件</a>
        </li>
        <li class="tab-item" :class="{active: this.selectedTab === 1}">
          <a @click.prevent="handleChangeTab(1)" class="text-light">VANT UI</a>
        </li>
      </ul>
      <ul class="menu bg-dark" v-if="this.selectedTab === 0">
        <li class="divider" data-content="基础组件"></li>
        <li class="menu-item" v-for="comp in defaultComponentList" :key="comp.objectId" @click="handleAddDefaultWidget(comp)">
          <a>{{`${comp.name} ${comp.label}`}}</a>
        </li>
      </ul>
      <ul class="menu bg-dark" v-if="this.selectedTab === 1">
        <li class="divider" data-content="基础组件"></li>
        <li class="menu-item" v-for="comp in vantComponentList" :key="comp.objectId" @click="handleAddVantWidget(comp)">
          <a>{{`${comp.name} ${comp.label}`}}</a>
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

import defaultWidget from '../defaultWidget'
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
      defaultComponentList: [],
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
        payload: defaultWidget.createInstance(comp.id)
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
    this.defaultComponentList = defaultWidget.getComponents()
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
  background-color: #202128;

  &.split {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    height: 50%;
  }
}

.float-panel {

  .header {
    height: 28px;
    color: white;
    background-color: #2a2d35;
    font-size: 13px;
    line-height: 28px;
  }
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
