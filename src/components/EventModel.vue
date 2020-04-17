<template>
  <div class="event-model mb-2">
    <p @click="handleClick" class="c-hand title-bar">
      事件模型
      <i class="icon icon-arrow-up" v-if="show"></i>
      <i class="icon icon-arrow-down" v-if="!show"></i>
    </p>
    <div class="margin-border" v-if="show">
      <div class="title">选择触发的事件: </div>
      <div class="form-group" v-for="keyVal of node.eventKey" :key="keyVal.key">
        <label class="form-checkbox">
          <input type="checkbox" :checked="node.eventValue[keyVal.key]" @change="onChange($event, keyVal)">
          <i class="form-icon"></i>
          {{keyVal.label}}
        </label>
      </div>
      <div class="title">
        添加响应的属性值:
      </div>
      <div class="input-group">
        <span class="input-group-addon addon-sm">触发者</span>
        <select class="form-select select-sm" v-model="curSender">
          <option v-for="sender of senderList" :value="sender" :key="sender.objectId">{{sender.objectId}}</option>
        </select>
        <span class="input-group-addon addon-sm">事件</span>
        <select class="form-select select-sm" v-model="curEventType">
          <option v-for="eventType of curSender.eventTypeList" :value="eventType" :key="eventType">{{eventType}}</option>
        </select>
      </div>
      <div class="input-group">
        <span class="input-group-addon addon-sm">属性</span>
        <select class="form-select select-sm" v-model="curProp">
          <option v-for="keyVal of propsKey" :value="keyVal.key" :key="keyVal.key">{{keyVal.label}}</option>
        </select>
        <span class="input-group-addon addon-sm">新值</span>
        <input class="form-input input-sm" type="text" placeholder="新值" v-model="curValue">
        <div class="upload-btn btn btn-action btn-sm" @click="handleAddPropItem">
          <i class="icon icon-plus"></i>
        </div>
      </div>
      <div class="label" v-for="item in propList" :key="item.id">
        触发者: {{item.sender}},
        事件: {{item.eventType}},
        属性: {{item.key}},
        新值: {{item.toValue}}
      </div>
<!--      <div class="btn btn-sm" v-if="propList.length" @click="applyProps">提交修改</div>-->
<!--      <input class="form-input input-sm" type="text" placeholder="新值" style="width: 160px;">-->
<!--      <label class="btn btn-action btn-sm btn-error" @click="handleDelPropItem(idx)">-->
<!--        <i class="icon icon-delete"></i>-->
<!--      </label>-->
    </div>
  </div>
</template>

<script>
import { uniqBy } from 'loadsh'

export default {
  name: 'EventModel',
  props: {
    node: {
      type: Object,
      required: true
    },
    senderList: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: true,
      propList: [],
      styleList: [],
      curSender: {
        objectId: '',
        eventTypeList: []
      },
      curEventType: '',
      curProp: '',
      curValue: ''
    }
  },
  computed: {
    propsKey () {
      return this.node.propsKey
    }
  },
  methods: {
    handleClick () {
      this.show = !this.show
    },
    onChange (ev, keyVal) {
      const value = ev.target.checked

      this.node.eventValue[keyVal.key] = value

      this.node$.next({
        type: 'SET_EVENT_MAP_SENDER.eventModel',
        payload: {
          sender: this.node.objectId,
          eventType: keyVal.key,
          value
        }
      })

      this.node$.next({
        type: 'UPDATE_EVENT_VALUE',
        payload: {
          objectId: this.node.objectId,
          key: keyVal.key,
          value
        }
      })
    },
    handleAddPropItem () {
      this.propList.push({
        id: Math.random(),
        eventType: this.curEventType,
        key: this.curProp,
        toValue: this.curValue,
        sender: this.curSender.objectId
      })

      this.node$.next({
        type: 'SET_EVENT_MAP_RECEIVER.eventModel',
        payload: {
          receiver: this.node.objectId,
          sender: this.curSender.objectId,
          eventType: this.curEventType,
          key: this.curProp,
          toValue: this.curValue
        }
      })

      this.resetPropInput()
    },
    resetPropInput () {
      this.curEventType = ''
      this.curProp = ''
      this.curValue = ''
      this.curSender = {
        objectId: '',
        eventTypeList: []
      }
    },
    handleDelPropItem (idx) {
      this.propList.splice(idx, 1)
    },
    applyProps () {
      this.propList = uniqBy(this.propList, 'eventType')
    }
  }
}
</script>

<style scoped lang="scss">
  .title-bar {
    font-size: 14px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2a2d35;
  }

  .title {
    font-size: 13px;
  }

  .event-label {
    font-size: 13px;
  }
</style>
