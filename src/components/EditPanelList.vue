<template>
  <div class="edit-panel-list">
    <edit-panel v-for="panel of panelList" class="edit-panel"
                v-bind:is-active="panel.objectId === activePanel"
                :panel="panel"
                :event-map="eventMap"
                :key="panel.objectId" />
  </div>
</template>

<script>
import EditPanel from './EditPanel'
import { filter } from 'rxjs/operators'
import { keyBy } from 'lodash'

const tabName = {
  style: '1',
  prop: '2',
  event: '3'
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
    this.node$.subscribe((action) => {
      if (action.type === 'action/delete_node/broadcast') {
        const deletedMap = keyBy(action.payload, 'objectId')
        const arr = []

        for (let i = 0; i < this.panelList.length; i++) {
          const target = this.panelList[i]

          if (!deletedMap[target.objectId]) {
            arr.push(target)
          }
        }

        this.panelList = arr
        this.activePanel = -1
      } else if (action.type === 'UPDATE_NODE_MAP') {
        // todo 把真正触发了事件的给过滤出来
        // this.senderList = Object.keys(action.payload)
      } else if (action.type === 'UPDATE_EVENT_MAP') {
        console.log('谁出发的吗')
        // this.eventMap = action.payload
      } else if (action.type === 'action/edit_node/broadcast') {
        const { objectId } = action.payload

        if (!this.panelMap[objectId]) {
          this.panelList.push(action.payload)
          this.panelMap[objectId] = action.payload
        }

        this.setActivePanel(objectId)
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
    width: 300px;
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    overflow: hidden;
  }
</style>
