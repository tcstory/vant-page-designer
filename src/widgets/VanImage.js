import VanImage from 'vant/lib/image'
import 'vant/lib/image/style'
import { createCompInfo } from '../utils'

const info = createCompInfo({
  version: 'latest',
  name: VanImage.name,
  label: '图片',
  coverImg: ''
})

info.id = info.name

export default {
  info,
  component: VanImage,
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
  }
}
