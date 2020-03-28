import Vue from 'vue'

import VanButton from './widgets/VanButton'
import VanImage from './widgets/VanImage'
import { freeze } from './utils'

const componentList = [
  VanButton,
  VanImage
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
  obj.propsValue = getPropsValue(store[key])

  return obj
}

function getComponents () {
  return keys.map(function (key) {
    return freeze({
      ...store[key].info
    })
  })
}

function getPropsValue (obj) {
  return obj.getDefaultPropsValue()
}

export default {
  install,
  createInstance,
  getComponents
}
