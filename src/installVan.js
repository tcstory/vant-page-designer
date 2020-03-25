import Vue from 'vue'

import VanButton from './widgets/VanButton'

export default function install () {
  const ret = {}

  const name = VanButton.component.name
  Vue.component(name, VanButton.component)

  ret[name] = VanButton

  return ret
}
