import VanButton from 'vant/lib/button'
import 'vant/lib/button/style'
import { createCompInfo } from '../utils'

const info = createCompInfo({
  version: 'latest',
  name: VanButton.name,
  label: '按钮',
  coverImg: ''
})

info.id = info.name

export default {
  info,
  component: VanButton,
  getDefaultPropsValue () {
    return {
      text: '按钮'
    }
  },
  getPropsKey () {
    return [
      { key: 'text', type: 'string', label: '文字' }
    ]
  }
}
