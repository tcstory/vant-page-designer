<template>
  <div class="edit-panel" :class="{active: isActive}">
    <Card :dis-hover="true">
      <div class="panel-row"><span>组件名字: &nbsp;</span>{{panel.name}}</div>
      <div class="panel-row"><span>唯一标识: &nbsp;</span>{{panel.objectId}}</div>
      <div class="panel-row">
        <span class="">操作: &nbsp;</span>
        <div @click="handleDelete" v-if="panel.parent" class="del-btn">
          <Icon type="md-trash" />
        </div>
      </div>
    </Card>

    <Tabs>
      <TabPane label="基础组件" :name="tabName.prop" :key="tabName.prop">
        <prop-model :node="panel" />
      </TabPane>
      <TabPane label="事件" :name="tabName.event" :key="tabName.event">
        <event-model :node="panel" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import PropModel from './PropModel'
import EventModel from './EventModel'
import { Card, Icon, Tabs, TabPane } from 'view-design'

const tabName = {
  style: '1',
  prop: '2',
  event: '3'
}

export default {
  name: 'EditPanel',
  components: {
    PropModel,
    EventModel,
    Card,
    Icon,
    Tabs,
    TabPane,
  },
  props: {
    panel: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    },
    eventMap: {
      type: Object,
      required: true
    }
  },
  computed: {
    tabName () {
      return tabName
    }
  },
  data () {
    return {
      curTab: tabName.style
    }
  },
  methods: {
    handleDelete () {
      this.node$.next({
        type: 'action/delete_node/request',
        payload: this.panel.objectId
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .edit-panel {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    padding-bottom: 16px;

    &.active {
      opacity: 1;
      z-index: 1;
    }
  }

  .panel-row {
    height: 22px;
    display: flex;
    align-items: center;
  }

  .edit-panel-area {
    flex-grow: 1;
  }

  .del-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color: #ed4014;
    }
  }
</style>
