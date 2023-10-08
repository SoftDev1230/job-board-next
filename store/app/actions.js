export const FETCH_LOCATION = "FETCH_LOCATION";
export const FETCH_LOCATION_SUCCEEDED = "FETCH_LOCATION_SUCCEEDED";
export const FETCH_LOCATION_FAILED = "FETCH_LOCATION_FAILED";
export const POPUP_SHOW_HIDE = "POPUP_SHOW_HIDE";
export const FETCH_USER_PROFILE_REQUEST = "FETCH_USER_PROFILE_REQUEST";
export const FETCH_USER_PROFILE_SUCCESS = "FETCH_USER_PROFILE_SUCCESS";
export const FETCH_USER_PROFILE_FAIL = "FETCH_USER_PROFILE_FAIL";
export const FETCH_SAVED_JOBS_REQUEST = "FETCH_SAVED_JOBS_REQUEST";
export const FETCH_SAVED_JOBS_SUCCESS = "FETCH_SAVED_JOBS_SUCCESS";
export const FETCH_SAVED_JOBS_FAIL = "FETCH_SAVED_JOBS_FAIL";
export const STORE_TOKEN = "STORE_TOKEN";
export const SAVE_JOB_REQUEST = "SAVE_JOB_REQUEST";
export const SAVE_JOB_SUCCESS = "SAVE_JOB_SUCCESS";
export const SAVE_JOB_FAIL = "SAVE_JOB_FAIL";
export const REMOVE_JOB_REQUEST = "REMOVE_JOB_REQUEST";
export const REMOVE_JOB_SUCCESS = "REMOVE_JOB_SUCCESS";
export const REMOVE_JOB_FAIL = "REMOVE_JOB_FAIL";
export const FETCH_APPLIED_JOBS_REQUEST = "FETCH_APPLIED_JOBS_REQUEST";
export const FETCH_APPLIED_JOBS_SUCCESS = "FETCH_APPLIED_JOBS_SUCCESS";
export const FETCH_APPLIED_JOBS_FAIL = "FETCH_APPLIED_JOBS_FAIL";
export const SIGN_OUT = "SIGN_OUT";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAIL = "SIGN_OUT_FAIL";
export const FETCH_POPULAR_JOBS_REQUEST = "FETCH_POPULAR_JOBS_REQUEST";
export const FETCH_POPULAR_JOBS_SUCCESS = "FETCH_POPULAR_JOBS_SUCCESS";
export const FETCH_POPULAR_JOBS_FAIL = "FETCH_POPULAR_JOBS_FAIL";
export const FETCH_SAVED_JOBS_LIST_REQUEST = "FETCH_SAVED_JOBS_LIST_REQUEST";
export const FETCH_SAVED_JOBS_LIST_SUCCESS = "FETCH_SAVED_JOBS_LIST_SUCCESS";
export const FETCH_SAVED_JOBS_LIST_FAIL = "FETCH_SAVED_JOBS_LIST_FAIL";
export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
export const FETCH_NOTIFICATIONS_FAIL = "FETCH_NOTIFICATIONS_FAIL";
export const MOBILE_SEARCH_SHOW = "MOBILE_SEARCH_SHOW";
export const MOBILE_SEARCH_DATA = "MOBILE_SEARCH_DATA";

export function fetchLocation(location) {
  return { type: FETCH_LOCATION_SUCCEEDED, payload: location };
}

export function showOrHidePopup(data) {
  return { type: POPUP_SHOW_HIDE, payload: data };
}

export function fetchUserProfile(token) {
  return { type: FETCH_USER_PROFILE_REQUEST, payload: token };
}

export function fetchSavedJobs(token, page) {
  return { type: FETCH_SAVED_JOBS_REQUEST, payload: {token: token, page: page} };
}

export function fetchSavedJobsList(token) {
  return { type: FETCH_SAVED_JOBS_LIST_REQUEST, payload: token };
}

export function stokeToken(token) {
  return { type: STORE_TOKEN, payload: token };
}

export function saveJob(token, jobid, job) {
  return { type: SAVE_JOB_REQUEST, payload: {token: token, jobid: jobid, job: job} };
}

export function removeJob(token, jobid) {
  return { type: REMOVE_JOB_REQUEST, payload: {token: token, jobid: jobid} };
}

export function fetchAppliedJobs(token) {
  return { type: FETCH_APPLIED_JOBS_REQUEST, payload: token };
}

export function fetchPopularJobs(location) {
  return { type: FETCH_POPULAR_JOBS_REQUEST, payload: location };
}

export function fetchNotifications(token) {
  return { type: FETCH_NOTIFICATIONS_REQUEST, payload: token };
}

export function signOut(data) {
  return { type: SIGN_OUT, payload: data };
}

export function showOrHideMobileSearch(data) {
  return { type: MOBILE_SEARCH_SHOW, payload: data };
}

export function storeMobileSearchData(data) {
  return { type: MOBILE_SEARCH_DATA, payload: data };
}
