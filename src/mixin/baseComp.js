export default {
  data () {
    return {
      _createdTime: 0
    }
  },
  created () {
    this._createdTime = Date.now()
  }
}
