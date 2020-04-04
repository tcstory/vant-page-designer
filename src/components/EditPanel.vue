<template>
  <div class="edit-panel p-2" :class="{active: isActive}">
    <h4>{{panel.name}}</h4>
    <div class="id-row panel-row"><span class="text-primary">唯一标识: </span>{{panel.objectId}}</div>
    <div class="action-row panel-row">
      <span class="text-primary">操作: </span>
      <button v-if="panel.parent" class="btn btn-action btn-primary btn-sm" @click="handleDelete"><i class="icon icon-delete"></i></button>
    </div>
    <box-model :node="panel" />
    <prop-model :node="panel" />
  </div>
</template>

<script>
import BoxModel from './BoxModel'
import PropModel from './PropModel'

export default {
  name: 'EditPanel',
  components: {
    BoxModel,
    PropModel
  },
  props: {
    panel: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleDelete () {
      this.node$.next({
        type: 'DELETE_NODE',
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
    font-size: 13px;
    height: 22px;
  }
</style>
