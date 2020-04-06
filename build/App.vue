<script lang="jsx">
import Vue from 'vue'
import container from '@/widgets/Container/index.vue'
import { Button as vanButton, Image as vanImage } from 'vant'

// Vue.component('Container', container)
// Vue.component('van-button', vanButton)
// Vue.component('van-image', vanImage)

const componentMap = {
  Container: container,
  'van-button': vanButton,
  'van-image': vanImage
}

const node = { objectId: 0.8445304719595275, version: '1.0.0', name: 'Container', label: '容器', coverImg: '', children: [{ objectId: 0.6033445976135599, version: '1.0.0', name: 'Container', label: '容器', coverImg: '', children: [{ objectId: 0.735423081007502, version: 'latest', name: 'van-button', label: '按钮', coverImg: '', id: 'van-button', propsValue: { text: '按钮' }, styleValue: {} }], id: 'Container-1.0.0', styleValue: { width: '', height: '', margin: '', padding: '' } }, { objectId: 0.5277690614385764, version: 'latest', name: 'van-button', label: '按钮', coverImg: '', id: 'van-button', propsValue: { text: '按钮' }, styleValue: {} }, { objectId: 0.7708076053472583, version: 'latest', name: 'van-image', label: '图片', coverImg: '', id: 'van-image', propsValue: { src: '//img.yzcdn.cn/vant/cat.jpeg', width: '100', height: '100' }, styleValue: {} }, { objectId: 0.4803242947652062, version: 'latest', name: 'van-button', label: '按钮', coverImg: '', id: 'van-button', propsValue: { text: '按钮' }, styleValue: {} }, { objectId: 0.21242219664463202, version: 'latest', name: 'van-image', label: '图片', coverImg: '', id: 'van-image', propsValue: { src: '//img.yzcdn.cn/vant/cat.jpeg', width: '100', height: '100' }, styleValue: {} }], id: 'Container-1.0.0', styleValue: { width: '', height: '', margin: '', padding: '' } }

export default {
  name: 'App',
  data () {
    return {
      node
    }
  },
  methods: {
    getComponent (name) {
      return componentMap[name]
    },
    isContainer (node) {
      return node.name === container.name
    },
    createItem (node) {
      const MyComponent = this.getComponent(node.name)

      if (this.isContainer(node)) {
        return (
          <div style={{ ...node.styleValue }}>
            <MyComponent is={node.name} {...{ props: node.propsValue }} key={node.objectId}>
              {
                node.children && node.children.map((item) => {
                  return this.createItem(item)
                })
              }
            </MyComponent>
          </div>
        )
      } else {
        return (
          <MyComponent is={node.name} {...{ props: node.propsValue }} />
        )
      }
    }
  },
  render () {
    return this.createItem(this.node)
  }
}
</script>

<style scoped>
  body {
    color: red;
  }
</style>
