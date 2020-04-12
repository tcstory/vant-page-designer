import VaningButton from './index'

import { createCompInfo } from '../../utils'

const info = createCompInfo({
  version: 'latest',
  name: VaningButton.name,
  label: '按钮',
  coverImg: ''
})

info.id = info.name

export default {
  info,
  component: VaningButton,
  getDefaultPropsValue () {
    return {
      text: '按钮'
    }
  },
  getPropsKey () {
    return [
      { key: 'text', type: 'string', label: '文字' }
    ]
  },
  getStyleValue () {
    return {}
  },
  getStyleKey () {
    return []
  },
  getEventKey () {
    return [
      { key: 'click', label: 'click' },
      { key: 'touchstart', label: 'touchstart' }
    ]
  },
  getEventValue () {
    return {
      click: false,
      touchstart: false
    }
  }
}
