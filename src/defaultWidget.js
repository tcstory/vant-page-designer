import Vue from 'vue'
import Container from './widgets/Container/entry'
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
  const obj = freeze(store[key].info)
  obj.styleValue = store[key].getStyleValue()
  obj.styleKey = store[key].getStyleKey()

  return obj
}

function getComponents () {
  return keys.map(function (key) {
    return freeze({
      ...store[key].info
    })
  })
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

export default {
  install,
  createInstance,
  createInstanceFromJson,
  getComponents
}
