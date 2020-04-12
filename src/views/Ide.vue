<template>
  <div class="page">
    <header class="navbar" id="nav">
      <section class="navbar-section text-gray">
        Page Designer
      </section>
      <section class="navbar-section">
        <a href="#" class="btn btn-link action-btn " @click="handleExport">
          <span class="text-gray">导入</span>
        </a>
        <a href="#" class="btn btn-link action-btn text-gray" @click="handlePublish">
          <span class="text-gray">发布</span>
        </a>
      </section>
    </header>
    <main id="stage">
      <toolbar/>
      <article class="iphone-wrap">
        <iframe src="//localhost:9000/demo.html" id="iphone" ref="receiver" frameborder="0"></iframe>
        <file-reader />
      </article>
      <edit-panel-list />
    </main>
  </div>
</template>

<script>
import { set } from 'loadsh'
import FileSaver from 'file-saver'
import Container from '@/widgets/Container/entry'
import vantWidget from '@/vantWidget'

import Toolbar from '@/components/Toolbar'
import EditPanelList from '@/components/EditPanelList'
import FileReader from '../components/FileReader'
import Queue from '../queue'
import { filter, debounceTime } from 'rxjs/operators'
import { convertToJson, outputEntryFile } from '../utils'

vantWidget.install()
const q = new Queue()

function convertToTree (node) {
  const ret = node
  vantWidget.createInstanceFromJson(ret)

  if (ret.children && ret.children.length) {
    for (const child of ret.children) {
      vantWidget.createInstanceFromJson(child)
    }
  }

  return ret
}

export default {
  name: 'Page',
  components: {
    FileReader,
    Toolbar,
    EditPanelList
  },
  data () {
    return {
      node: null,
      nodeList: [],
      selectedNode: null,
      selectedContainer: null,
      reloadIframe: false,
      eventMap: {}
    }
  },
  methods: {
    handlePublish () {
      this.system$.next({
        type: 'PUBLISH'
      })
    },
    handleExport () {
      this.system$.next({
        type: 'IMPORT'
      })
    },
    setReceiver () {
      q.setReceiver(this.$refs.receiver.contentWindow)
    },
    setRootNode () {
      const node = vantWidget.createInstance(Container.info.id)

      this.node$.next({
        type: 'ADD',
        payload: node
      })
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

      this.node$.next({
        type: 'UPDATE_EVENT_MAP_SENDER',
        payload: this.eventMap
      })
    },
    setEventReceiver (receiver, sender, eventType, key, toValue) {
      set(this.eventMap, `${sender}.${eventType}.${receiver}`, { key, value: toValue })

      q.sendMsg('UPDATE_EVENT_MAP.order', this.eventMap)
    },
    buildNodeMap (tree) {
      const traverse = (node) => {
        this.setNodeMap(node.objectId, node)

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
      } else if (msg.type === 'EVENT_BUS.request') {
        console.log('this.node', this.nodeMap)
      }
    })

    this.node$.subscribe((action) => {
      if (action.type === 'ADD') {
        this.setNodeMap(action.payload.objectId, action.payload)

        if (this.node === null) {
          q.sendMsg('ADD.order', action.payload)
          this.node = action.payload
          this.node.parent = null
          this.node$.next({
            type: 'SET_ROOT',
            payload: this.node
          })
        } else {
          if (this.selectedContainer.children) {
            this.selectedContainer.children.push(action.payload)
            action.payload.parent = this.selectedContainer
            q.sendMsg('ADD.order', action.payload)
          }
        }
      } else if (action.type === 'DELETE_NODE') {
        const targetNode = this.nodeMap[action.payload]

        if (targetNode.parent === null) {
          return
        }
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
        q.sendMsg('DELETE_NODE.order', action.payload)
        this.node$.next({ type: 'DELETE_NODE_CONFIRM', payload: action.payload })
      } else if (action.type === 'UPDATE_EVENT_VALUE') {
        const { objectId, key, value } = action.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
      } else if (action.type === 'UPDATE_PROP_VALUE') {
        let { objectId, key, value, type } = action.payload
        const node = this.nodeMap[objectId]

        if (type === 'number') {
          value = Number(value)
        }
        node.propsValue[key] = value
      } else if (action.type === 'UPDATE_STYLE_VALUE') {
        const { objectId, key, value } = action.payload
        const node = this.nodeMap[objectId]

        node.styleValue[key] = value
      } else if (action.type === 'SET_EVENT_MAP_SENDER') {
        const { eventType, sender, value } = action.payload

        this.setEventSender(sender, eventType, value)
      } else if (action.type === 'SET_EVENT_MAP_RECEIVER') {
        const { receiver, sender, eventType, key, toValue } = action.payload

        this.setEventReceiver(receiver, sender, eventType, key, toValue)
      } else {
        // nothing
      }
    })

    this.node$.pipe(
      filter(action => ['UPDATE_EVENT_VALUE', 'UPDATE_PROP_VALUE', 'UPDATE_STYLE_VALUE', 'UPDATE_EMIT_EVENT_VALUE'].indexOf(action.type) !== -1),
      debounceTime(150)
    ).subscribe((action) => {
      q.sendMsg(`${action.type}.order`, action.payload)
    })

    this.system$.subscribe((action) => {
      if (action.type === 'PUBLISH') {
        const content = convertToJson(this.node)
        const blob = new Blob([outputEntryFile(content)], { type: 'text/plain; charset=utf-8' })
        FileSaver.saveAs(blob, 'test.js')
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
  @import "node_modules/spectre.css/src/variables";

  .page {
    height: 100%;
    background-color: #202128;
  }

  $nav-height: 44px;

  #nav {
    height: $nav-height;
  }

  #stage {
    height: calc(100% - #{$nav-height});
    display: flex;
  }

  .action-btn {
    color: white!important;
  }

  .iphone-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /*background-position: 0 0,13px 13px;*/
    /*background-size: 26px 26px;*/
    /*background-image: linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0),linear-gradient(45deg,#f5f5f5 25%,transparent 0,transparent 75%,#f5f5f5 0);*/
  }

  #iphone {
    width: 375px;
    height: 667px;
    display: block;
  }
</style>
