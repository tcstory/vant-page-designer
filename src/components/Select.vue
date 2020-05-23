<template>
  <div class="select">
<!--    <div class="mask" @click="onClick">-->
<!--    </div>-->
    <input type="text" :value="myValue" ref="input"  @blur="onBlur" @input="onInput" @focus="onFocus">

    <div class="options" v-if="show">
      <div class="option" v-for="op in options" :key="op.key" @click="onOptionClick(op)">{{op.key}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: {
        type: String,
        default () {
          return ''
        }
      }
    }
  },
  data () {
    return {
      myValue: this.value,
      show: false
    }
  },
  watch: {
    value (val) {
      this.myValue = val
    }
  },
  methods: {
    onOptionClick (op) {
      this.myValue = op.value
      this.show = false
      this.$emit('input', {
        target: {
          value: this.myValue
        }
      })
    },
    onClick () {
      this.show = true
      this.$refs.input.focus()
    },
    onInput (ev) {
      this.myValue = ev.target.value
      this.$emit('input', ev)
    },
    onFocus () {
      this.show = true
    },
    onBlur () {
      setTimeout(() => {
        this.show = false
      }, 150)
    }
  }
}
</script>

<style scoped lang="scss">
  .select {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .mask {
    width: 100%;
    height: 100%;
  }

  .select input {
    width: 100%;
    height: 100%;
    padding: 0 6px;
    /*pointer-events: none;*/
  }

  .options {
    position: absolute;
    background-color: #303030;
    left: 0;
    right: 0;
    border-top: 1px solid #2196f3;
    z-index: 10;
  }

  .option {
    height: 22px;
    padding: 2px 6px;
    cursor: pointer;

    &:hover {
      background-color: rgba(34, 152, 242, 0.24);
    }
  }
</style>
