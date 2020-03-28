<template>
  <div class="edit-panel-wrap bg-gray p-2">
    <div v-for="panel of panelList" :key="panel.objectId" class="edit-panel"
         :class="{active: activePanel === panel.objectId}">
      <div class="form-group" v-for="keyVal of panel.propsKey" :key="keyVal.key">
        <label class="form-label" :for="keyVal.key">{{keyVal.label}}</label>
        <input class="form-input" type="text" :id="keyVal.key"
               v-on:input="onInput($event, panel, keyVal)">
      </div>
    </div>
  </div>
</template>

<script>
import { filter } from 'rxjs/operators'

export default {
  name: 'EditPanel',
  data () {
    return {
      panelList: [],
      panelMap: {},
      activePanel: -1
    }
  },
  methods: {
    onInput (ev, panel, keyVal) {
      const value = ev.target.value

      panel.propsValue[keyVal.key] = value

      this.node$.next({
        type: 'UPDATE_PROP_VALUE',
        payload: {
          objectId: panel.objectId,
          key: keyVal.key,
          value
        }
      })
    },
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

      console.log(this.panelList)
      this.setActivePanel(objectId)
    })
  }
}
</script>

<style scoped lang="scss">
  .edit-panel-wrap {
    height: 100%;
    width: 240px;
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    overflow: hidden;
  }

  .edit-panel {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    &.active {
      opacity: 1;
      z-index: 10;
    }
  }
</style>
