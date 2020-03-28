<template>
  <article class="iphone-wrap">
    <iframe src="//localhost:8080/demo" id="iphone" ref="receiver" frameborder="0"></iframe>
  </article>
</template>

<script>
import defaultWidget from '../defaultWidget'
import Container from '../widgets/Container.js'

import Queue from '../queue'
const q = new Queue()

export default {
  name: 'Page',
  data () {
    return {
      node: null,
      selectedNode: null
    }
  },
  methods: {
    setReceiver () {
      q.setReceiver(this.$refs.receiver.contentWindow)
    },
    setRootNode () {
      const node = defaultWidget.createInstance(Container.info.id)

      this.node$.next({
        type: 'ADD',
        payload: node
      })
    },
    initNodeMap () {
      this.nodeMap = {}
    }
  },
  created () {
    this.initNodeMap()

    q.subscribe((msg) => {
      if (msg.type === 'SET_SELECTED.request') {
        this.node$.next({
          type: 'SET_SELECTED.request',
          payload: msg.payload
        })
      }
    })

    this.node$.subscribe((action) => {
      if (action.type === 'ADD') {
        this.nodeMap[action.payload.objectId] = action.payload
        q.sendMsg('ADD.order', action.payload)

        if (this.node === null) {
          this.node = action.payload
        } else {
          if (this.selectedNode.children) {
            this.selectedNode.children.push(action.payload)
          }
        }
      } else if (action.type === 'SET_SELECTED.request') {
        this.selectedNode = this.nodeMap[action.payload]
        q.sendMsg('SET_SELECTED.order', this.selectedNode.objectId)
      } else {
        // nothing
      }
    })
  },
  mounted () {
    this.$refs.receiver.onload = () => {
      this.setReceiver()
      this.setRootNode()
    }
  }
}
</script>

<style lang="scss" scoped>
  .iphone-wrap {
    width: 100%;
    background-position: 0 0,13px 13px;
    background-size: 26px 26px;
    background-image: linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0),linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0);
  }

  #iphone {
    width: 375px;
    height: 667px;
    margin: 20px auto 0;
    display: block;
  }
</style>
