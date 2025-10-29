import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

const logger = createLogger({
  collapsed: true,
})

const store = createStore(
  rootReducer,
  applyMiddleware(logger)
)

// Expose store to window for debugging (development only)
if (process.env.NODE_ENV === 'development') {
  window.__REDUX_STORE__ = store;
}

export default store
