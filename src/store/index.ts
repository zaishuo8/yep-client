import {createStore, combineReducers} from 'redux';
import {ossReducer} from './oss/reducers';

const rootReducer = combineReducers({
  oss: ossReducer,
});

const store = createStore(rootReducer);

export type AppStateInterface = ReturnType<typeof rootReducer>;

export default store;
