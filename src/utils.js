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
