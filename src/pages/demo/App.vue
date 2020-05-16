<template>
  <main id="iphone">
    <node
      v-if="node !== null"
      :node="node"
    />
  </main>
</template>

<script>
import { get } from 'loadsh'
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
      selectedContainer: null,
      eventMap: {}
    }
  },
  methods: {
    initNodeMap () {
      this.nodeMap = {}
    },
    setRootNode (node) {
      this.nodeMap[node.objectId] = node
      this.node = node
      this.node.parent = null
      this.node.styleValue = {
        width: '100%',
        height: '100%'
      }
    },
    setEventMap (eventMap) {
      this.eventMap = eventMap
    }
  },
  created () {
    this.initNodeMap()
    q.setReceiver(window.parent)

    q.subscribe(msg => {
      if (msg.type === 'IDE/ADD') {
        this.nodeMap[msg.payload.objectId] = msg.payload

        if (this.node === null) {
          this.setRootNode(msg.payload)

          q.sendMsg('DEMO/SET_SELECTED', this.node.objectId)
          q.sendMsg('DEMO/SET_CONTAINER', this.node.objectId)
        } else {
          if (this.selectedContainer.children) {
            this.selectedContainer.children.push(msg.payload)
            msg.payload.parent = this.selectedContainer
          }
        }
      } else if (msg.type === 'IDE/SET_SELECTED') {
        this.selectedNode = this.nodeMap[msg.payload]

        this.node$.next({
          type: 'SET_SELECTED.demo',
          payload: this.selectedNode
        })
      } else if (msg.type === 'IDE/SET_CONTAINER') {
        this.selectedContainer = this.nodeMap[msg.payload]
      } else if (msg.type === 'IDE/UPDATE_EMIT_EVENT_VALUE') {
        const { objectId, key, value } = msg.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
      } else if (msg.type === 'IDE/UPDATE_EVENT_VALUE') {
        const { objectId, key, value } = msg.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
      } else if (msg.type === 'IDE/UPDATE_PROP_VALUE') {
        let { objectId, key, value, type } = msg.payload
        const node = this.nodeMap[objectId]

        if (type === 'number') {
          value = Number(value)
        }
        node.propsValue[key] = value
      }else if (msg.type === 'IDE/RELOAD') {
        this.node = msg.payload.node
        this.selectedNode = msg.payload.node
        this.selectedContainer = msg.payload.node
        this.nodeMap = msg.payload.nodeMap
      } else if (msg.type === 'IDE/DELETE_NODE') {
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
      } else if (msg.type === 'IDE/UPDATE_EVENT_MAP') {
        this.setEventMap(msg.payload)
      }
    })

    this.eventBus$.subscribe((action) => {
      const { sender, eventType } = action.payload
      console.log('发生了啥', action, this.eventMap)
      const receiverObj = get(this.eventMap, `${sender}.${eventType}`, {})

      // todo 支持对于 style属性的修改
      for (const receiver of Object.keys(receiverObj)) {
        const { key, value } = receiverObj[receiver]
        this.nodeMap[receiver].propsValue[key] = value
      }
    })
  },
  mounted () {
    this.q.sendMsg('DEMO/LOADED', '')
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
