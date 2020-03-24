import VanButton from 'vant/lib/button'
import 'vant/lib/button/style'
import { createCompInfo } from '../utils'

const info = createCompInfo({
  version: 'latest',
  name: 'VanButton',
  label: '按钮',
  coverImg: ''
})

export default {
  info,
  component: VanButton
}
