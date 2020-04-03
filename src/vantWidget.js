import Vue from 'vue'

import VanButton from './widgets/VanButton'
import VanImage from './widgets/VanImage'
import VanRate from './widgets/VanRate'
import { freeze } from './utils'

const componentList = [
  VanButton,
  VanImage,
  VanRate
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
  obj.propsKey = Object.freeze(store[key].getPropsKey())

  obj.styleValue = store[key].getStyleValue()
  obj.styleKey = store[key].getStyleKey()

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
  getComponents
}
