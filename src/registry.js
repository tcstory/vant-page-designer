import Vue from 'vue'
import ContainerComp from './components/ContainerComp'

const store = {
  [ContainerComp.compInfo.id]: ContainerComp
}

const keys = Object.keys(store)

for (const key of keys) {
  Vue.component(key, store[key])
}

export function createComponent (key) {
  const compInfo = store[key].compInfo
  const ret = {
    objectId: Date.now()
  }
  const keys = Object.keys(compInfo)

  for (const key of keys) {
    const value = key === 'children' ? [] : compInfo[key]

    Object.defineProperty(ret, key, {
      value,
      configurable: key === 'children',
      enumerable: true,
      writable: true
    })
  }

  return ret
}

export function getComponents () {
  return keys.map(function (key) {
    return {
      ...store[key].compInfo
    }
  })
}

Vue.prototype.getComponents = getComponents
