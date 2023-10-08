export const FETCH_JOBS = "FETCH_JOBS";
export const FETCH_JOBS_SUCCEEDED = "FETCH_JOBS_SUCCEEDED";
export const FETCH_JOBS_FAIL = "FETCH_JOBS_FAIL";
export const FETCH_JOB = "FETCH_JOB";
export const FETCH_JOB_SUCCESS = "FETCH_JOB_SUCCESS";
export const FETCH_JOB_FAIL = "FETCH_JOB_FAIL";
export const FETCH_SIMILAR_JOBS = "FETCH_SIMILAR_JOBS";
export const FETCH_SIMILAR_JOBS_SUCCESS = "FETCH_SIMILAR_JOBS_SUCCESS";
export const FETCH_SIMILAR_JOBS_FAIL = "FETCH_SIMILAR_JOBS_FAIL";
export const CHANGE_SORT_BY = "CHANGE_SORT_BY";
export const CHANGE_JOB_TYPE = "CHANGE_JOB_TYPE";
export const CHANGE_WORK_TYPE = "CHANGE_WORK_TYPE";
export const CHANGE_CLOSING_DATE = "CHANGE_CLOSING_DATE";
export const CHANGE_SALARY_ESTIMATE = "CHANGE_SALARY_ESTIMATE";
export const UPDATE_FACETS = "UPDATE_FACETS";
export const RESET_SORTING = "RESET_SORTING";
export const SET_KEYWORD = "SET_KEYWORD";
export const FETCH_COMPANY_HAS_JOBS = "FETCH_COMPANY_HAS_JOBS";
export const FETCH_COMPANY_HAS_JOBS_SUCCESS = "FETCH_COMPANY_HAS_JOBS_SUCCESS";
export const FETCH_COMPANY_HAS_JOBS_FAIL = "FETCH_COMPANY_HAS_JOBS_FAIL";
export const FETCH_MORE_JOBS = "FETCH_MORE_JOBS";
export const FETCH_MORE_JOBS_SUCCEEDED = "FETCH_MORE_JOBS_SUCCEEDED";
export const FETCH_MORE_JOBS_FAIL = "FETCH_MORE_JOBS_FAIL";

export function fetchPosts(location, filters) {
  return { type: FETCH_JOBS, payload: { location, filters } };
}

export function fetchMorePosts(location, filters, page) {
  return { type: FETCH_MORE_JOBS, payload: { location, filters, page } };
}

export function fetchPost(id) {
  return { type: FETCH_JOB, payload: id };
}

export function fetchSimilarJobs(id) {
  return { type: FETCH_SIMILAR_JOBS, payload: id };
}

export function fetchMoreCompanyJobs(data) {
  return { type: FETCH_COMPANY_HAS_JOBS, payload: data };
}

export function changeSortBy(id) {
  return { type: CHANGE_SORT_BY, payload: id };
}

export function changeJobType(type) {
  return { type: CHANGE_JOB_TYPE, payload: type };
}

export function changeWorkType(type) {
  return { type: CHANGE_WORK_TYPE, payload: type };
}

export function changeClosingDate(type) {
  return { type: CHANGE_CLOSING_DATE, payload: type };
}

export function changeSalaryEstimate(type) {
  return { type: CHANGE_SALARY_ESTIMATE, payload: type };
}

export function updateFacets(filters) {
  return { type: UPDATE_FACETS, payload: filters };
}

export function setFilterKeyword(keyword, isCompany) {
  return { type: SET_KEYWORD, payload: { keyword, isCompany} };
}

export function resetSorting(data) {
  return { type: RESET_SORTING, payload: data };
}
