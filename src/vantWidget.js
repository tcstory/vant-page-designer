import Vue from 'vue'

import VanButton from './widgets/VanButton'
import { freeze } from './utils'

const store = {}
let keys = []

function install () {
  const name = VanButton.component.name
  Vue.component(name, VanButton.component)

  store[name] = VanButton

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
  const comp = obj.component

  const propsValue = {}

  for (const key of Object.keys(comp.props)) {
    const value = comp.props[key]

    if (value.default) {
      propsValue[key] = value.default
    } else if (value.type instanceof Function) {
      if (value.type.name === 'String') {
        propsValue[key] = ''
      }
    } else if (value.type instanceof Array) {
      propsValue[key] = ''
    }
  }

  if (obj.getDefaultPropsValue) {
    Object.assign(propsValue, obj.getDefaultPropsValue())
  }

  return propsValue
}

export default {
  install,
  createInstance,
  getComponents
}
