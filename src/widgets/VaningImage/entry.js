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
      height: '100',
      'font-size': 0 // 因为图片会被 node 包裹着, 设置字体为了是为了解决包裹图片的 div 的地图有空白像素的问题
    }
  },
  getPropsKey () {
    return [
      { key: 'src', type: 'image', label: '图片' },
      { key: 'width', type: 'string', label: '宽度' },
      { key: 'height', type: 'string', label: '高度' }
    ]
  },
  getEventKey () {
    return [
      { key: 'click', label: 'click' }
    ]
  },
  getEventValue () {
    return {
      click: false
    }
  }
}
