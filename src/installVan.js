import Vue from 'vue'

import VanButton from './widgets/VanButton'

export default function install () {
  const ret = {}

  Vue.component(VanButton.info.id, VanButton.component)

  ret[VanButton.info.id] = VanButton

  return ret
}
