import { connectRouter } from 'connected-react-router';
import { all } from 'redux-saga/effects';


export const createRootReducer = history => ({
  router: connectRouter(history),
});

export const rootSaga = function*() {
  yield all([]);
};