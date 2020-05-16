<template>
  <div class="select">
    <div class="mask" @click="show=true"><input type="text" :value="myValue"></div>
    <div class="options" v-if="show">
      <div class="option" v-for="op in options" :key="op" @click="onOptionClick(op)">{{op}}</div>
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
      this.myValue = op
      this.show = false
      this.$emit('input', {
        target: {
          value: this.myValue
        }
      })
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
    background-color: rgba(255, 255, 255, 0.08);
    left: 0;
    right: 0;
    border-top: 1px solid #2196f3;
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
