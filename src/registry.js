import Vue from 'vue'
import Container from './widgets/Container.js'
import install from './installVan'

const store = {
  [Container.info.id]: Container
}

let keys = Object.keys(store)

for (const key of keys) {
  Vue.component(key, store[key].component)
}

Object.assign(store, install())

keys = Object.keys(store)

function freeze (info) {
  const ret = {
    objectId: Date.now(),
    ...info
  }

  const keys = Object.keys(ret)

  for (const key of keys) {
    const value = key === 'children' ? [] : ret[key]

    Object.defineProperty(ret, key, {
      value,
      configurable: key === 'children',
      enumerable: true,
      writable: true
    })
  }

  return ret
}

export function createInstance (key) {
  return freeze(store[key].info)
}

export function getComponents () {
  return keys.map(function (key) {
    return freeze({
      ...store[key].info
    })
  })
}

Vue.prototype.getComponents = getComponents
