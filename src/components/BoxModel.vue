<template>
  <div class="box-model">
    <p @click="handleClick" class="c-hand bg-secondary title-bar">
      盒模型
      <i class="icon icon-arrow-up" v-if="show"></i>
      <i class="icon icon-arrow-down" v-if="!show"></i>
    </p>
    <div class="margin-border" v-if="show">
      <span class="dot dot-top">{{fullMargin[0]}}</span>
      <span class="dot dot-right">{{fullMargin[1]}}</span>
      <span class="dot dot-bottom">{{fullMargin[2]}}</span>
      <span class="dot dot-left">{{fullMargin[3]}}</span>
      <div class="padding-border">
        <span class="dot dot-top">{{fullPadding[0]}}</span>
        <span class="dot dot-right">{{fullPadding[1]}}</span>
        <span class="dot dot-bottom">{{fullPadding[2]}}</span>
        <span class="dot dot-left">{{fullPadding[3]}}</span>
        <div class="content-border">{{fullContent}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { filter } from 'rxjs/operators'

export default {
  name: 'BoxModel',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: true
    }
  },
  computed: {
    fullContent () {
      const styleValue = this.node.styleValue
      if (styleValue.width && styleValue.height) {
        return ''
      } else {
        return 'auto * auto'
      }
    },
    fullPadding () {
      return ['?', '?', '?', '?']
    },
    fullMargin () {
      return ['?', '?', '?', '?']
    }
  },
  methods: {
    handleClick () {
      this.show = !this.show
    }
  },
  created () {
    this.node$.pipe(
      filter(action => action.type === 'UPDATE_STYLE_VALUE')
    ).subscribe((action) => {
      console.log('action', action)
    })
  }
}
</script>

<style scoped lang="scss">
  .title-bar {
    font-size: 14px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    position: relative;
  }

  .dot {
    position: absolute;
  }

  .dot-top {
    top: 0
  }

  .dot-right {
    right: 0;
  }

  .dot-bottom {
    bottom: 0;
  }

  .dot-left {
    left: 0;
  }

  .content-border {
    @extend .box;

    width: 100px;
    height: 40px;
    background-color: #cff0fb;
  }

  .padding-border {
    @extend .box;

    width: 140px;
    height: 80px;
    background-color: #e3dcff;
  }

  .margin-border {
    @extend .box;

    margin: 0 auto;
    width: 180px;
    height: 120px;
    background-color: #fdffdf;
  }
</style>
