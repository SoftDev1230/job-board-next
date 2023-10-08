import { takeLatest, fork, call, put } from "redux-saga/effects";
import { clearToken } from 'store/localStorage';
import Cookies from 'js-cookie'

// import api from "services/api";
import {
  FETCH_USER_PROFILE_REQUEST,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAIL,
  FETCH_SAVED_JOBS_REQUEST,
  FETCH_SAVED_JOBS_SUCCESS,
  FETCH_SAVED_JOBS_FAIL,
  SAVE_JOB_REQUEST,
  SAVE_JOB_SUCCESS,
  SAVE_JOB_FAIL,
  REMOVE_JOB_REQUEST,
  REMOVE_JOB_SUCCESS,
  REMOVE_JOB_FAIL,
  FETCH_APPLIED_JOBS_REQUEST,
  FETCH_APPLIED_JOBS_SUCCESS,
  FETCH_APPLIED_JOBS_FAIL,
  SIGN_OUT,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAIL,
  FETCH_POPULAR_JOBS_REQUEST,
  FETCH_POPULAR_JOBS_SUCCESS,
  FETCH_POPULAR_JOBS_FAIL,
  FETCH_SAVED_JOBS_LIST_REQUEST,
  FETCH_SAVED_JOBS_LIST_SUCCESS,
  FETCH_SAVED_JOBS_LIST_FAIL,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAIL,
} from "store/app/actions";

function* fetchUserProfile({ payload }) {
  try {
    const post = yield call(api.fetchUserProfile, payload);
    yield put({ type: FETCH_USER_PROFILE_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: FETCH_USER_PROFILE_FAIL, error })
  }
}

function* watchFetchUserProfile() {
  yield takeLatest(FETCH_USER_PROFILE_REQUEST, fetchUserProfile);
}

function* fetchSavedJobs({ payload }) {
  try {
    const post = yield call(api.fetchSavedJobs, payload);
    yield put({ type: FETCH_SAVED_JOBS_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: FETCH_SAVED_JOBS_FAIL, error })
  }
}

function* watchFetchSavedJobs() {
  yield takeLatest(FETCH_SAVED_JOBS_REQUEST, fetchSavedJobs);
}

function* fetchPopluarJobs({ payload }) {
  try {
    const post = yield call(api.getPopluarJobs, payload);
    yield put({ type: FETCH_POPULAR_JOBS_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: FETCH_POPULAR_JOBS_FAIL, error })
  }
}

function* watchFetchPopularJobs() {
  yield takeLatest(FETCH_POPULAR_JOBS_REQUEST, fetchPopluarJobs);
}

function* fetchSaveJob({ payload }) {
  try {
    const post = yield call(api.saveJob, payload);
    yield put({ type: SAVE_JOB_SUCCESS, payload: payload.job });
  }
  catch(error) {
    yield put({ type: SAVE_JOB_FAIL, error })
  }
}

function* watchSaveJob() {
  yield takeLatest(SAVE_JOB_REQUEST, fetchSaveJob);
}

function* fetchRemoveJob({ payload }) {
  try {
    const post = yield call(api.removeJob, payload);
    yield put({ type: REMOVE_JOB_SUCCESS, payload: payload.jobid });
  }
  catch(error) {
    yield put({ type: REMOVE_JOB_FAIL, error })
  }
}

function* watchRemoveJob() {
  yield takeLatest(REMOVE_JOB_REQUEST, fetchRemoveJob);
}

function* fetchAppliedJobs({ payload }) {
  try {
    const post = yield call(api.fetchAppliedJobs, payload);
    yield put({ type: FETCH_APPLIED_JOBS_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: FETCH_APPLIED_JOBS_FAIL, error })
  }
}

function* watchFetchAppliedJobs() {
  yield takeLatest(FETCH_APPLIED_JOBS_REQUEST, fetchAppliedJobs);
}

function* userSignOut({ payload }) {
  try {
    clearToken();
    Cookies.remove('token'); 
    Cookies.remove('filters'); 
    const post = yield call(api.signOutUser, payload);
    yield put({ type: SIGN_OUT_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: SIGN_OUT_FAIL, error })
  }
}

function* watchSignOutUser() {
  yield takeLatest(SIGN_OUT, userSignOut);
}

function* fetchSavedJobsList({ payload }) {
  try {
    const post = yield call(api.fetchSavedJobsList, payload);
    yield put({ type: FETCH_SAVED_JOBS_LIST_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: FETCH_SAVED_JOBS_LIST_FAIL, error })
  }
}

function* watchFetchSavedJobsList() {
  yield takeLatest(FETCH_SAVED_JOBS_LIST_REQUEST, fetchSavedJobsList);
}

function* fetchNotifications({ payload }) {
  try {
    const post = yield call(api.fetchNotifications, payload);
    yield put({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: post.data.Data });
  }
  catch(error) {
    yield put({ type: FETCH_NOTIFICATIONS_FAIL, error })
  }
}

function* watchFetchNotifications() {
  yield takeLatest(FETCH_NOTIFICATIONS_REQUEST, fetchNotifications);
}

export default function* postsAppSagas() {
  yield fork(watchFetchUserProfile);
  yield fork(watchFetchSavedJobs);
  yield fork(watchSaveJob);
  yield fork(watchRemoveJob);
  yield fork(watchFetchAppliedJobs);
  yield fork(watchSignOutUser);
  yield fork(watchFetchPopularJobs);
  yield fork(watchFetchSavedJobsList);
  yield fork(watchFetchNotifications);
}
