<template>
  <simplebar data-simplebar-auto-hide="false" class="edit-panel" ref="nodeTree" :class="{active: isActive}">
    <div>
      <v-card outlined>
        <div class="id-row panel-row"><span class="primary--text">组件名字: &nbsp;</span>{{panel.name}}</div>
        <div class="id-row panel-row"><span class="primary--text">唯一标识: &nbsp;</span>{{panel.objectId}}</div>
        <div class="action-row panel-row">
          <span class="primary--text">操作: &nbsp;</span>
          <v-btn icon small @click="handleDelete" v-if="panel.parent" class="del-btn">
            <v-icon medium>delete</v-icon>
          </v-btn>
        </div>
      </v-card>

      <v-card class="edit-panel-area" outlined>
        <v-tabs
          :centered="true"
          v-model="curTab"
          dark
        >
          <v-tab :key="tabName.style">样式</v-tab>
          <v-tab :key="tabName.prop">属性</v-tab>
          <v-tab :key="tabName.event">事件</v-tab>
        </v-tabs>
        <div style="padding: 0 10px;">
          <v-tabs-items v-model="curTab">
            <v-tab-item :key="tabName.style"><box-model :node="panel" /></v-tab-item>
            <v-tab-item :key="tabName.prop"><prop-model :node="panel" /></v-tab-item>
            <v-tab-item :key="tabName.event"><event-model :node="panel" :sender-list="senderList"/></v-tab-item>
          </v-tabs-items>
        </div>
      </v-card>
    </div>
  </simplebar>
</template>

<script>
import BoxModel from './BoxModel'
import PropModel from './PropModel'
import EventModel from './EventModel'

import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

const tabName = {
  style: '1',
  prop: '2',
  event: '3'
}

export default {
  name: 'EditPanel',
  components: {
    BoxModel,
    PropModel,
    EventModel,
    simplebar
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
    senderList: {
      type: Array,
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
        type: 'DELETE_NODE.editPanel',
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
    background-color: #1E1E1E;
    overflow-x: hidden;
    padding-bottom: 16px;

    &.active {
      opacity: 1;
      z-index: 10;
    }
  }

  .panel-row {
    height: 32px;
    display: flex;
    align-items: center;
    padding: 8px 10px 0;
  }

  .id-row {
    height: 22px;
  }

  .edit-panel-area {
    flex-grow: 1;
  }

  .del-btn {
    &:hover {
      color: #E91E63;
    }
  }
</style>
