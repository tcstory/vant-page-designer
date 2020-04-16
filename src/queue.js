import { Observable, Subject } from 'rxjs'
import { multicast } from 'rxjs/operators'

const namespace = 'Aomi'
const replayEvent = 'reply'

export default class Queue {
  constructor () {
    this.timeoutNum = 3000
    this.retryNum = 2
    this.q = []
    this.receiver = null
    this.evPrefix = namespace
    this.event$ = null
    this.subscription = null

    const subject = new Subject()
    const source = new Observable(subscriber => {
      window.addEventListener('message', (ev) => {
        if (ev.data && ev.data.namespace === namespace) {
          if (ev.data.type === replayEvent) {
            clearTimeout(this.timeId)
            this.resetStatus()
            this.discardMsg()
            this.run()
          } else {
            subscriber.next(ev.data)

            if (ev.data.needReply) {
              ev.source.postMessage({
                namespace,
                type: replayEvent,
                payload: {
                  msgId: ev.data.msgId
                },
                needReply: false
              })
            }
          }
        }
      }, false)
    })
    this.event$ = source.pipe(multicast(subject))
    this.subscription = this.event$.connect()

    this.timeId = -1
  }

  run () {
    if (this.timeId === -1) {
      if (this.q.length !== 0) {
        const msg = this.q[0]

        this.receiver.postMessage(msg)
        this.timeId = setTimeout(() => {
          this.retryNum--

          if (this.retryNum > 0) {
            this.timeId = -1
            this.run()
          } else {
            this.resetStatus()
            this.discardMsg()
            this.run()
          }
        }, this.timeoutNum)
      }
    }
  }

  resetStatus () {
    this.timeId = -1
    this.retryNum = 2
  }

  discardMsg () {
    this.q.shift()
  }

  setReceiver (receiver) {
    this.receiver = receiver
  }

  sendMsg (evName, data, needReply = true) {
    const msg = {
      namespace,
      type: evName,
      payload: data,
      msgId: Date.now(),
      needReply
    }
    this.addToMsgQueue(msg)
    this.run()
  }

  subscribe (args) {
    this.event$.subscribe(args)
  }

  unsubscribe () {
    this.subscription.unsubscribe()
    this.event$ = null
    this.subscription = null
  }

  addToMsgQueue (msg) {
    this.q.push(msg)
  }
}
