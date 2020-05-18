import Container from './index.vue'
import { createCompInfo } from '../../utils'

import { propsKey } from './common'

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
      width: '',
      height: '',
      margin: '',
      padding: '',
      display: 'block',
      'flex-direction': '',
      'flex-wrap': '',
      'justify-content': '',
      'align-items': '',
      'align-content': '',
      'flex-grow': '',
      'flex-shrink': ''
    }
  },
  getPropsKey () {
    return propsKey
  },
  getEventKey () {
    return []
  },
  getEventValue () {
    return {}
  }
}
