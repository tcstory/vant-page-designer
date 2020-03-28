<template>
  <div class="file-loader">
    <input type="file"
           ref="reader"
           style="opacity: 0;position: absolute;"
           accept="application/json">
  </div>
</template>

<script>
import { filter } from 'rxjs/operators'

export default {
  name: 'FileReader',
  methods: {
    handleSelect () {
      const file = this.$refs.reader.files[0]
      var reader = new FileReader()
      reader.onload = (ev) => {
        this.system$.next({
          type: 'PARSE_TREE',
          payload: JSON.parse(ev.target.result)
        })
      }

      reader.readAsText(file)
    }
  },
  created () {
    this.system$.pipe(
      filter(action => action.type === 'IMPORT')
    ).subscribe((action) => {
      this.$refs.reader.click()
    })
  },
  mounted () {
    this.$refs.reader.addEventListener('change', this.handleSelect)
  },
  beforeDestroy () {
    this.$refs.reader.removeEventListener('change', this.handleSelect)
  }
}
</script>
