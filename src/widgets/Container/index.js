import Container from './Container'
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
      padding: ''
    }
  },
  getStyleKey () {
    return [
      { key: 'width', label: '宽度' },
      { key: 'height', label: '高度' },
      { key: 'margin', label: '外边距' },
      { key: 'padding', label: '内边距' },
      { key: 'flex', label: 'flex 布局' }
    ]
  }
}
