<template>
  <div class="image-loader">
    <div class="input-group">
      <span class="input-group-addon addon-sm">{{keyVal.label}}</span>
      <input class="form-input input-sm" type="text" :id="objectId" :value="src"
             v-on:input="onInput">
      <label class="upload-btn btn btn-action btn-sm" :for="'upload' + objectId">
        <i class="icon icon-upload"></i>
      </label>
    </div>
    <div class="progress-bar">
      <span class="text">上传进度</span>
      <progress class="progress" :value="progress" max="100"></progress>
    </div>
    <input type="file"
           :id="'upload' + objectId"
           ref="uploader"
           style="opacity: 0;position: absolute;"
           accept="image/*">
  </div>
</template>

<script>
import 'vant/lib/progress/style'
import { upload } from '../services/upload'
export default {
  name: 'ImageUploader',
  components: {
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
      progress: 0
    }
  },
  methods: {
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
            console.log('进度', val)
            this.progress = val
          }
        })

        this.progress = 0
        ret.then((res) => {
          console.log('res', res, typeof res)
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
  }

  .row {
    display: flex;
  }

  .upload-btn {
    flex-shrink: 0;
    margin-left: 16px;
  }

  .progress-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text {
    font-size: 12px;
    flex-shrink: 0;
    margin-right: 12px;
  }
</style>
