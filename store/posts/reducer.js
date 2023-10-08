import {
  FETCH_JOBS_SUCCEEDED,
  FETCH_JOB,
  FETCH_JOB_SUCCESS,
  FETCH_SIMILAR_JOBS_SUCCESS,
  FETCH_COMPANY_HAS_JOBS,
  FETCH_COMPANY_HAS_JOBS_SUCCESS,
  CHANGE_SORT_BY,
  CHANGE_JOB_TYPE,
  CHANGE_WORK_TYPE,
  CHANGE_CLOSING_DATE,
  RESET_SORTING,
  CHANGE_SALARY_ESTIMATE,
  UPDATE_FACETS,
  SET_KEYWORD,
  FETCH_MORE_JOBS_SUCCEEDED,
  FETCH_MORE_JOBS_FAIL,
} from "store/posts/actions";


const initialState = {
  list: [],
  currentPost: {},
  similarJobs: [],
  moreJobs: 0,
  count: 0,
  facets:{
    close: [],
    jobTypes: [],
    workTypes: [],
    salary_annually: [],
    sortBy: 1,
    jobType: 'All job types',
    workType: 'All work types',
    closeDate: 'Closing anytime',
    salaryEstimate: 'All salary estimates',
    keyword: '',
    isCompany: false,
  }
};

export function getUnique(arr, comp) {
  const unique = arr
         .map(e => e[comp])

       // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

       // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

     return unique;
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_JOBS_SUCCEEDED:
      const mergeData = state.list.concat(action.payload);
      const jobsData = getUnique(mergeData, 'j_id');
      return { 
        ...state,
        list: action.payload,
        count: action.count,
        facets: {
          ...state.facets,
          close: action.facets.closing_date,
          jobTypes: action.facets.job_type_array_facet,
          workTypes: action.facets.job_schd_facet,
          salary_annually: action.facets.salary_annually_facet,
        }
      };
    case FETCH_MORE_JOBS_SUCCEEDED:
      const mergeMoreJobs = state.list.concat(action.payload);
      const jobsMoreData = getUnique(mergeMoreJobs, 'j_id');
      return { 
        ...state,
        list: jobsMoreData,
      };
    case UPDATE_FACETS:
      return { 
        ...state,
        facets: {
          ...state.facets,
          close: action.payload.closing_date,
          jobTypes: action.payload.job_type_array_facet,
          workTypes: action.payload.job_schd_facet,
          salary_annually: action.payload.salary_annually_facet,
        }
      };
    case FETCH_JOB:
      return { ...state, currentPost: {}, moreJobs: 0 };
    case FETCH_JOB_SUCCESS:
      return { ...state, currentPost: action.payload };
    case FETCH_SIMILAR_JOBS_SUCCESS:
      return { 
        ...state,
        similarJobs: action.payload,
      };
    case FETCH_COMPANY_HAS_JOBS:
      return { ...state, moreJobs: 0 };
    case FETCH_COMPANY_HAS_JOBS_SUCCESS:
      return { ...state, moreJobs: action.payload };
    case SET_KEYWORD:
      return { 
        ...state,
        facets: {
          ...state.facets,
          keyword: action.payload.keyword,
          isCompany: action.payload.isCompany || false,
        }
      };
    case CHANGE_SORT_BY:
      return { 
        ...state,
        facets: {
          ...state.facets,
          sortBy: action.payload,
        }
      };
    case CHANGE_JOB_TYPE:
      return { 
        ...state,
        facets: {
          ...state.facets,
          jobType: action.payload,
        }
      };
    case CHANGE_WORK_TYPE:
      return {
        ...state,
        facets: {
          ...state.facets,
          workType: action.payload,
        }
      };
    case CHANGE_CLOSING_DATE:
      return { 
        ...state,
        facets: {
          ...state.facets,
          closeDate: action.payload,
        }
      };
    case CHANGE_SALARY_ESTIMATE:
      return { 
        ...state,
        facets: {
          ...state.facets,
          salaryEstimate: action.payload,
        }
      };
    case RESET_SORTING:
      return { 
        ...state,
        facets: {
          ...state.facets,
          sortBy: action.payload.sortBy,
          jobType: action.payload.jobType,
          workType: action.payload.workType,
          closeDate: action.payload.closeDate,
          salaryEstimate: action.payload.salaryEstimate,
          keyword: '',
        }
      };
    default:
      return state;
  }
}
