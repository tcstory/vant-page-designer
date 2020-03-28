import axios from 'axios'
import { Subject } from 'rxjs'

export function upload (file) {
  var data = new FormData()
  data.append('file', file)

  const observable = new Subject()

  const promise = axios.post('//www.mocky.io/v2/5e7f24252f00008700bac280', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: function (e) {
      var percentage = Math.round((e.loaded * 100) / e.total) || 0
      observable.next(percentage)
      if (e.loaded === e.total) {
        observable.complete()
      }
    }
  }).then(function (resp) {
    return resp.data
  })

  return {
    observable: observable,
    then: promise.then.bind(promise)
  }
}
