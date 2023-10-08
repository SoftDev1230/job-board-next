import {
  FETCH_LOCATION_SUCCEEDED,
  FETCH_LOCATION_FAILED,
  POPUP_SHOW_HIDE,
  FETCH_USER_PROFILE_REQUEST,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAIL,
  FETCH_SAVED_JOBS_REQUEST,
  FETCH_SAVED_JOBS_SUCCESS,
  FETCH_SAVED_JOBS_FAIL,
  STORE_TOKEN,
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
  MOBILE_SEARCH_SHOW,
  MOBILE_SEARCH_DATA,
} from "store/app/actions";

const initialState = {
  //MB:01/25/2021
  //location: 'Austin, TX, USA',
  location: 'Global',
  user: {},
  isLogged: false,
  isModalOpen: false,
  showMobileSearch: false,
  savedJobs: [],
  savedJobsList: [],
  appliedJobs: [],
  popularJobs: [],
  token: null,
  notifications: {},
  mobileSearch: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_LOCATION_SUCCEEDED:
      return { ...state, location: action.payload };
    case FETCH_LOCATION_FAILED:
      return { ...state, location: 'Austin, TX' };
    case POPUP_SHOW_HIDE:
      return { ...state, isModalOpen: action.payload };
    case MOBILE_SEARCH_SHOW:
      return { ...state, showMobileSearch: action.payload };
    case MOBILE_SEARCH_DATA:
      return { ...state, mobileSearch: action.payload };
    case FETCH_POPULAR_JOBS_SUCCESS:
      let formatPopular = action.payload.map((obj) => {
        obj.j_id = obj.id;
        return obj;
      })
      return { 
        ...state,
        popularJobs: formatPopular
      };
    case FETCH_SAVED_JOBS_SUCCESS:
      let formatSaved = action.payload.map((obj) => {
        obj.j_id = obj.id;
        return obj;
      })
      formatSaved.sort(function(a,b){
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      return { 
        ...state,
        savedJobs: formatSaved
      };
    case FETCH_APPLIED_JOBS_SUCCESS:
      return { ...state, appliedJobs: action.payload };
    case FETCH_SAVED_JOBS_LIST_SUCCESS:
      return { ...state, savedJobsList: action.payload };
    case STORE_TOKEN:
      return { ...state, token: action.payload };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, notifications: action.payload };
    case FETCH_USER_PROFILE_SUCCESS:
      return { 
        ...state,
        user: action.payload,
        isLogged: true,
      };
    case FETCH_USER_PROFILE_FAIL:
      return { 
        ...state,
        isLogged: false,
      };
    case SIGN_OUT_SUCCESS:
      return { 
        ...state,
        user: {},
        isLogged: false,
        savedJobs: [],
        appliedJobs: [],
        token: null,
        savedJobsList: [],
        notifications: {},
      };
    case SAVE_JOB_SUCCESS:
      let currentSaved = state.savedJobs;
      let getCurrentList = state.savedJobsList;
      getCurrentList.push(action.payload.id);
      currentSaved.push(action.payload);
      let result = currentSaved.reduce((unique, o) => {
        if(!unique.some(obj => obj.id === o.id)) {
          unique.push(o);
        }
        return unique;
      },[]);
      return { 
        ...state,
        savedJobs: result,
        savedJobsList: getCurrentList,
      };
    case REMOVE_JOB_SUCCESS:
      const removeOldJob = state.savedJobs.filter(function( obj ) {
          return obj.id !== parseInt(action.payload);
      });
      let getCurrentSavedList = state.savedJobsList.filter(e => e !== parseInt(action.payload));
      return { 
        ...state,
        savedJobs: removeOldJob,
        savedJobsList: getCurrentSavedList,
      };

    default:
      return state;
  }
}
