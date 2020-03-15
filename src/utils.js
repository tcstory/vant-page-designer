export function createCompInfo (info) {
  return {
    ...info,
    id: `${info.name}-${info.version}`,
    vm: null
  }
}

export function freeze (obj) {
  for (const key of obj.keys()) {
    Object.defineProperty(obj, key, {
      configurable: false,
      enumerable: true,
      writable: true
    })
  }

  return obj
}
