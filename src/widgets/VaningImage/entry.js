import VaningImage from './index'

import { createCompInfo } from '../../utils'

const info = createCompInfo({
  version: 'latest',
  name: VaningImage.name,
  label: '图片',
  coverImg: ''
})

info.id = info.name

export default {
  info,
  component: VaningImage,
  getDefaultPropsValue () {
    return {
      src: '//img.yzcdn.cn/vant/cat.jpeg',
      width: '100',
      height: '100'
    }
  },
  getPropsKey () {
    return [
      { key: 'src', type: 'image', label: '图片' },
      { key: 'width', type: 'string', label: '宽度' },
      { key: 'height', type: 'string', label: '高度' }
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
      { key: 'click', label: 'click' }
    ]
  },
  getEventValue () {
    return {
      click: false,
    }
  }
}