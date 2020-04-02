<template>
  <main id="iphone">
    <node
      v-if="node !== null"
      :node="node"
    />
  </main>
</template>

<script>
import { Subject } from 'rxjs'
import Vue from 'vue'

import defaultWidget from '@/defaultWidget.js'
import vantWidget from '@/vantWidget'
import Node from '@/components/Node'

import Queue from '../../queue'

const q = new Queue()

defaultWidget.install()
vantWidget.install()

const node$ = new Subject()

Vue.prototype.node$ = node$
Vue.prototype.q = q

export default {
  name: 'App',
  components: {
    Node
  },
  data () {
    return {
      node: null,
      selectedNode: null,
      selectedContainer: null
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
    }
  },
  created () {
    this.initNodeMap()
    q.setReceiver(window.parent)

    q.subscribe(msg => {
      if (msg.type === 'ADD.order') {
        this.nodeMap[msg.payload.objectId] = msg.payload

        if (this.node === null) {
          this.setRootNode(msg.payload)
          q.sendMsg('SET_SELECTED.request', this.node.objectId)
          q.sendMsg('SET_CONTAINER.request', this.node.objectId)
        } else {
          if (this.selectedContainer.children) {
            this.selectedContainer.children.push(msg.payload)
            msg.payload.parent = this.selectedContainer
          }
        }
      } else if (msg.type === 'SET_SELECTED.order') {
        this.selectedNode = this.nodeMap[msg.payload]
        this.node$.next({
          type: 'SET_SELECTED.order',
          payload: this.selectedNode
        })
      } else if (msg.type === 'SET_CONTAINER.order') {
        this.selectedContainer = this.nodeMap[msg.payload]
      } else if (msg.type === 'UPDATE_PROP_VALUE.order') {
        let { objectId, key, value, type } = msg.payload
        const node = this.nodeMap[objectId]

        if (type === 'number') {
          value = Number(value)
        }
        node.propsValue[key] = value
      } else if (msg.type === 'UPDATE_STYLE_VALUE.order') {
        const { objectId, key, value } = msg.payload
        const node = this.nodeMap[objectId]
        console.log('value', value)
        node.styleValue[key] = value
      } else if (msg.type === 'RELOAD.order') {
        this.node = msg.payload.node
        this.selectedNode = msg.payload.node
        this.selectedContainer = msg.payload.node
        this.nodeMap = msg.payload.nodeMap
      } else if (msg.type === 'DELETE_NODE.order') {
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
    })
  },
  mounted () {
    this.q.sendMsg('LOADED.request', '')
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100vh;
}
</style>

<style scoped lang="scss">
@import "~vant/lib/style/reset.css";
#iphone {
  width: 100%;
  height: 100%;
}
</style>
