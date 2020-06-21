<template>
  <div class="page">
    <div class="page-header">
      <div class="logo"></div>
      <div class="btn-group">
        <Button>保存</Button>
        <Button type="primary">发布</Button>
      </div>
    </div>
    <div class="stage">
      <toolbar/>
      <div class="iframe-wrap">
        <iframe src="//localhost:9000/demo.html" id="iphone" ref="receiver" frameborder="0"></iframe>
      </div>
      <edit-panel-list />
    </div>
  </div>
</template>

<script>
import { set, isNil, uniq, without } from 'lodash'
import Container from '@/widgets/Container/entry'
import vantWidget from '@/vantWidget'

import Toolbar from '@/components/Toolbar'
import EditPanelList from '@/components/EditPanelList'
import Queue from '../queue'

import { Button } from 'view-design'

import 'perfect-scrollbar/dist/perfect-scrollbar.min.js'

vantWidget.install()
const q = new Queue()

export default {
  name: 'Page',
  components: {
    Toolbar,
    EditPanelList,
    Button
  },
  data () {
    return {
      node: null,
      nodeList: [],
      selectedNode: null,
      eventMap: {},
      senderList: [],
      scaleNum: 100
    }
  },
  methods: {
    setReceiver () {
      q.setReceiver(this.$refs.receiver.contentWindow)
    },
    initNodeMap () {
      this.setNodeMap()
    },
    setNodeMap (key, value) {
      if (!key) {
        this.nodeMap = {}
      } else {
        this.nodeMap[key] = value

        this.node$.next({
          type: 'UPDATE_NODE_MAP',
          payload: this.nodeMap
        })
      }
    },
    setEventSender (sender, eventType, value) {
      if (value) {
        set(this.eventMap, `${sender}.${eventType}`, {})
      } else {
        set(this.eventMap, `${sender}.${eventType}`, null)
      }

      for (const senderId of Object.keys(this.eventMap)) {
        let curSender
        let idx = -1

        for (let i = 0; i < this.senderList.length; i++) {
          if (senderId === this.senderList[i].objectId) {
            curSender = this.senderList[i]
            idx = i
            break
          }
        }

        if (!curSender) {
          curSender = { objectId: senderId, eventTypeList: [] }
        }

        const eventMap = this.eventMap[senderId]

        for (const eventType of Object.keys(eventMap)) {
          if (eventMap[eventType]) {
            curSender.eventTypeList = uniq(curSender.eventTypeList.concat(eventType))
          } else {
            curSender.eventTypeList = without(curSender.eventTypeList, eventType)
          }
        }

        if (idx === -1) {
          this.senderList.push(curSender)
        }
      }

      console.log('this.eventMap', this.eventMap)
      console.log('this.senderList', this.senderList)

      this.node$.next({
        type: 'action/update_event_map_sender/broadcast',
        payload: this.eventMap
      })

      this.node$.next({
        type: 'action/update_event_sender_list/broadcast',
        payload: this.senderList
      })
    },
    setEventReceiver (receiver, sender, eventType, key, toValue) {
      set(this.eventMap, `${sender}.${eventType}.${receiver}`, { key, value: toValue })

      q.sendMsg('IDE/UPDATE_EVENT_MAP', this.eventMap)
    }
  },
  created () {
    this.initNodeMap()

    q.subscribe((msg) => {
      if (msg.type === 'msg/bootstrap/request') {
        this.node$.next({
          type: 'action/bootstrap',
          payload: msg.payload
        })
      } else if (msg.type === 'msg/set_selected_node/request') {
        this.selectedNode = this.nodeMap[msg.payload]

        q.sendMsg('msg/set_selected_node/confirm', this.selectedNode.objectId)

        this.node$.next({
          type: 'action/edit_node/broadcast',
          payload: this.selectedNode
        })
      }
    })

    this.node$.subscribe((action) => {
      if (action.type === 'action/bootstrap') {
        this.setReceiver()

        this.node$.next({
          type: 'action/add_node',
          payload: vantWidget.createInstance(Container.info.id)
        })
      } else if (action.type === 'action/add_node' || action.type === 'action/add_node/request') {
        const node = action.payload
        this.setNodeMap(node.objectId, node)

        if (this.node === null) {
          this.node = node
          this.node.parent = null
          this.node.propsValue = {
            width: '100%',
            height: '100%'
          }

          this.node$.next({
            type: 'action/set_root_node/broadcast',
            payload: this.node
          })
        } else {
          if (!isNil(this.selectedNode.children)) {
            this.selectedNode.children.push(node)
            node.parent = this.selectedNode
          }
        }

        q.sendMsg('msg/add_node/order', node)
      } else if (action.type === 'action/delete_node/request') {
        const targetNode = this.nodeMap[action.payload]

        if (targetNode.parent === null) {

        } else {
          let deletedNodes = [targetNode]

          if (targetNode.children) {
            deletedNodes = deletedNodes.concat(targetNode.children)
            targetNode.children = []
          }

          const parent = targetNode.parent
          for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i]
            if (child.objectId === targetNode.objectId) {
              parent.children.splice(i, 1)
            }
          }
          q.sendMsg('msg/delete_node/order', action.payload)
          this.node$.next({ type: 'action/delete_node/broadcast', payload: deletedNodes })
        }
      } else if (action.type === 'action/edit_node/request') {
        this.selectedNode = this.nodeMap[action.payload.objectId]

        q.sendMsg('msg/set_selected_node/order', this.selectedNode.objectId)

        this.node$.next({
          type: 'action/edit_node/broadcast',
          payload: this.selectedNode
        })
      } else if (action.type === 'action/update_event_value/request') {
        const { objectId, key, value } = action.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
        q.sendMsg('msg/update_event_value/order', action.payload)
      } else if (action.type === 'action/update_prop_value/request') {
        let { objectId, key, value, type } = action.payload
        const node = this.nodeMap[objectId]

        if (type === 'number') {
          value = Number(value)
        }
        node.propsValue[key] = value
        q.sendMsg('msg/update_prop_value/order', action.payload)
      } else if (action.type === 'action/update_style_value/request') {
        const { objectId, key, value } = action.payload
        const node = this.nodeMap[objectId]

        node.styleValue[key] = value
        q.sendMsg('msg/update_style_value/order', action.payload)
      } else if (action.type === 'action/set_event_map_sender/request') {
        const { eventType, sender, value } = action.payload

        this.setEventSender(sender, eventType, value)
      } else if (action.type === 'action/set_event_map_receiver/request') {
        const { receiver, sender, eventType, key, toValue } = action.payload

        this.setEventReceiver(receiver, sender, eventType, key, toValue)
      } else {
        // nothing
      }
    })
  }
}
</script>

<style lang="scss" scoped>
   $page-header-height: 48px;

   .page {
     height: 100vh;
   }

  .page-header {
    height: $page-header-height;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: white;
    z-index: 10;
    border-bottom: 1px solid #dcdee2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .stage {
    padding-top: $page-header-height;
    display: flex;
    height: 100%;
  }

  #iphone {
    width: 375px;
    height: 667px;
    display: block;
  }

  .iframe-wrap {
    position: relative;
    padding-top: 16px;
    padding-bottom: 60px;
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }

</style>
