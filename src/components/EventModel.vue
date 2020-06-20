<template>
  <div class="event-model mb-2">
    <div class="margin-border">

      <v-card class="float-panel-bottom">
        <v-card-subtitle>触发的事件</v-card-subtitle>
        <v-card-text class="text--primary">
          <v-checkbox v-for="keyVal of node.eventKey" :key="keyVal.key" class="form-checkbox"
                      :value="node.eventValue[keyVal.key]" @change="onChange($event, keyVal)"
                      :label="keyVal.key"
          ></v-checkbox>
        </v-card-text>
      </v-card>
      <v-card class="float-panel-bottom">
        <v-card-subtitle>响应的事件</v-card-subtitle>
        <div class="form-row">
          <span class="form-label">触发者</span>
          <my-select
            class="form-select"
            :value="curSender.objectId"
            @input="onInput($event, 'curSender')"
            :options="senderList.map(item=>{
              return {key: item.objectId, value: item.objectId}
            })"
          ></my-select>
        </div>
        <div class="form-row">
          <span class="form-label">事件</span>
          <my-select
            class="form-select"
            :value="curEventType"
            @input="onInput($event, 'curEventType')"
            :options="curSender.eventTypeList.map(item=>{
              return {key: item, value: item}
            })"
          ></my-select>
        </div>
        <div class="form-row">
          <span class="form-label">属性</span>
          <my-select
            class="form-select"
            :value="curProp"
            @input="onInput($event, 'curProp')"
            :options="propsKey.map(keyVal=>{
              return {key: keyVal.label, value: keyVal.key}
            })"
          ></my-select>
        </div>
        <div class="form-row">
          <span class="form-label">新值</span>
          <input
            class="form-input"
            type="text"
            v-model="curValue"
          />
        </div>
        <div class="form-row btn-row">
          <v-btn small color="primary" dark @click="handleAddPropItem">添加</v-btn>
        </div>
      </v-card>
      <div class="label" v-for="item in propList" :key="item.id">
        <span class="text-label">触发者:</span><span class="text-code">{{item.sender}}</span>,
        <span class="text-label">事件:</span><span class="text-code">{{item.eventType}}</span>,
        <span class="text-label">属性:</span><span class="text-code">{{item.key}}</span>,
        <span class="text-label">新值:</span><span class="text-code">{{item.toValue}}</span>
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
import { uniqBy, set } from 'lodash'
import Select from './Select'

export default {
  name: 'EventModel',
  components: {
    'my-select': Select
  },
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
    onInput (ev, key) {
      if (key === 'curSender') {
        for (const sender of this.senderList) {
          const value = ev.target.value
          if (sender.objectId === value) {
            this.curSender = sender
          }
        }
      } else if (key === 'curEventType') {
        this.curEventType = ev.target.value
      } else if (key === 'curProp') {
        this.curProp = ev.target.value
      }
    },
    onChange (value, keyVal) {
      this.node$.next({
        type: 'action/set_event_map_sender/request',
        payload: {
          sender: this.node.objectId,
          eventType: keyVal.key,
          value
        }
      })

      this.node$.next({
        type: 'action/update_event_value/request',
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
        type: 'action/set_event_map_receiver/request',
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

  .v-card__subtitle, .v-card__text {
    padding-left: 0;
  }

  .btn-row {
    display: flex;
    justify-content: flex-end;
  }

  .form-select {
    width: 180px;
    height: 24px;
    display: inline-block;
  }

  .text-label {
    color: rgba(255, 255, 255, 0.7);
    display: inline-block;
    padding: 0 4px;
  }

  .text-code {
    color: #4CAF50;
  }
</style>
