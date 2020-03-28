export function createCompInfo (info) {
  return {
    ...info,
    id: `${info.name}-${info.version}`
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

export function getTree (node) {
  const ret = node
  ret.propsKey = undefined
  const children = []

  if (node.children && node.children.length) {
    for (const child of node.children) {
      children.push(getTree(child))
    }
  } else {
    return ret
  }

  ret.children = children
  return ret
}
