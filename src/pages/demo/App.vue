<template>
  <main id="iphone">
    <node
      v-if="node !== null"
      :node="node"
    />
  </main>
</template>

<script>
import { get, isNil } from 'lodash'
import { Subject } from 'rxjs'
import Vue from 'vue'

import vantWidget from '@/vantWidget'
import Node from '@/widgets/Node/entry.vue'

import Queue from '../../queue'

const q = new Queue()

vantWidget.install()

const node$ = new Subject()

Vue.prototype.node$ = node$
Vue.prototype.q = q

// todo 考虑是不是需要使用 ReplaySubject
Vue.prototype.eventBus$ = new Subject()

export default {
  name: 'App',
  components: {
    Node
  },
  data () {
    return {
      node: null,
      selectedNode: null,
      eventMap: {}
    }
  },
  methods: {
    initNodeMap () {
      this.nodeMap = {}
    },
    setEventMap (eventMap) {
      this.eventMap = eventMap
    }
  },
  created () {
    this.initNodeMap()
    q.setReceiver(window.parent)

    q.subscribe(msg => {
      if (msg.type === 'msg/bootstrap_reload/order') {
        this.node = msg.payload.node
        this.nodeMap = msg.payload.nodeMap
        this.selectedNode = msg.payload.node
      } else if (msg.type === 'msg/add_node/order') {
        const node = msg.payload

        this.nodeMap[node.objectId] = node

        if (this.node === null) {
          this.node = node

          q.sendMsg('msg/set_selected_node/request', this.node.objectId)
        } else {
          if (!isNil(this.selectedNode.children)) {
            this.selectedNode.children.push(node)
            node.parent = this.selectedNode
          }
        }
      } else if (msg.type === 'msg/set_selected_node/confirm' || msg.type === 'msg/set_selected_node/order') {
        this.selectedNode = this.nodeMap[msg.payload]

        this.node$.next({
          type: 'action/set_selected_node/broadcast',
          payload: this.selectedNode
        })
      } else if (msg.type === 'msg/delete_node/order') {
        const targetNode = this.nodeMap[msg.payload]
        if (targetNode.children) {
          targetNode.children = []
        }
        const parent = targetNode.parent
        for (let i = 0; i < parent.children.length; i++) {
          const child = parent.children[i]
          if (child.objectId === targetNode.objectId) {
            parent.children.splice(i, 1)
          }
        }
      }

      if (msg.type === 'IDE/UPDATE_EMIT_EVENT_VALUE') {
        const { objectId, key, value } = msg.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
      } else if (msg.type === 'msg/update_event_value/order') {
        const { objectId, key, value } = msg.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
      } else if (msg.type === 'msg/update_prop_value/order') {
        let { objectId, key, value, type } = msg.payload
        const node = this.nodeMap[objectId]

        if (type === 'number') {
          value = Number(value)
        }
        node.propsValue[key] = value
      } else if (msg.type === 'IDE/DELETE_NODE') {

      } else if (msg.type === 'IDE/UPDATE_EVENT_MAP') {
        this.setEventMap(msg.payload)
      }
    })

    this.eventBus$.subscribe((action) => {
      const { sender, eventType } = action.payload
      const receiverObj = get(this.eventMap, `${sender}.${eventType}`, {})

      for (const receiver of Object.keys(receiverObj)) {
        const { key, value } = receiverObj[receiver]
        this.nodeMap[receiver].propsValue[key] = value
      }
    })
  },
  mounted () {
    this.q.sendMsg('msg/bootstrap/request', '')
  }
}
</script>

<style>
body {
  width: 100%;
  min-height: 100vh;
  background-color: white;
}
</style>

<style scoped lang="scss">
@import "./reset.css";
#iphone {
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  overflow-x: hidden;
}
</style>
