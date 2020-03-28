import Container from './lib/Container'
import { createCompInfo } from '../utils'

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
  }
}
