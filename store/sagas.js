import { all } from "redux-saga/effects";

import postSagas from "./posts/sagas";
import postsAppSagas from "./app/sagas";

export default function* rootSaga(services = {}) {
  yield all([postSagas(), postsAppSagas()]);
}
