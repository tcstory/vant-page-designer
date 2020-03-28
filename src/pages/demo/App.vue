<template>
  <main id="iphone">
    <node v-if="node !== null" :node="node" v-bind:style="{'width': '100%', 'height': '100%'}"/>
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

export default {
  name: 'App',
  components: {
    Node
  },
  data () {
    return {
      node: null,
      selectedNode: null
    }
  },
  methods: {
    initNodeMap () {
      this.nodeMap = {}
    },
    setRootNode (node) {
      this.nodeMap[node.objectId] = node
      this.node = node
    },
    setAsDefaultSelected () {
      this.selectedNode = this.node
      q.sendMsg('SET_SELECTED.request', this.selectedNode.objectId)
    }
  },
  created () {
    this.initNodeMap()
    q.setReceiver(window.parent)

    q.subscribe((msg) => {
      if (msg.type === 'ADD.order') {
        this.nodeMap[msg.payload.objectId] = msg.payload

        if (this.node === null) {
          this.setRootNode(msg.payload)
          this.setAsDefaultSelected()
        } else {
          if (this.selectedNode.children) {
            this.selectedNode.children.push(msg.payload)
          }
        }
      } else if (msg.type === 'SET_SELECTED.order') {
        this.selectedNode = this.nodeMap[msg.payload]
        this.node$.next({
          type: 'SET_SELECTED.order',
          payload: this.selectedNode
        })
      }
    })

    this.node$.subscribe((action) => {
      if (action.type === 'SET_SELECTED.request') {
        q.sendMsg('SET_SELECTED.request', action.payload.objectId)
      }

      if (action.type === 'ADD') {
        // q.sendMsg('ADD.order', action.payload)
        //
        // if (this.node === null) {
        //   this.node = action.payload
        // } else {
        //   if (this.selectedNode.children) {
        //     this.selectedNode.children.push(action.payload)
        //   }
        // }
      } else if (action.type === 'SET_SELECTED') {
        this.selectedNode = this.nodeMap[action.payload]
        q.sendMsg('SET_SELECTED.request', this.selectedNode.objectId)
      } else {
        // nothing
      }
    })
  },
  mounted () {

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
