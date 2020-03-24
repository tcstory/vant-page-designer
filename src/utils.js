export function createCompInfo (info) {
  return {
    ...info,
    id: `${info.name}-${info.version}`,
    vm: null
  }
}
