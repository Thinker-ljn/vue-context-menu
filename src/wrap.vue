<template>
  <mc-contextmenu
    ref="menu"
    class="mc-contextmenu-wrap"
    :list="list" :e="e" :payload="payload" :show="show"
    @close="toggle(false)"
  >
  </mc-contextmenu>
</template>

<script>
export default {
  name: 'mc-contextmenu-wrap',
  data () {
    return {
      show: false,
      list: [],
      e: null,
      payload: null
    }
  },
  methods: {
    toggle (status) {
      this.show = status
    }
  },
  watch: {
    e (e) {
      this.$nextTick(() => {
        this.$refs.menu.initPosition({left: e.clientX, top: e.clientY})
      })
    }
  }
}
</script>
