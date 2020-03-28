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

// import Container from '../../widgets/Container'

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
    handler (msg) {
      if (msg.type === 'ADD.order') {
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
          type: 'SET_SELECTED',
          payload: this.selectedNode
        })
      }
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
    q.subscribe(this.handler)
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
