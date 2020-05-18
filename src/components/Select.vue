<template>
  <div class="select">
    <div class="mask" @click="onClick">
      <input type="text" :value="myValue" ref="input"  @blur="onBlur">
    </div>
    <div class="options" v-if="show">
      <div class="option" v-for="op in options" :key="op.key" @click="onOptionClick(op)">{{op.value}}</div>
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
    onBlur () {
      setTimeout(() => {
        this.show = false
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
  .select {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .mask {
    width: 100%;
    height: 100%;
  }

  .select input {
    width: 100%;
    height: 100%;
    padding: 0 6px;
    pointer-events: none;
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
