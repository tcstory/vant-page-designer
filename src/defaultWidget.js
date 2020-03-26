import Vue from 'vue'
import Container from './widgets/Container.js'
import { freeze } from './utils'

const store = {
  [Container.info.id]: Container
}

let keys = []

function install () {
  keys = Object.keys(store)

  for (const key of keys) {
    Vue.component(key, store[key].component)
  }
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