import Contextmenu from './template'
import ContextmenuWrap from './wrap'

const singleton = (Constructor) => {
  let instance
  return function () {
    return instance || (instance = new Constructor({el: document.createElement('div')}))
  }
}

const install = (Vue) => {
  Vue.component(Contextmenu.name, Contextmenu)

  let WrapConstructor = Vue.component(ContextmenuWrap.name, ContextmenuWrap)

  let WrapInstance = singleton(WrapConstructor)()

  document.body.appendChild(WrapInstance.$el)

  document.addEventListener('click', (e) => {
    if (WrapInstance && WrapInstance.$el.contains(e.target)) {
      return false
    }
    WrapInstance.toggle(false)
  })

  Vue.directive('menu', (el, binding, vnode) => {
    if (!binding.value) return false

    WrapInstance.toggle(false)
    el.oncontextmenu = (e) => {
      let list = binding.value
      let payload = {}
      if (binding.modifiers.p) {
        [list, payload] = binding.value
      }

      WrapInstance.list = list
      WrapInstance.payload = payload
      WrapInstance.e = e

      WrapInstance.toggle(false)
      Vue.nextTick(() => {
        WrapInstance.toggle(true)
      })

      e.stopPropagation()
      e.preventDefault()
      return false
    }
  })
}

export default {
  install
}
