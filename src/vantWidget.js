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
  return freeze(store[key].info)
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
  getComponents
}
