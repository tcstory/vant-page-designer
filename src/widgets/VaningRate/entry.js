import VaningRate from './index'

import { createCompInfo } from '../../utils'

const info = createCompInfo({
  version: 'latest',
  name: VaningRate.name,
  label: '评分',
  coverImg: ''
})

info.id = info.name

export default {
  info,
  component: VaningRate,
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
  },
  getEventKey () {
    return []
  },
  getEventValue () {
    return {}
  }
}
