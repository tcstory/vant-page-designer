<template>
  <div class="edit-panel-wrap bg-gray p-2">
    <edit-panel v-for="panel of panelList" class="edit-panel"
                v-bind:is-active="panel.objectId === activePanel"
                :panel="panel"
                :key="panel.objectId" />
  </div>
</template>

<script>
import EditPanel from './EditPanel'
import { filter } from 'rxjs/operators'

export default {
  name: 'EditPanelList',
  components: {
    EditPanel
  },
  data () {
    return {
      panelList: [],
      panelMap: {},
      activePanel: -1
    }
  },
  methods: {
    setActivePanel (id) {
      this.activePanel = id
    }
  },
  created () {
    this.node$.pipe(
      filter(action => action.type === 'EDIT')
    ).subscribe((action) => {
      const { objectId } = action.payload

      if (!this.panelMap[objectId]) {
        this.panelList.push(action.payload)
        this.panelMap[objectId] = action.payload
      }

      this.setActivePanel(objectId)
    })
  }
}
</script>

<style scoped lang="scss">
  .edit-panel-wrap {
    height: 100%;
    width: 320px;
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    overflow: hidden;
  }
</style>
