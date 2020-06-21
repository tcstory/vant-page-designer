<template>
  <div class="image-loader">
    <div>
      <div>
        <Input type="text" :id="objectId" :value="src"
               v-on:on-change="onInput" />
        <Progress :percent="progress" />
      </div>
      <Button :loading="uploading" shape="circle"
              class="upload-btn"
              @click="onClick"
              icon="ios-cloud-upload"></Button>

    </div>
    <input type="file"
           :id="'upload' + objectId"
           ref="uploader"
           style="opacity: 0;position: absolute; pointer-events: none;"
           accept="image/*">
  </div>
</template>

<script>
import { Input, Button, Progress } from 'view-design'

import 'vant/lib/progress/style'
import { upload } from '../services/upload'
export default {
  name: 'ImageUploader',
  components: {
    Input,
    Button,
    Progress
  },
  props: {
    keyVal: {
      type: Object,
      required: true
    },
    src: {
      type: String,
      default: ''
    },
    objectId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      progress: 0,
      uploading: false,
    }
  },
  methods: {
    onClick () {
      this.$refs.uploader.click()
    },
    onInput (ev) {
      this.$emit('image-src-change', ev)
    },
    handleSelect () {
      const file = this.$refs.uploader.files[0]

      if (file) {
        const ret = upload(file)
        const observable = ret.observable

        observable.subscribe({
          next: (val) => {
            this.progress = val
          }
        })

        this.progress = 0
        ret.then((res) => {
          this.$emit('image-src-change', {
            target: {
              value: res.url
            }
          })
        })
      }
    }
  },
  mounted () {
    this.$refs.uploader.addEventListener('change', this.handleSelect)
  },
  beforeDestroy () {
    this.$refs.uploader.removeEventListener('change', this.handleSelect)
  }
}
</script>

<style scoped lang="scss">
  .image-loader {
    position: relative;
    width: 100%;
  }

  .upload-btn {
    float: right;
    margin-top: 4px;
  }

  .progress-bar {
    position: absolute;
    width: 100%;
    height: 4px;
    margin-top: 2px;
    left: 0;
    right: 0;
  }

  .text {
    font-size: 12px;
    flex-shrink: 0;
    margin-right: 12px;
  }
</style>
