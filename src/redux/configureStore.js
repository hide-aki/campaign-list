import { createStore, compose } from 'redux';
import reducer from './reducers';
import initialState from './initialState';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(reducer, initialState, composeEnhancers());
  return { store };
};
