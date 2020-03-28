<template>
  <article class="iphone-wrap">
    <iframe src="//localhost:8080/demo" id="iphone" ref="receiver" frameborder="0"></iframe>
    <file-reader />
  </article>
</template>

<script>
import FileSaver from 'file-saver'
import defaultWidget from '../defaultWidget'
import Container from '../widgets/Container.js'

import FileReader from '../components/FileReader'
import Queue from '../queue'
import { filter, debounceTime } from 'rxjs/operators'
import { convertToTree, convertToJson } from '../utils'
const q = new Queue()

export default {
  name: 'Page',
  components: {
    FileReader
  },
  data () {
    return {
      node: null,
      selectedNode: null,
      selectedContainer: null,
      reloadIframe: false
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
    },
    buildNodeMap (tree) {
      const traverse = (node) => {
        this.nodeMap[node.objectId] = node

        if (node.children && node.children.length) {
          for (const child of node.children) {
            traverse(child)
          }
        }
      }

      this.initNodeMap()
      traverse(tree)
    }
  },
  created () {
    this.initNodeMap()

    q.subscribe((msg) => {
      if (msg.type === 'SET_SELECTED.request') {
        this.selectedNode = this.nodeMap[msg.payload]
        this.node$.next({
          type: 'EDIT',
          payload: this.selectedNode
        })
        q.sendMsg('SET_SELECTED.order', this.selectedNode.objectId)
      } else if (msg.type === 'SET_CONTAINER.request') {
        this.selectedContainer = this.nodeMap[msg.payload]
        q.sendMsg('SET_CONTAINER.order', this.selectedContainer.objectId)
      } else if (msg.type === 'LOADED.request') {
        if (this.reloadIframe) {
          q.sendMsg('RELOAD.order', {
            node: this.node,
            nodeMap: this.nodeMap
          })
        } else {
          this.setReceiver()
          this.setRootNode()
        }
      }
    })

    this.node$.subscribe((action) => {
      if (action.type === 'ADD') {
        this.nodeMap[action.payload.objectId] = action.payload

        if (this.node === null) {
          q.sendMsg('ADD.order', action.payload)
          this.node = action.payload
        } else {
          if (this.selectedContainer.children) {
            this.selectedContainer.children.push(action.payload)
            q.sendMsg('ADD.order', action.payload)
          }
        }
      } else {
        // nothing
      }
    })

    this.node$.pipe(
      filter(action => action.type === 'UPDATE_PROP_VALUE'),
      debounceTime(150)
    ).subscribe((action) => {
      q.sendMsg('UPDATE_PROP_VALUE.order', action.payload)
    })

    this.system$.subscribe((action) => {
      if (action.type === 'PUBLISH') {
        const content = JSON.stringify(convertToJson(this.node))
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, 'test.json')
      } else if (action.type === 'PARSE_TREE') {
        const tree = convertToTree(action.payload)
        this.system$.next({
          type: 'RELOAD',
          payload: tree
        })
      } else if (action.type === 'RELOAD') {
        const tree = action.payload
        this.node = tree
        this.selectedNode = this.node
        this.selectedContainer = this.node
        this.buildNodeMap(tree)
        this.$refs.receiver.contentWindow.location.reload()
        this.reloadIframe = tree
      }
    })
  },
  mounted () {
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
