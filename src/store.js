// STORE
import { createStore } from 'redux'

const initialState = {
  currentValue: 0,
  futureValues: [],
  prevValues: []
}

// ACTIONS
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const UNDO = 'UNDO'
export const REDO = 'REDO'

// REDUCER
function counter( state = initialState, action) {
  switch (action.type) {
    case INCREMENT: 
    return { 
      currentValue: state.currentValue + action.amount,
      futureValues: [], 
      prevValues: [ state.currentValue, ...state.prevValues ]
    }
    case DECREMENT: 
    return { 
      currentValue: state.currentValue - action.amount,
      futureValues: [], 
      prevValues: [ state.currentValue, ...state.prevValues ]
    }
    case UNDO: 
    return {
      currentValue: state.prevValues[0],
      futureValues: [ state.currentValue, ...state.futureValues ],
      prevValues: state.prevValues.slice(1)
    }
    case REDO:
      return {
        currentValue: state.futureValues[0],
        futureValues: state.futureValues.slice(1),
        prevValues: [ state.currentValue, ...state.prevValues ]
      }
    default:
    return state
  }
}


export default (createStore(counter))