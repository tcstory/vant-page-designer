<template>
  <div class="video-responsive">
    <p>video</p>
<!--    <iframe :src="videoInfo.src"-->
<!--            :scrolling="videoInfo.scrolling"-->
<!--            :border="videoInfo.border"-->
<!--            :frameborder="videoInfo.frameborder"-->
<!--            :framespacing="videoInfo.framespacing"-->
<!--            :allowfullscreen="videoInfo.allowfullscreen"></iframe>-->
<!--    <iframe src="//player.bilibili.com/player.html?aid=95898934&cid=163661726&page=1"-->
<!--            scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>-->
  </div>
</template>

<script>
import baseComp from '../mixin/baseComp'

const compInfo = {
  id: '',
  version: 'latest',
  name: 'Video',
  label: '视频',
  coverImg: require('../assets/bilibili.svg')
}

compInfo.id = `${compInfo.name}-${compInfo.version}`

export default {
  name: compInfo.id,
  mixins: [baseComp],
  compInfo,
  props: {
    videoInfo: {
      type: Object,
      default () {
        return {
          src: '',
          scrolling: 'no',
          border: '0',
          frameborder: 'no',
          framespacing: '0',
          allowfullscreen: 'false'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
