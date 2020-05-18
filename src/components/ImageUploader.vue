<template>
  <div class="image-loader">
    <div class="form-row">
      <span class="form-label">{{keyVal.label}}</span>
      <div class="form-input-wrap">
        <input class="form-input" type="text" :id="objectId" :value="src"
               @focus="onFocus"
               @blur="onBlur"
               v-on:input="onInput">
        <div class="progress-bar">
          <v-progress-linear
            rounded
            v-model="progress"
            color="primary"
          ></v-progress-linear>
        </div>
      </div>
      <v-btn color="primary upload-btn" :class="{'is-focused': isFocused}" fab dark x-small @click="onClick">
        <v-icon>cloud_upload</v-icon>
      </v-btn>

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
      progress: 0,
      isFocused: false
    }
  },
  methods: {
    onFocus () {
      console.log('onFocus??')
      this.isFocused = true
    },
    onBlur () {
      console.log('onBlur??')
      this.isFocused = false
    },
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
    width: 100%;
  }

  .form-row {
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    height: 100%;
  }

  .form-input-wrap {
    flex-grow: 1;
    position: relative;
    height: 32px;
  }

  .upload-btn {
    /*flex-shrink: 0;*/
    /*margin-left: 16px;*/
    position: absolute;
    right: 0;
    transition: opacity 250ms ease-out;

    &.is-focused {
      opacity: 0.3;
      pointer-events: none;
    }
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
