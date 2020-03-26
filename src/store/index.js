import Vue from 'vue'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

const store = {
  rootComp: null,
  selectedNode: null
}

const node$ = new Subject()

node$.subscribe(function (action) {
  if (action.type === 'ADD') {
    if (store.rootComp === null) {
      store.rootComp = action.payload
    } else {
      if (store.selectedNode.children) {
        store.selectedNode.children.push(action.payload)
      }
    }

    node$.next({
      type: 'CHANGE'
    })
  } else if (action.type === 'DELETE') {
    for (let i = 0; i < store.rootComp.children.length; i++) {
      const comp = store.rootComp.children[i]

      if (comp._createdTime === action.payload._createdTime) {
        store.rootComp.children.splice(i, 1)
        node$.next({
          type: 'CHANGE'
        })
        break
      }
    }
  } else {
    // nothing
  }
})

node$.onChange = function onChange (type, cb) {
  node$.subscribe(function (action) {
    if (action.type === 'CHANGE') {
      cb(store.rootComp)
    }
  })
}

Vue.prototype.node$ = node$

const selectedNode$ = new Subject()

selectedNode$
  .pipe(filter(action => action.payload !== store.selectedNode$))
  .subscribe(function (action) {
    if (action.type === 'SET') {
      store.selectedNode = action.payload
      selectedNode$.next({ type: 'CHANGE', payload: store.selectedNode })
    } else {
      // nothing
    }
  })

Vue.prototype.selectedNode$ = selectedNode$
