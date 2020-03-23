import Vue from 'vue'
import { BehaviorSubject, Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

const store = {
  rootComp: null,
  selectedContainer: null
}

const component$ = new Subject()

component$.subscribe(function (action) {
  if (action.type === 'SET_ROOT_COMP') {
    store.rootComp = action.payload

    component$.next({
      type: 'CHANGE'
    })
  } else if (action.type === 'ADD') {
    store.selectedContainer.children.push(action.payload)

    component$.next({
      type: 'CHANGE'
    })
  } else if (action.type === 'DELETE') {
    for (let i = 0; i < store.rootComp.children.length; i++) {
      const comp = store.rootComp.children[i]

      if (comp._createdTime === action.payload._createdTime) {
        store.rootComp.children.splice(i, 1)
        component$.next({
          type: 'CHANGE'
        })
        break
      }
    }
  } else {
    // nothing
  }
})

component$.onChange = function onChange (type, cb) {
  component$.subscribe(function (action) {
    if (action.type === 'CHANGE') {
      cb(store.rootComp)
    }
  })
}

Vue.prototype.component$ = component$

const selectedContainer$ = new BehaviorSubject({ type: 'SET', payload: null })

selectedContainer$
  .pipe(filter(action => action.payload !== store.selectedContainer))
  .subscribe(function (action) {
    if (action.type === 'SET') {
      store.selectedContainer = action.payload
      selectedContainer$.next({ type: 'CHANGE', payload: null })
    } else {
    // nothing
    }
  })

selectedContainer$.onChange = function (cb) {
  selectedContainer$.subscribe(function (action) {
    if (action.type === 'CHANGE') {
      cb(store.selectedContainer)
    } else {
      // nothing
    }
  })
}

Vue.prototype.selectedContainer$ = selectedContainer$
