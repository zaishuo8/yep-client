import {createStore, combineReducers} from 'redux';
import {ossReducer} from './oss/reducers';
import {userReducer} from './user/reducers';

const rootReducer = combineReducers({
  oss: ossReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

export type AppStateInterface = ReturnType<typeof rootReducer>;

export default store;
