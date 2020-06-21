<template>
  <div class="tool">
    <div class="float-panel-top">
      <Tabs>
        <TabPane label="基础组件" :name="tabName.default" :key="tabName.default">
          <List border size="small">
            <div @click="handleAddVantWidget(comp)" v-for="comp in vantComponentList"
                 :key="comp.objectId">
              <ListItem class="list-item">
                {{`${comp.name} ${comp.label}`}}
              </ListItem>
            </div>
          </List>
        </TabPane>
        <TabPane label="业务组件" :name="tabName.business" :key="tabName.business"></TabPane>
      </Tabs>
    </div>
    <div class="float-panel-bottom">
      <Tabs>
        <TabPane label="组件树" :name="tabName.nodeTree">
          <node-tree/>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { Tabs, TabPane, List } from 'view-design'

import vantWidget from '../vantWidget'

import NodeTree from './NodeTree'

const tabName = {
  default: '1',
  business: '2',
  nodeTree: '3'
}

export default {
  name: 'Toolbar',
  components: {
    NodeTree,
    Tabs,
    TabPane,
    List,
    ListItem: List.Item
  },
  data () {
    return {
      vantComponentList: [],
      selectedTab: 0,
      selectedTool: 1,
      curTab: tabName.default
    }
  },
  computed: {
    tabName () {
      return tabName
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
        type: 'action/add_node/request',
        payload: vantWidget.createInstance(comp.id)
      })
    },
    changeToolArea (val) {
      this.selectedTool = val
    }
  },
  created () {
    this.vantComponentList = vantWidget.getComponents()
  }
}
</script>

<style scoped lang="scss">
  .tool {
    height: 100%;
    width: 280px;
    position: relative;
    border-right: 1px solid #dcdee2;
    padding: 0 4px;
  }

  .float-panel-top, .float-panel-bottom {
    height: 50%;
  }

  .float-panel {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    height: 50%;
  }

  .float-panel-bottom {
    display: flex;
    flex-direction: column;
  }

  .list-item {
    cursor: pointer;

    &:hover {
      background-color: #f8f8f9;
    }
  }
</style>
