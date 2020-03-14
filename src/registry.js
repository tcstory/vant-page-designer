import Vue from 'vue'
import VideoComp from './components/VideoComp'
import ContainerComp from './components/ContainerComp'

const store = {
  [VideoComp.compInfo.id]: VideoComp,
  [ContainerComp.compInfo.id]: ContainerComp
}

const keys = Object.keys(store)

for (const key of keys) {
  Vue.component(key, store[key])
}

export function getComponent (key) {
  return {
    ...store[key].compInfo
  }
}

export function getComponents () {
  return keys.map(function (key) {
    return {
      ...store[key].compInfo
    }
  })
}

Vue.prototype.getComponent = getComponent

Vue.prototype.getComponents = getComponents
