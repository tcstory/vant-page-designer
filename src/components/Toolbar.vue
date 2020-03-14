<template>
  <div class="tool bg-gray p-2">
    <div class="card c-hand mr-2" v-for="comp in componentList" :key="comp.id">
      <div class="card-title h6 text-center">
        {{ comp.label }}
      </div>
      <div class="card-image" :style="{backgroundImage: `url(${comp.coverImg})`}"></div>
      <div class="card-footer p-1">
        <div class="btn-group btn-group-block">
          <button class="btn btn-primary btn-sm" @click="handleAdd(comp)">
            <i class="icon icon-plus"></i>
          </button>
          <button class="btn btn-sm">详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  data () {
    return {
      componentList: []
    }
  },
  methods: {
    handleAdd (comp) {
      this.component$.next({
        type: 'ADD',
        payload: comp
      })
    }
  },
  created () {
    this.componentList = this.getComponents()
  }
}
</script>

<style scoped lang="scss">
.card {
  cursor: pointer;
  width: 100px;
  font-size: 14px;
  display: inline-block;

  .card-image {
    padding-top: 0;
    height: 64px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    margin: 0 auto;
  }
}

.tool {
  height: 100%;
  width: 240px;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
