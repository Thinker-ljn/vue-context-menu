<template>
  <ul class="menu" :style="style" :class="{show: show}">
    <li v-for="(li, index) in menu" @click="clickLi(li, index)"
      @mouseover="mouseover(index)"
     :class="[li.status, {'division': li.split}]">
      <span>{{li.name}}</span>
      <mc-contextmenu v-if="li.children && li.children.length" @close="close" :show="showChild === index"
       :list="li.children" :e="e" :payload="payload" :deep="deep + 1"></mc-contextmenu>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'mc-contextmenu',
  data () {
    return {
      style: {
        left: '100%',
        top: 0,
        boxShadow: ''
      },
      showChild: -1
    }
  },
  props: {
    show: {
      default: false
    },
    deep: {
      default: 0
    },
    list: {
      default () {
        return []
      }
    },
    e: {
      default: null
    },
    payload: {
      default: null
    },
    width: {
      default: 100
    },
    itemRect: {
      default: null
    }
  },
  computed: {
    menu () {
      return this.list.reduce((p, group, index) => {
        if (Array.isArray(group)) {
          p = p.concat(group)
        } else {
          p.push(group)
        }
        if (index < this.list.length - 1 && p[p.length - 1]) {
          p[p.length - 1].split = true
        }
        return p
      }, [])
    },
    coords () {
      return {
        x: this.e.clientX,
        y: this.e.clientY
      }
    }
  },
  watch: {
    show (status) {
      if (!this.status) this.showChild = -1
    }
  },
  methods: {
    clickLi (li, index) {
      if (li && typeof li.func === 'function' && li.status !== 'disabled') {
        li.func({
          coords: this.coords,
          e: this.e,
          payload: this.payload,
          index: index,
          item: li
        })
        this.close()
      }
    },
    close () {
      this.showChild = {}
      this.$emit('close')
    },
    mouseover (index) {
      this.showChild = index
    },
    initPosition (pos) {
      this.inDOM(this.$el, (el) => {
        let rect = el.getBoundingClientRect()
        let bodyRect = document.body.getBoundingClientRect()

        let left = pos.left + this.deep * rect.width
        let top = pos.top + this.deep * rect.height

        let hOverflow = left + rect.width > bodyRect.width
        let vOverflow = top + rect.height > bodyRect.height

        let offsetLeft = (this.deep ? 2 : 1) * rect.width
        left = this.deep ? rect.width : pos.left
        top = this.deep ? 0 : pos.top

        if (hOverflow) {
          left -= offsetLeft
        }

        if (vOverflow) {
          top -= rect.height
        }

        this.style = {
          position: this.deep ? 'absolute' : 'fixed',
          left: left + 'px',
          top: top + 'px'
        }

        if (this.$children) {
          this.$children.forEach(c => {
            c.initPosition(pos)
          })
        }
      })
    },
    inDOM (target, cb) {
      const { display, visibility } = target.style
      target.style.display = 'inline-block'
      target.style.visibility = 'visible'

      cb(target)

      target.style.display = display
      target.style.visibility = visibility
    }
  }
}
</script>

<style scoped>
  @keyframes show {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .menu
  {
    background-color: #444;
    color: #cccccc;
    position: fixed;
    list-style-type: none;

    z-index: 99999;
    min-width: 100px;

    margin: 0;
    padding: 0;

    font-size: 12px;
    user-select: none;

    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.5);

    opacity: 0;
    visibility: hidden;
  }

  .menu.show
  {
    animation: show .5s;
    opacity: 1;
    visibility: visible;
  }
  .menu li
  {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding-left: 8px;
    padding-right: 18px;
    cursor: pointer;
  }

  .menu li:hover{
    color: #eeeeee;
    background-color: #666666;
  }

  .menu li:active{
    background-color: #5c5c5c;
  }

  .division
  {
    border-bottom: 1px solid #333333;
  }

  .warning
  {
    color: #ff6666;
  }

  .warning:hover
  {
    color: #ff6666;
    background-color: #666666;
  }

  .disabled
  {
    cursor: not-allowed;
  }
  .disabled:hover
  {
    background-color: inherit;
  }
</style>
