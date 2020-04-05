import defaultWidget from './defaultWidget'
import vantWidget from './vantWidget'

export function createCompInfo (info) {
  return {
    ...info,
    id: `${info.name}-${info.version}`,
    parent: null
  }
}

export function freeze (info) {
  const ret = {
    objectId: Math.random(),
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

export function convertToJson (node) {
  const ret = {
    ...node
  }
  ret.propsKey = undefined
  ret.styleKey = undefined
  ret.parent = undefined
  const children = []

  if (ret.children && ret.children.length) {
    for (const child of ret.children) {
      children.push(convertToJson(child))
    }
  } else {
    return ret
  }

  ret.children = children
  return ret
}

export function convertToTree (node) {
  const ret = node
  !defaultWidget.createInstanceFromJson(ret) || vantWidget.createInstanceFromJson(ret)

  if (ret.children && ret.children.length) {
    for (const child of ret.children) {
      !defaultWidget.createInstanceFromJson(ret) || vantWidget.createInstanceFromJson(child)
    }
  }

  return ret
}
