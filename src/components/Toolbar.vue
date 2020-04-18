<template>
  <div class="tool">
    <v-card class="float-panel-top">
      <v-tabs
        :centered="true"
        v-model="curTab"
        dark
      >
        <v-tab :key="tabName.default">基础组件</v-tab>
        <v-tab :key="tabName.business">业务组件</v-tab>
      </v-tabs>
      <v-tabs-items v-model="curTab">
        <v-tab-item :key="tabName.default">
          <v-list dense>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item
                @click="handleAddVantWidget(comp)"
                v-for="comp in vantComponentList"
                :key="comp.objectId"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{`${comp.name} ${comp.label}`}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

        </v-tab-item>
        <v-tab-item :key="tabName.business">
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-card class="float-panel-bottom">
      <v-card-subtitle >组件树</v-card-subtitle>
      <node-tree />
    </v-card>
  </div>
</template>

<script>
import vantWidget from '../vantWidget'

import NodeTree from './NodeTree'

const tabName = {
  default: '1',
  business: '2'
}

export default {
  name: 'Toolbar',
  components: {
    NodeTree
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
  }
}
</script>

<style scoped lang="scss">
  .tool {
    height: 100%;
    width: 240px;
    position: relative;
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
</style>
