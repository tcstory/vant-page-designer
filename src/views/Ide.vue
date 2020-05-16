<template>
  <v-app>
    <v-app-bar app dense>
      <v-toolbar-title>Designer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn depressed>保存</v-btn>
      <v-btn depressed color="primary">发布</v-btn>
    </v-app-bar>
    <v-content>
      <div class="stage">
        <toolbar/>
        <div class="iframe-wrap">
          <iframe src="//localhost:9000/demo.html" id="iphone" ref="receiver" frameborder="0"></iframe>
        </div>
        <file-reader />
        <edit-panel-list />
      </div>
    </v-content>
  </v-app>
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

import 'perfect-scrollbar/dist/perfect-scrollbar.min.js'

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
      eventMap: {},
      scaleNum: 100
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

      q.sendMsg('IDE/UPDATE_EVENT_MAP', this.eventMap)
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
      if (msg.type === 'DEMO/SET_SELECTED') {
        this.selectedNode = this.nodeMap[msg.payload]

        q.sendMsg('IDE/SET_SELECTED', this.selectedNode.objectId)

        this.node$.next({
          type: 'EDIT_NODE.ide',
          payload: this.selectedNode
        })
      } else if (msg.type === 'DEMO/SET_CONTAINER') {
        this.selectedContainer = this.nodeMap[msg.payload]
        q.sendMsg('IDE/SET_CONTAINER', this.selectedContainer.objectId)
      } else if (msg.type === 'DEMO/LOADED') {
        if (this.reloadIframe) {
          q.sendMsg('IDE/RELOAD', {
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
          q.sendMsg('IDE/ADD', action.payload)
          this.node = action.payload
          this.node.parent = null
          this.node$.next({
            type: 'SET_ROOT.ide',
            payload: this.node
          })
        } else {
          if (this.selectedContainer.children) {
            this.selectedContainer.children.push(action.payload)
            action.payload.parent = this.selectedContainer
            q.sendMsg('IDE/ADD', action.payload)
          }
        }
      } else if (['DELETE_NODE.nodeTree', 'DELETE_NODE.editPanel'].indexOf(action.type) !== -1) {
        const targetNode = this.nodeMap[action.payload]

        if (targetNode.parent === null) {
          return
        }

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
        q.sendMsg('IDE/DELETE_NODE', action.payload)
        this.node$.next({ type: 'DELETE_NODE_CONFIRM.ide', payload: deletedNodes })
      } else if (action.type === 'UPDATE_EVENT_VALUE') {
        const { objectId, key, value } = action.payload
        const node = this.nodeMap[objectId]

        node.eventValue[key] = value
      } else if (action.type === 'UPDATE_PROP_VALUE.propModel') {
        let { objectId, key, value, type } = action.payload
        const node = this.nodeMap[objectId]

        if (type === 'number') {
          value = Number(value)
        }
        node.propsValue[key] = value
      } else if (action.type === 'UPDATE_STYLE_VALUE.notify') {
        const { objectId, key, value } = action.payload
        const node = this.nodeMap[objectId]

        node.styleValue[key] = value
        console.log('objectId, key, value', node.styleValue)

      } else if (action.type === 'SET_EVENT_MAP_SENDER.eventModel') {
        const { eventType, sender, value } = action.payload

        this.setEventSender(sender, eventType, value)
      } else if (action.type === 'SET_EVENT_MAP_RECEIVER.eventModel') {
        const { receiver, sender, eventType, key, toValue } = action.payload

        this.setEventReceiver(receiver, sender, eventType, key, toValue)
      } else if (action.type === 'EDIT_NODE.nodeTree') {
        this.selectedNode = this.nodeMap[action.payload.objectId]

        q.sendMsg('IDE/SET_SELECTED', this.selectedNode.objectId)

        this.node$.next({
          type: 'EDIT_NODE.ide',
          payload: this.selectedNode
        })
      } else if (action.type === 'SET_CONTAINER.nodeTree') {
        this.selectedContainer = this.nodeMap[action.payload]
        q.sendMsg('IDE/SET_CONTAINER', this.selectedContainer.objectId)
      } else {
        // nothing
      }
    })

    this.node$.pipe(
      filter(action => [
        'UPDATE_EVENT_VALUE',
        'UPDATE_PROP_VALUE.propModel',
        'UPDATE_EMIT_EVENT_VALUE'
      ].indexOf(action.type) !== -1),
      debounceTime(150)
    ).subscribe((action) => {
      q.sendMsg(`IDE/${action.type.split('.')[0]}`, action.payload)
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
  }
}
</script>

<style lang="scss" scoped>

  .stage {
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
