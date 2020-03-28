<template>
  <div class="tool bg-gray p-2">
    <ul class="tab tab-block">
      <li class="tab-item" :class="{active: this.selectedTab === 0}" >
        <a @click.prevent="handleChangeTab(0)">基础组件</a>
      </li>
      <li class="tab-item" :class="{active: this.selectedTab === 1}">
        <a @click.prevent="handleChangeTab(1)">VANT UI</a>
      </li>
    </ul>
    <ul class="menu" v-if="this.selectedTab === 0">
      <li class="divider" data-content="基础组件"></li>
      <li class="menu-item" v-for="comp in defaultComponentList" :key="comp.objectId" @click="handleAddDefaultWidget(comp)">
        <a>{{`${comp.name} ${comp.label}`}}</a>
      </li>
    </ul>
    <ul class="menu" v-if="this.selectedTab === 1">
      <li class="divider" data-content="基础组件"></li>
      <li class="menu-item" v-for="comp in vantComponentList" :key="comp.objectId" @click="handleAddVantWidget(comp)">
        <a>{{`${comp.name} ${comp.label}`}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import defaultWidget from '../defaultWidget'
import vantWidget from '../vantWidget'

export default {
  name: 'Toolbar',
  data () {
    return {
      defaultComponentList: [],
      vantComponentList: [],
      selectedTab: 0
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
    }
  },
  created () {
    this.vantComponentList = vantWidget.getComponents()
    this.defaultComponentList = defaultWidget.getComponents()
  }
}
</script>

<style scoped lang="scss">
.card {
  cursor: pointer;
  width: 100px;
  font-size: 14px;
  display: inline-block;

  .card-image {
    padding-top: 0;
    height: 64px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    margin: 0 auto;
  }
}

.tool {
  height: 100%;
  width: 240px;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
