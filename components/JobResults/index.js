import React, { Component } from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from "next/router";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import moment from "moment";
import generateHash from "random-hash";
import { confirmAlert } from "react-confirm-alert";
import Cookies from "js-cookie";

import JobsCard from "./jobsCard";
import LoadingCard from "./loadingCard";

import Modal from "../Modal/modal";

import {
  fetchPosts,
  updateFacets,
  fetchMorePosts,
  resetSorting,
} from "store/posts/actions";

import {
  fetchLocation,
  showOrHidePopup,
  saveJob,
  removeJob,
} from "store/app/actions";

// import {
//   getDatesType,
//   getJobType,
//   getWorkType,
//   getSortBy,
//   getSalaryEstimate,
//   setSearchKeyword,
//   getLocationFilter,
//   prepareURLQuery,
// } from "services/utils";

import { urls } from "/services/api/urls";

class JobResults extends Component {
  constructor(props) {
    super(props);
    // this.onKeyDown = this.onKeyDown.bind(this);
    this.state = {
      jobList: props.jobs,
      hasMoreItems: true,
      pageLoading: false,
      count: 0,
      showSignup: false,
      page: 1,
      applyJobID: null,
      type: null,
      height: 0,
      initialLoad: true,
      scrollY: null,
    };
    this.applyJob = this.applyJob.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.removeJob = this.removeJob.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
    this.showJobPopup = this.showJobPopup.bind(this);
    this.showSignupPopup = this.showSignupPopup.bind(this);
    this.loadNextOrPrevious = this.loadNextOrPrevious.bind(this);
    this.fetchMoreJobs = this.fetchMoreJobs.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
  }

  // handling escape close
  componentDidMount() {
    window.addEventListener("resize", this.resizeEvent);
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;

    this.setState(
      { height: windowHeight, scrollY: window.pageYOffset, initialLoad: false },
      () => {
        this.loadItems(0);
      }
    );
  }

  resizeEvent() {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    this.setState({ height: windowHeight });
  }

  componentDidUpdate(prevProps, prevState) {
    const { jobs, location } = prevProps;
    const newJobs = this.props.jobs;
    const newLocation = this.props.location;
    const { jobList } = prevState;
    const newjobList = this.state.jobList;

    const { filters } = this.props;
    const { sortBy, salaryEstimate, jobType, workType, closeDate, keyword } = filters;
    const oldSortBy = prevProps.filters.sortBy;
    const oldsalaryEstimate = prevProps.filters.salaryEstimate;
    const oldjobType = prevProps.filters.jobType;
    const oldworkType = prevProps.filters.workType;
    const oldcloseDate = prevProps.filters.closeDate;
    const oldKeyword = prevProps.filters.keyword;

    if (
      oldKeyword !== keyword ||
      oldSortBy !== sortBy ||
      oldsalaryEstimate !== salaryEstimate ||
      oldjobType !== jobType ||
      oldworkType !== workType ||
      oldcloseDate !== closeDate
    ) {
      this.scroll.pageLoaded = 0;
      window.scrollTo(0, 0);

      this.setState(
        {
          jobList: [],
          hasMoreItems: true,
          pageLoading: false,
          page: 1,
        },
        () => {
          this.loadItems(0);
          // this.scroll.pageLoaded = 0;
        }
      );
    }

    if (location !== newLocation) {
      this.scroll.pageLoaded = 0;
      window.scrollTo(0, 0);
      // this.loadItems(0);
      this.setState(
        {
          jobList: [],
          hasMoreItems: true,
          pageLoading: false,
          page: 1,
        },
        () => {
          this.loadItems(0);
          // this.scroll.pageLoaded = 0;
        }
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEvent);
  }

  // onKeyDown (e) {
  //   if (!this.props.url.query.jobId) return
  //   if (e.keyCode === 27) {
  //     this.props.url.back()
  //   }
  // }

  dismissModal() {
    const { popupShowHide, urlDetails, filters, location } = this.props;
    popupShowHide(false);
    document.body.classList.remove("modal-open");
    this.setState({ showSignup: false, applyJobID: null, type: null });

    const { sortBy, salaryEstimate, jobType, workType, closeDate, keyword } = filters;
    const userLocation = location !== undefined ? location : "Austin, TX, USA";
    const userfilters = {
      sort: sortBy,
      salary: salaryEstimate,
      jobtype: jobType,
      worktype: workType,
      closedate: closeDate,
      keyword,
      location: userLocation,
    };
    const queryParams = prepareURLQuery(userfilters);
    Router.push(`/?${queryParams}`).then(() =>
      window.scrollTo(0, this.state.scrollY)
    );
  }

  showJobPopup(e, id, jobNameURL) {
    e.preventDefault();
    const {
      popupShowHide,
      urlDetails,
      filters,
      deviceInfo,
      location,
    } = this.props;
    popupShowHide(true);
    document.body.classList.add("modal-open");

    if (deviceInfo.isMobile) {
      const queryParams = Object.keys(urlDetails.query)
        .reduce((a, k) => {
          a.push(`${k  }=${  encodeURIComponent(urlDetails.query[k])}`);
          return a;
        }, [])
        .join("&");
      Router.push(`/job/${id}/${jobNameURL}`).then(() => window.scrollTo(0, 0));
    } else {
      this.setState({ scrollY: window.pageYOffset }, () => {
        const queryParams = Object.keys(urlDetails.query)
          .reduce((a, k) => {
            a.push(`${k  }=${  encodeURIComponent(urlDetails.query[k])}`);
            return a;
          }, [])
          .join("&");
        Router.push(
          `/?${queryParams}&jobId=${id}`,
          `/job/${id}/${jobNameURL}`
        ).then(() => window.scrollTo(0, 0));
      });
    }
  }

  composeSalaryRange(type, item) {
    const label = parseInt(type) === 1 ? "Annually" : "Hourly";

    const startRange =
      parseInt(type) === 1
        ? Math.ceil(item.salary_annually)
        : Math.ceil(parseInt(item.salary_hr_start));
    const endRange =
      parseInt(type) === 1
        ? Math.ceil(item.salary_annually_end)
        : Math.ceil(parseInt(item.salary_hr_end));

    if (startRange === 0 && endRange === 0) {
      return null;
    } else if (endRange === 0) {
      return `$${startRange
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${label}`;
    }
      return `$${startRange
        .toString()
        .replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )} - $${endRange
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${label}`;

  }

  applyJob(id) {
    const { appData, deviceInfo } = this.props;

    if (
      deviceInfo.isMobile ||
      (appData.isLogged && appData.token && appData.user)
    ) {
      const format = "JID000000000";
      const formatJobId =
        format.substring(0, format.length - id.toString().length) + id;
      // MB: 01/25/2021  
      window.location = `${urls.Recruit}/jobboard/apply/${formatJobId}?service=findjobs&source=UJSL`;
    } else {
      // document.body.classList.add('modal-open');
      // this.setState({ showSignup: true, applyJobID: id, type: 'apply' });
      const { filters } = this.props;
      const format = 'JID000000000';
      const formatJobId = format.substring(0, format.length - id.toString().length) + id;
      const isJobApplied = formatJobId ? `&applyjob=${formatJobId}` : '';
      const { sortBy, salaryEstimate, jobType, workType, closeDate, keyword } = filters;

      const userfilters = {
        sort: sortBy,
        salary: salaryEstimate,
        jobtype: jobType,
        worktype: workType,
        closedate: closeDate,
        keyword,
        location: appData.location,
      };
      const queryParams = prepareURLQuery(userfilters);
      window.location = `${urls.Recruit}/signup?service=findjobs${isJobApplied}&${queryParams}`;
    }
  }

  saveJob(id, data) {
    const { appData, saveUserJob } = this.props;
    if (appData.isLogged && appData.token && appData.user) {
      const prepSave = {
        logo: data.logo,
        company: data.company_name,
        title: data.j_title,
        id: parseInt(id),
        close_date: data.closing_date,
        timestamp: moment().toISOString(),
      };
      saveUserJob(appData.token, id, prepSave);
    } else {
      document.body.classList.add("modal-open");
      this.setState({ showSignup: true, applyJobID: id, type: "save" });
    }
  }

  showSignupPopup(id, action) {
    document.body.classList.add("modal-open");
    this.setState({ showSignup: true, applyJobID: id, type: action });
  }

  removeJob(id) {
    const { appData, removeUserJob } = this.props;
    if (!appData.isLogged && appData.user) {
      document.body.classList.add("modal-open");
      this.setState({ showSignup: true });
      // Router.push(`/?signUp=${id}`, `/signUp?id=${id}`);
    } else {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="confirm-popup-wrapper">
            <div className="popup-content">
              <div className="popup-header">
                <h1>Remove Saved Job</h1>
              </div>
              <div className="popup-body">
                <p>
                  Are you sure you want to remove this job from your saved
                  jobs?
                </p>
              </div>
              <div className="popup-footer text-right">
                <button onClick={onClose} className="btn cancel-button large">
                  Cancel
                </button>
                <button
                  className="btn confirm-button large"
                  onClick={() => {
                      removeUserJob(appData.token, id);
                      onClose();
                    }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
          ),
      });
    }
  }

  async loadNextOrPrevious(id, jobNameURL) {
    const { urlDetails, jobs } = this.props;
    const isSavedModal = urlDetails.query.saved;
    const isSimilarModal = urlDetails.query.similar;
    const isPopularModal = urlDetails.query.popular;

    const { count } = this.state;

    const getIndex = jobs.findIndex((j) => j.j_id == id);
    const currentLast = jobs.length - 1;
    const getCurrent = getIndex + 1;

    if (getCurrent === currentLast && jobs.length < count) {
      const page = Math.ceil(currentLast / 10) * 10;
      await this.fetchMoreJobs(page);
    }

    if (isSavedModal || isSimilarModal || isPopularModal) {
      let param = isSavedModal ? "saved" : "similar";
      param = isPopularModal ? "popular" : param;
      Router.push(`/?jobId=${id}&${param}=true`, `/job/${id}/${jobNameURL}`);
    } else {
      Router.push(`/?jobId=${id}`, `/job/${id}/${jobNameURL}`);
    }
  }

  async fetchMoreJobs(page) {
    const { loadMoreJobs, location, filters } = this.props;
    await loadMoreJobs(location, filters, page);
  }

  loadItems(page) {
    const self = this;

    if (!this.state.pageLoading && this.state.hasMoreItems) {
      const facade = {};
      const api = axios.create({
        baseURL: urls.SearchIndex.URL,
        headers: { "api-key": urls.SearchIndex.Key },
      });

      const statePage = parseInt(this.state.page);

      this.setState({ pageLoading: true }, () => {
        facade.request = (config) => api.request(config);
        ["get", "head"].forEach((method) => {
          facade[method] = (url, config) =>
            facade.request({ ...config, method, url });
        });
        ["delete", "post", "put", "patch"].forEach((method) => {
          facade[method] = (url, data, config) =>
            facade.request({ ...config, method, url, data });
        });

        const { loadNewJobs, location, filters, saveNewFilters } = this.props;

        const {
          sortBy,
          salaryEstimate,
          jobType,
          workType,
          closeDate,
          keyword,
          isCompany,
        } = filters;

        // filtering and sorting query build
        const closing =
          closeDate !== "Closing anytime"
            ? getDatesType(closeDate, "closing_date")
            : "";
        const jobFilter =
          jobType !== "All job types"
            ? getJobType(jobType, "job_type_array_facet")
            : "";
        const workFilter =
          workType !== "All work types"
            ? getWorkType(workType, "job_schd_facet")
            : "";
        const salaryFilter =
          salaryEstimate !== "All salary estimates"
            ? getSalaryEstimate(
                salaryEstimate,
                "salary_annually",
                "salary_annually_end"
              )
            : "";
        const sort =
          // keyword === "" || sortBy !== 0 ? getSortBy(1, "updated_time") : "";
          keyword === "" || sortBy !== 0 ? getSortBy(1, "closing_date") : "";
        const keywordFiltering =
          keyword !== "" ? setSearchKeyword(keyword, isCompany) : "";
        const locationFiltering =
          location !== "Global" ? getLocationFilter(location) : "";

        const date = moment(new Date())
          .subtract(1, "days")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss");
        const formatDate = `${date}Z`;

        let pageNumber =
          statePage !== undefined ? parseInt(statePage) * 10 - 10 : 0;
        if (statePage === 1 || statePage === 0) {
          pageNumber = 0;
        }

        let filtering =
          `${locationFiltering +
          closing +
          jobFilter +
          workFilter +
          salaryFilter +
          keywordFiltering 
          } and (status eq 2 or status eq null) and closing_date gt ${ 
          formatDate}`;
        filtering = filtering.substring(5);

        const userfilters = {
          sort: sortBy,
          salary: salaryEstimate,
          jobtype: jobType,
          worktype: workType,
          closedate: closeDate,
          keyword,
          location,
        };

        const queryParams = prepareURLQuery(userfilters);
        Router.push(`/?${queryParams}`);

        // load jobs
        // loadNewJobs(location, filters);

         facade.get(`/indexes/job-board-uat/docs?api-version=2017-11-11&search=*&$skip=${  pageNumber }&$top=10&$filter=${ filtering  }&$count=true&facet=closing_date,count:10000&facet=job_type_array_facet&facet=job_schd_facet&facet=salary_annually_facet,count:10000${  sort}`)
         .then(resp => {
          const jobs = self.state.jobList;
          resp.data.value.map((job) => {
            jobs.push(job);
          });

            const jobsData = this.getUnique(jobs, "j_id");

            if (keyword === "" || sortBy !== 0) {
              // jobsData.sort((a, b) => new Date(b.updated_time) - new Date(a.updated_time));
              jobsData.sort((a, b) => new Date(b.closing_date) - new Date(a.closing_date));
            }

            this.setState({
              jobList: jobsData,
              page: statePage + 1,
              pageLoading: false,
              count: resp.data["@odata.count"],
            });

            saveNewFilters(resp.data["@search.facets"]);

            if (jobsData.length < resp.data["@odata.count"]) {
              this.setState({ hasMoreItems: true });
            } else {
              this.setState({ hasMoreItems: false });
            }
          });
      });
    }
  }

  getUnique = (arr, comp) => {
    const unique = arr
      .map((e) => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
  };

  handleClick = (e) => {
    e.preventDefault();
    const { updateLocation, resetFilterSorting } = this.props;
    resetFilterSorting({
      sortBy: 0,
      jobType: "All job types",
      workType: "All work types",
      closeDate: "Closing anytime",
      salaryEstimate: "All salary estimates",
    });
    updateLocation("Austin, TX, USA");
  };

  render() {
    const {
      urlDetails,
      jobs,
      location,
      appData,
      similarJobs,
      filters,
      allModalJobs,
    } = this.props;
    const {
      jobList,
      pageLoading,
      count,
      showSignup,
      page,
      applyJobID,
      initialLoad,
      type,
    } = this.state;
    const searchResult =
      count > 100 ? `Showing ${count}+ results` : `Showing ${count} results`;
    let numberOfTimes = pageLoading || jobList.length === 0 ? 2 : 4;
    if (initialLoad) {
      numberOfTimes = 4;
    }
    const searchResultsHeader =
      pageLoading || initialLoad ? (
        <div className="loading animated-background" />
      ) : (
        searchResult
      );

    const randomLoaderKey = generateHash();
    const loader = <LoadingCard key={randomLoaderKey} times={numberOfTimes} />;

    const randomLoaderKey2 = generateHash();
    const backgroundLoader = pageLoading ? (
      <LoadingCard key={randomLoaderKey2} times={4} />
    ) : null;

    const items = [];

    jobList.map((item, key) => {
      const randomKey = generateHash();
      items.unshift(
        <JobsCard
          key={randomKey}
          id={item.j_id}
          title={item.j_title}
          company={item.company_name}
          jobWorkType={item.job_schd_facet}
          closeDate={item.closing_date}
          salary={this.composeSalaryRange(item.salary_type, item)}
          time={item.updated_time}
          description={item.text}
          showJobPopup={this.showJobPopup}
          applyThisJob={this.applyJob}
          saveThisJob={this.saveJob}
          removeThisJob={this.removeJob}
          logo={item.logo}
          data={item}
        />
      );
    });

    const noResults = !pageLoading && jobList.length === 0 && !initialLoad;
    const isSavedModal = urlDetails.query.saved;
    const isSimilarModal = urlDetails.query.similar;
    const isPopularModal = urlDetails.query.popular;
    let modalJobs = allModalJobs;
    if (isSavedModal) {
      modalJobs = appData.savedJobs;
    }
    if (isSimilarModal) {
      modalJobs = similarJobs;
    }
    if (isPopularModal) {
      modalJobs = appData.popularJobs;
    }

    return (
      <div
        className="results-section"
        ref={(scroll) => {
          this.scroll = scroll;
        }}
      >
        {!noResults && (
          <div className="results-header">{searchResultsHeader}</div>
        )}

        <InfiniteScroll
          pageStart={1}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.state.hasMoreItems}
          initialLoad={false}
          threshold={this.state.height}
          loader={loader}
        >
          {items}
        </InfiniteScroll>

        {backgroundLoader}

        {urlDetails.query.jobId && !showSignup && (
          <Modal
            id={urlDetails.query.jobId}
            onDismiss={() => this.dismissModal()}
            jobs={modalJobs}
            type="Job"
            similarJobs={isSimilarModal}
            isPopular={urlDetails.query.popular}
            loadNextJob={(id, jobNameURL) =>
              this.loadNextOrPrevious(id, jobNameURL)
            }
            loadPreviousJob={(id, jobNameURL) =>
              this.loadNextOrPrevious(id, jobNameURL)
            }
            showSignupPopup={(id, action) => this.showSignupPopup(id, action)}
          />
        )}

        {showSignup && (
          <Modal
            id={`signup-${applyJobID}`}
            onDismiss={() => this.dismissModal()}
            type="Signup"
            jobID={applyJobID}
            actionType={type}
          />
        )}

        {noResults && (
          <div className="results-empty">
            <svg
              className="results-empty-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
            >
              <path
                fill="#000"
                fillRule="nonzero"
                d="M63.856 38.874v-23.08a1.453 1.453 0 0 0-.02-.244 1.473 1.473 0 0 0-.043-.188l-.001-.004a1.473 1.473 0 0 0-.048-.134l-.018-.037a1.518 1.518 0 0 0-.103-.19l-.011-.019a1.44 1.44 0 0 0-.117-.15c-.007-.01-.015-.018-.023-.026a1.415 1.415 0 0 0-.122-.118l-.02-.018c-.048-.04-.1-.076-.152-.109l-.037-.022a1.455 1.455 0 0 0-.151-.077l-.018-.01L28.958.114l-.01-.004-.04-.015a1.428 1.428 0 0 0-.634-.088h-.012c-.095.01-.19.028-.28.056l-.016.006c-.04.013-.08.027-.118.042l-.006.003-9.977 4.205a1.448 1.448 0 0 0-.884 1.335c0 .583.348 1.11.884 1.335l9.094 3.833v12.765L1.028 34.515c-.018.007-.035.017-.053.025l-.05.025c-.042.02-.081.044-.12.069l-.018.01-.004.003a1.421 1.421 0 0 0-.136.104l-.012.012a1.461 1.461 0 0 0-.105.103l-.029.032a1.432 1.432 0 0 0-.076.096c-.01.012-.018.024-.027.037-.026.038-.05.077-.072.117l-.013.022a1.479 1.479 0 0 0-.067.146l-.014.041a1.501 1.501 0 0 0-.072.285l-.006.04c-.006.057-.01.115-.01.172v12.362c0 .583.348 1.11.884 1.335l34.006 14.333c.09.038.184.068.282.088l.027.004a1.38 1.38 0 0 0 .514 0l.027-.004c.098-.02.193-.05.282-.088l26.806-11.298c.535-.226.884-.752.884-1.335V38.889v-.015zm-16.111 4.623l-9.103-3.836a1.438 1.438 0 0 0-1.887.775 1.45 1.45 0 0 0 .771 1.895l6.493 2.737-8.419 3.548-15.619-6.583 8.419-3.548 5.12 2.158a1.439 1.439 0 0 0 1.887-.775 1.45 1.45 0 0 0-.771-1.896l-4.795-2.02v-9.225L58.69 38.885l-10.944 4.612zm-20.787-7.545l-10.703 4.51L5.311 35.85l21.647-9.123v9.225zM28.4 3.018l30.289 12.766-6.252 2.635-23.47-9.892-.013-.005-6.806-2.869L28.4 3.018zM51.869 21.32a1.435 1.435 0 0 0 1.125.005l7.979-3.363v18.745L29.841 23.586v-11.55L51.87 21.32zM3.027 38.028l31.132 13.12v9.226L3.027 47.253v-9.225zm57.946 12.26L37.042 60.374v-9.225l23.931-10.086v9.225z"
                opacity=".2"
              />
            </svg>
            <div className="results-empty-title">
              Your search <strong>{filters.keyword}</strong> in{" "}
              <strong>{location}</strong> did not find any active jobs.
            </div>
            <p>
              You only see jobs that match the search criteria.
              <br />
              <br />
              Try using more generic job titles.
              <br />
              Check if you have misspelled words.
              <br />
              Or{" "}
              <a href="#" onClick={this.handleClick}>
                see all jobs in Austin, TX
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { app, posts } = state;

  return {
    location: app.location,
    filters: posts.facets,
    isJobsLoading: posts.isLoading,
    appData: app,
    similarJobs: posts.similarJobs,
    allModalJobs: posts.list,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateLocation: (location) => dispatch(fetchLocation(location)),
  loadNewJobs: (location, page) => dispatch(fetchPosts(location, page)),
  loadMoreJobs: (location, filters, page) =>
    dispatch(fetchMorePosts(location, filters, page)),
  saveNewFilters: (filters) => dispatch(updateFacets(filters)),
  popupShowHide: (data) => dispatch(showOrHidePopup(data)),
  saveUserJob: (token, jobid, job) => dispatch(saveJob(token, jobid, job)),
  removeUserJob: (token, jobid) => dispatch(removeJob(token, jobid)),
  resetFilterSorting: (data) => dispatch(resetSorting(data)),
});

export default withRedux(
  Store,
  mapStateToProps,
  mapDispatchToProps
)(withReduxSaga(JobResults));
