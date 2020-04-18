<template>
  <div class="edit-panel" :class="{active: isActive}" ref="panel">
    <v-card>
      <div class="id-row panel-row"><span class="primary--text">组件名字: &nbsp;</span>{{panel.name}}</div>
      <div class="id-row panel-row"><span class="primary--text">唯一标识: &nbsp;</span>{{panel.objectId}}</div>
      <div class="action-row panel-row">
        <span class="primary--text">操作: &nbsp;</span>
        <v-btn icon small @click="handleDelete" v-if="panel.parent">
          <v-icon medium>delete</v-icon>
        </v-btn>
      </div>
    </v-card>

    <v-card class="edit-panel-list">
      <v-tabs
        :centered="true"
        v-model="curTab"
        dark
      >
        <v-tab :key="tabName.style">样式</v-tab>
        <v-tab :key="tabName.prop">属性</v-tab>
        <v-tab :key="tabName.event">事件</v-tab>
      </v-tabs>
      <v-tabs-items v-model="curTab">
        <v-tab-item :key="tabName.style"><box-model :node="panel" /></v-tab-item>
        <v-tab-item :key="tabName.prop"><prop-model :node="panel" /></v-tab-item>
        <v-tab-item :key="tabName.event"><event-model :node="panel" :sender-list="senderList"/></v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import BoxModel from './BoxModel'
import PropModel from './PropModel'
import EventModel from './EventModel'
import PerfectScrollbar from 'perfect-scrollbar'

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
    EventModel
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
  },
  mounted () {
    this.ps = new PerfectScrollbar(this.$refs.panel)
  },
  beforeDestroy () {
    this.ps.destroy()
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

    &.active {
      opacity: 1;
      z-index: 10;
    }
  }

  .panel-row {
    height: 32px;
    display: flex;
    align-items: center;
  }

  .id-row {
    height: 22px;
  }

  .edit-panel-list {
    flex-grow: 1;
  }
</style>
