<template>
  <div class="box-model">
    <p class="title-bar">
      <span class="grey--text">盒模型</span>
    </p>
    <div class="margin-border">
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
    <div class="input-group" v-if="node.parent">
      <v-text-field
        outlined
        dense
        autocomplete="off"
        v-for="keyVal of node.styleKey"
        :key="keyVal.key"
        :label="keyVal.label"
        :value="node.styleValue[keyVal.key]"
        v-on:input="onStyleInput($event, keyVal)"
      ></v-text-field>
    </div>
  </div>
</template>

<script>

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
    onStyleInput (value, keyVal) {
      // todo 判断设置的值是合法的, 再把事件广播出去
      this.node$.next({
        type: 'UPDATE_STYLE_VALUE.notify',
        payload: {
          objectId: this.node.objectId,
          key: keyVal.key,
          value
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
  .title-bar {
    font-size: 14px;
    height: 24px;
    text-align: center;
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

    margin: 0 auto 16px;
    width: 180px;
    height: 120px;
    background-color: #fdffdf;
  }
</style>
