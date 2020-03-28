import VanImage from 'vant/lib/rate'
import 'vant/lib/rate/style'
import { createCompInfo } from '../utils'

const info = createCompInfo({
  version: 'latest',
  name: VanImage.name,
  label: '评分',
  coverImg: ''
})

info.id = info.name

export default {
  info,
  component: VanImage,
  getDefaultPropsValue () {
    return {
      value: 3,
      count: 5
    }
  },
  getPropsKey () {
    return [
      { key: 'value', type: 'number', label: '当前分值' },
      { key: 'count', type: 'string', label: '图标总数' }
    ]
  }
}
