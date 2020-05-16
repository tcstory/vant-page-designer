import { camelCase, uniqueId } from 'loadsh'

export function createCompInfo (info) {
  return {
    ...info,
    id: `${info.name}`,
    parent: null
  }
}

export function freeze (info) {
  const ret = {
    objectId: uniqueId('unique_'),
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

export function outputEntryFile (node) {
  const nodeMap = {}

  const loop = function (node, head, content) {
    if (/^van/.test(node.name)) {
      if (!nodeMap[node.name]) {
        nodeMap[node.name] = true
        const name = /^van-(.*)$/.exec(node.name)[1]
        head.push(`import { ${camelCase(name)} as ${node.name} } from 'vant';`)
        content.push(`Vue.component('${node.name}', ${camelCase(node.name)});`)
      }
    } else {
      if (!nodeMap[node.name]) {
        nodeMap[node.name] = true
        head.push(`import ${camelCase(node.name)} from "@/widgets/${node.name}/index.vue";`)
        content.push(`Vue.component('${node.name}', ${camelCase(node.name)});`)
      }
    }

    if (node.children) {
      for (const child of node.children) {
        loop(child, head, content)
      }
    }

    return { head, content }
  }

  const { head, content } = loop(node, ['import Vue from "Vue";'], [])
  let output = ''

  output += head.join('\n')
  output += '\n\n'
  output += content.join('\n')
  output += '\n\n'
  output += `const node = ${JSON.stringify(node)}`

  return output
}
