import Vue from 'vue'

import Container from './widgets/Container/entry'
import VaningButton from './widgets/VaningButton/entry'
import VaningImage from './widgets/VaningImage/entry'
import VaningRate from './widgets/VaningRate/entry'
import { freeze } from './utils'

const componentList = [
  Container,
  VaningButton,
  VaningImage,
  VaningRate
]

const store = {}
let keys = []

function install () {
  for (const comp of componentList) {
    const name = comp.component.name
    Vue.component(name, comp.component)

    store[name] = comp
  }

  keys = Object.keys(store)
}

function createInstance (key) {
  const obj = freeze(store[key].info)
  obj.propsValue = store[key].getDefaultPropsValue()
  // obj.propsKey = Object.freeze(store[key].getPropsKey())
  Object.defineProperty(obj, 'propsKey', {
    value: store[key].getPropsKey(),
    configurable: false,
    enumerable: true,
    writable: true
  })

  obj.eventValue = store[key].getEventValue()
  // obj.eventKey = Object.freeze(store[key].getEventKey())

  Object.defineProperty(obj, 'eventKey', {
    value: store[key].getEventKey(),
    configurable: false,
    enumerable: true,
    writable: true
  })

  return obj
}

function createInstanceFromJson (obj) {
  const key = obj.id
  if (store[key]) {
    obj.propsKey = Object.freeze(store[key].getPropsKey())
    return true
  } else {
    return false
  }
}

function getComponents () {
  return keys.map(function (key) {
    return freeze({
      ...store[key].info
    })
  })
}

export default {
  install,
  createInstance,
  createInstanceFromJson,
  getComponents,
  getComponentMap () {
    return store
  }
}
