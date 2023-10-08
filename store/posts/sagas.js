import { takeLatest, fork, call, put } from "redux-saga/effects";

// import api from "services/api";
import {
  FETCH_JOBS,
  FETCH_JOBS_SUCCEEDED,
  FETCH_JOBS_FAIL,
  FETCH_JOB,
  FETCH_JOB_SUCCESS,
  FETCH_JOB_FAIL,
  FETCH_SIMILAR_JOBS,
  FETCH_SIMILAR_JOBS_SUCCESS,
  FETCH_SIMILAR_JOBS_FAIL,
  FETCH_COMPANY_HAS_JOBS,
  FETCH_COMPANY_HAS_JOBS_SUCCESS,
  FETCH_COMPANY_HAS_JOBS_FAIL,
  FETCH_MORE_JOBS,
  FETCH_MORE_JOBS_SUCCEEDED,
  FETCH_MORE_JOBS_FAIL,
} from "store/posts/actions";

function* fetchPosts({ payload }) {
  try {
    const posts = yield call(api.fetchAllPosts, payload);
  yield put({ type: FETCH_JOBS_SUCCEEDED, payload: posts.data.value, count: posts.data['@odata.count'], facets: posts.data['@search.facets']});
  }
  catch(error) {
    yield put({ type: FETCH_JOBS_FAIL, error })
  }
}

function* fetchMorePosts({ payload }) {
  try {
    const posts = yield call(api.fetchMorePosts, payload);
  yield put({ type: FETCH_MORE_JOBS_SUCCEEDED, payload: posts.data.value, count: posts.data['@odata.count'], facets: posts.data['@search.facets']});
  }
  catch(error) {
    yield put({ type: FETCH_MORE_JOBS_FAIL, error })
  }
}

function* fetchPost({ payload }) {
  try {
    const post = yield call(api.fetchPost, payload);
    yield put({ type: FETCH_JOB_SUCCESS, payload: post.data });
  }
  catch(error) {
    yield put({ type: FETCH_JOB_FAIL, error })
  }
}

function* fetchSimilarJobs({ payload }) {
  try {
    const post = yield call(api.fetchSimilarJobs, payload);
    yield put({ type: FETCH_SIMILAR_JOBS_SUCCESS, payload: post.data.value });
  }
  catch(error) {
    yield put({ type: FETCH_SIMILAR_JOBS_FAIL, error })
  }
}

function* fetchCompanyHasMoreJobs({ payload }) {
  try {
    const post = yield call(api.checkCompanyJobs, payload);
    yield put({ type: FETCH_COMPANY_HAS_JOBS_SUCCESS, payload: post.data["@odata.count"] });
  }
  catch(error) {
    yield put({ type: FETCH_COMPANY_HAS_JOBS_FAIL, error })
  }
}

function* watchFetchPosts() {
  yield takeLatest(FETCH_JOBS, fetchPosts);
}

function* watchFetchMorePosts() {
  yield takeLatest(FETCH_MORE_JOBS, fetchMorePosts);
}

function* watchFetchPost() {
  yield takeLatest(FETCH_JOB, fetchPost);
}

function* watchFetchSimiarJobs() {
  yield takeLatest(FETCH_SIMILAR_JOBS, fetchSimilarJobs);
}

function* watchFetchCompanyHasMoreJobs() {
  yield takeLatest(FETCH_COMPANY_HAS_JOBS, fetchCompanyHasMoreJobs);
}

export default function* postsSagas() {
  yield fork(watchFetchPosts);
  yield fork(watchFetchMorePosts);
  yield fork(watchFetchPost);
  yield fork(watchFetchSimiarJobs);
  yield fork(watchFetchCompanyHasMoreJobs);
}
