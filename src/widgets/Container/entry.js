import Container from './index.vue'
import { createCompInfo } from '../../utils'

const info = createCompInfo({
  version: '1.0.0',
  name: 'Container',
  label: '容器',
  coverImg: '',
  children: []
})

Container.name = info.id

export default {
  info,
  component: Container,
  getDefaultPropsValue () {
    return {
    }
  },
  getPropsKey () {
    return [
    ]
  },
  getStyleValue () {
    return {
      width: '',
      height: '',
      margin: '',
      padding: '',
      display: '',
      'flex-direction': '',
      'flex-wrap': '',
      'justify-content': '',
      'align-items': '',
      'align-content': ''
    }
  },
  getStyleKey () {
    return [
      { key: 'width', label: '宽度' },
      { key: 'height', label: '高度' },
      { key: 'margin', label: '外边距' },
      { key: 'padding', label: '内边距' },
      { key: 'display', label: 'display', options: ['block', 'inline-block', 'flex'] }
    ]
  },
  getEventKey () {
    return []
  },
  getEventValue () {
    return {}
  }
}
