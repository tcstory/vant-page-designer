<template>
  <v-card class="edit-panel-list">
    <v-tabs
      :centered="true"
      v-model="curTab"
      dark
    >
      <v-tab :key="tabName.default">基础设置</v-tab>
    </v-tabs>
    <v-tabs-items v-model="curTab">
      <v-tab-item :key="tabName.default">
        <edit-panel v-for="panel of panelList" class="edit-panel"
                    v-bind:is-active="panel.objectId === activePanel"
                    :panel="panel"
                    :senderList="senderList"
                    :event-map="eventMap"
                    :key="panel.objectId" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import EditPanel from './EditPanel'
import { filter } from 'rxjs/operators'
import { keyBy } from 'loadsh'

const tabName = {
  default: '1'
}

export default {
  name: 'EditPanelList',
  components: {
    EditPanel
  },
  data () {
    return {
      panelList: [],
      panelMap: {},
      activePanel: -1,
      senderList: [],
      eventMap: {},
      curTab: tabName.default
    }
  },
  computed: {
    tabName () {
      return tabName
    }
  },
  methods: {
    setActivePanel (id) {
      this.activePanel = id
    }
  },
  created () {
    this.node$.pipe(
      filter(action => action.type === 'EDIT_NODE.ide')
    ).subscribe((action) => {
      const { objectId } = action.payload

      if (!this.panelMap[objectId]) {
        this.panelList.push(action.payload)
        this.panelMap[objectId] = action.payload
      }

      this.setActivePanel(objectId)
    })

    this.system$.pipe(
      filter(action => action.type === 'RELOAD')
    ).subscribe((action) => {
      this.panelList = []
      this.panelMap = {}
      this.activePanel = -1
    })

    this.node$.subscribe((action) => {
      if (action.type === 'DELETE_NODE_CONFIRM.ide') {
        const deletedMap = keyBy(action.payload, 'objectId')
        const arr = []

        for (let i = 0; i < this.panelList.length; i++) {
          const target = this.panelList[i]

          if (!deletedMap[target.objectId]) {
            arr.push(target)
          }
        }

        this.panelList = arr
      } else if (action.type === 'UPDATE_NODE_MAP') {
        // todo 把真正触发了事件的给过滤出来
        // this.senderList = Object.keys(action.payload)
      } else if (action.type === 'UPDATE_EVENT_MAP') {
        console.log('谁出发的吗')
        // this.eventMap = action.payload
      } else if (action.type === 'UPDATE_EVENT_MAP_SENDER') {
        const arr = []
        const payload = action.payload

        for (const sender of Object.keys(payload)) {
          const ret = { objectId: sender, eventTypeList: [] }
          const eventMap = payload[sender]

          for (const eventType of Object.keys(eventMap)) {
            if (eventMap[eventType]) {
              ret.eventTypeList.push(eventType)
            }
          }

          if (ret.eventTypeList.length) {
            arr.push(ret)
          }
        }
        this.senderList = arr
        console.log('我要更新了.....', this.senderList)
      }
    })
  },
  beforeDestroy () {
    // 取消订阅
  }
}
</script>

<style scoped lang="scss">
  .edit-panel-list {
    height: 100%;
    width: 280px;
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    overflow: hidden;
  }
</style>
