<template>
  <div class="event-model mb-2">
    <div class="margin-border">
      <Form label-position="right" :label-width="100">
        <FormItem label="触发的事件">
          <Checkbox
            v-for="keyVal of node.eventKey"
            :value="node.eventValue[keyVal.key]"
            v-on:on-change="onEmittedEventChange($event, keyVal)"
            :key="keyVal.key"
            >{{ keyVal.key }}</Checkbox
          >
        </FormItem>
        <Divider orientation="left" size="small">响应的事件</Divider>
        <FormItem label="触发者">
          <Select
            :value="curSender.objectId"
            v-on:on-select="onInput($event, 'curSender')"
          >
            <Option
              v-for="sender in senderList"
              :value="sender.objectId"
              :key="sender.objectId">
              {{ sender.objectId }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="事件">
          <Select
            :value="curEventType"
            v-on:on-select="onInput($event, 'curEventType')"
          >
            <Option
              v-for="item in curSender.eventTypeList"
              :value="item"
              :key="item">
              {{ item }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="属性">
          <Select :value="curProp" v-on:on-select="onInput($event, 'curProp')">
            <Option
              v-for="keyVal in propsKey"
              :value="keyVal.key"
              :key="keyVal.key"
              >
              {{ keyVal.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="新值">
          <Input type="text" v-model="curValue" />
        </FormItem>
        <FormItem label="">
          <Button type="primary" @click="handleAddPropItem">添加</Button>
        </FormItem>
      </Form>

      <List border size="small">
        <div class="event-wrap" v-for="(item, idx) in eventList" :key="item.id">
          <span class="serial-number">{{idx +1}}: </span>
          <span class="text-label">触发者:</span>
          <span class="text-code">{{ item.sender }}</span>,
          <span class="text-label">事件:</span>
          <span class="text-code">{{ item.eventType }}</span>,
          <span class="text-label">属性:</span>
          <span class="text-code">{{ item.key }}</span>,
          <span class="text-label">新值:</span>
          <span class="text-code">{{ item.toValue }}</span>
          <div class="action">
            <div class="status-text" :class="{'deleted': item.status === statusMap.deleted}">
              <span>{{item.statusText}}</span>
              <div @click="handleDelEvent(idx)" class="del-btn">
                <Icon type="md-trash" />
              </div>
            </div>
          </div>
        </div>
      </List>

    </div>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  Checkbox,
  Divider,
  Select,
  Option,
  Input,
  Button,
  List,
  Icon
} from 'view-design'
import { uniqBy, set } from 'lodash'

const statusMap = {
  normal: 1,
  deleted: 2
}

export default {
  name: 'EventModel',
  components: {
    Form,
    FormItem,
    Checkbox,
    Divider,
    Select,
    Option,
    Input,
    Button,
    List,
    Icon
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      senderList: [],
      eventList: [],
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
    },
    statusMap () {
      return statusMap
    }
  },
  methods: {
    onInput (ev, key) {
      let value
      if (ev.target) {
        value = ev.target.value
      } else if (ev.value) {
        value = ev.value
      } else {
        value = ev
      }

      if (key === 'curSender') {
        for (const sender of this.senderList) {
          if (sender.objectId === value) {
            this.curSender = sender
          }
        }
      } else if (key === 'curEventType') {
        this.curEventType = value
      } else if (key === 'curProp') {
        this.curProp = value
      }
    },
    onEmittedEventChange (value, keyVal) {
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
      this.eventList.push({
        id: Math.random(),
        eventType: this.curEventType,
        key: this.curProp,
        toValue: this.curValue,
        sender: this.curSender.objectId,
        status: statusMap.normal,
        statusText: ''
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
    handleDelEvent (idx) {
      this.eventList.splice(idx, 1)
    }
  },
  created () {
    this.node$.subscribe((action) => {
      if (action.type === 'action/update_event_sender_list/broadcast') {
        this.senderList = action.payload
      } else if (action.type === 'action/update_event_map_sender/broadcast') {
        console.log('action.payload', action.payload)
        console.log('this.eventList', this.eventList)

        const eventMap = action.payload
        for (const item of this.eventList) {
          const sender = item.sender

          if (!eventMap[sender]) {
            item.status = statusMap.deleted
            item.statusText = '事件已经被删除'
          } else if (!eventMap[sender][item.eventType]) {
            item.statusText = '事件已经被删除'
            item.status = statusMap.deleted
          } else {
            item.status = statusMap.normal
            item.statusText = ''
          }
        }
      }
    })
  }
}
</script>

<style scoped lang="scss">

.event-wrap {
  padding: 6px;
  border-bottom: 1px solid #dcdee2;

  &:last-of-type {
    border-bottom: none;
  }
}

.text-label {
  display: inline-block;
  padding: 0 4px;
}

.text-code {
  color: #2db7f5;
}

.status-text {
  font-size: 13px;
  height: 24px;
  line-height: 24px;

  background-color: #e8eaec;
  &.deleted {
    background-color: #ed4014;
    color: white;
  }
}

.del-btn {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
</style>
