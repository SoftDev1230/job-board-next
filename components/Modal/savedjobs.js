import React, { Component } from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Head from "next/head";
import PropTypes from "prop-types";
import styled from "styled-components";
import Store from "store";
import { fetchPost, fetchSimilarJobs } from "store/posts/actions";
import NProgress from "components/NProgress";
import Link from 'next/link'
import Moment from 'react-moment';
import moment from 'moment'
import generateHash from 'random-hash';

import SubmitButton from 'components/Buttons';
import ApplyButton from 'components/Buttons/ApplyButton';

import {
  fetchSavedJobs,
  saveJob,
  removeJob,
} from "store/app/actions";

import { confirmAlert } from 'react-confirm-alert'; // Import

import { urls } from '/services/api/urls';
import axios from "axios";

// import {
//   imageURL,
//   prepareURLName,
// } from 'services/utils';

class SavedJobs extends Component {

  constructor(props) {
        super(props);
        this.state = {
          jobs: this.props.savedJobs,
          hasMoreItems: true,
          page: 1,
          pageLoading: false,
        };
        this.loadItems = this.loadItems.bind(this);
        this.myRef = React.createRef()
    }

  componentDidMount () {
    this.props.fetchSavedJobs(this.props.appData.token);
    this.loadItems(0);
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
  }


  loadItems(page) {
    const self = this;

    const scrollPosition = this.myRef.current.scrollTop;
    const scrollH = this.myRef.current.scrollHeight;
    const clientH = this.myRef.current.clientHeight;
    const middle = scrollPosition >= (scrollH - clientH)/2;

    const { savedJobsCount, appData } = this.props;
    
     if (!this.state.pageLoading && middle && this.state.hasMoreItems) {

      const facade = {};
      const api = axios.create({ baseURL: urls.API, headers: {'Authorization': appData.token} });

      const statePage = parseInt(this.state.page) + 1;

      this.setState({ pageLoading: true  }, () => {
        facade.request = config => api.request(config);
        ["get", "head"].forEach(method => {
          facade[method] = (url, config) => facade.request({ ...config, method, url });
        });
        ["delete", "post", "put", "patch"].forEach(method => {
          facade[method] = (url, data, config) =>
            facade.request({ ...config, method, url, data });
        });

        let pageNumber = statePage !== undefined ? parseInt(statePage) * 25 - 25 : 0;
          if (statePage === 1 || statePage === 0) {
            pageNumber = 0;
          }

         facade.get(`${urls.API}/api/v1/user/vacancy/savedlist?from=${pageNumber}`)
         .then(resp => {

          const jobs = self.state.jobs;
          resp.data.Data.map((job) => {
            jobs.push(job);
          });

          const jobsData = this.getUnique(jobs,'j_id');

          jobsData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

          this.setState({ jobList: jobsData, page: statePage, pageLoading: false }, () => {
            if (this.state.jobs.length < savedJobsCount) {
              this.setState({ hasMoreItems: true });
            } else {
              this.setState({ hasMoreItems: false });
            }
          });
         })
      });

      
    }
  }

  getUnique = (arr, comp) => {

    const unique = arr
         .map(e => e[comp])

       // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

       // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

     return unique;
  }

  applyThisJob = (event, id) => {
    const { appData, post } = this.props;
    if (!appData.isLogged && !appData.isModalOpen) {
      document.body.classList.add('modal-open');
      Router.push(`/job?id=${post.j_id}&signup=true`);
    } else {
      const format = 'JID000000000';
      const formatJobId = format.substring(0, format.length - id.toString().length) + id;
      // MB:01/25/2021
      window.location = `${urls.Recruit}/jobboard/apply/${formatJobId}?service=findjobs&source=UJSL`;
    }
  }

  removeJob = (event, item) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();

    const { appData, removeUserJob, savedJobs } = this.props;

    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="confirm-popup-wrapper">
          <div className="popup-content">
            <div className="popup-header">
              <h1>Remove Saved Job</h1>
            </div>
            <div className="popup-body">
              <p>Are you sure you want to remove this job from your saved jobs?</p>
            </div>
            <div className="popup-footer text-right">
              <button onClick={onClose} className="btn cancel-button large">Cancel</button>
              <button
                className="btn confirm-button large"
                onClick={() => {
                        removeUserJob(appData.token, item.id);
                        const removeOldJob = this.state.jobs.filter(( obj ) => obj.id !== parseInt(item.id));
                        this.setState({ jobs: removeOldJob }, () => {
                          onClose();
                          if (savedJobs.length === 1) {
                            this.props.close()
                          }
                        });
                    }}
              >Yes, Remove
              </button>
            </div>
          </div>
        </div>
        )
    })
  };

  checkIfApplied = id => {
    const { appliedJobs } = this.props;
    if (appliedJobs) {
      return appliedJobs.includes(parseInt(id));
    } 
      return false;
    
  }

  checkIfExpired = date => moment().isAfter(date)

  render() {
    const { savedJobs } = this.props;
    const { pageLoading } = this.state;

    const items = [];
    this.state.jobs.map((item, key) => {
      const isApplied = this.checkIfApplied(item.id);
      let applyBtnText = isApplied ? 'Applied' : 'Apply now';
      if (this.checkIfExpired(item.close_date)){
        applyBtnText = 'Expired';
      }
      // const jobNameURL = prepareURLName({title: item.title, company: item.company});
      const jobNameURL = "UJID";
      const randomKey = generateHash();
      items.push(
        <div className="job-item"  key={randomKey}>
          <div className="job-item-company-logo">
            <img src={imageURL(item.logo)} />
          </div>
          <div className="job-card-content">
            <div className="job-card-meta">
              <a href={`/job/${item.id}/${jobNameURL}`} className="job-title">{ item.title }</a>
              <div className="company-name">{ item.company }</div>
              <div className="saved-time">Saved <Moment fromNow ago>{ moment.utc(item.timestamp).local() }</Moment> ago</div>
            </div>
            <div className="job-card-actions">
              <ApplyButton
                submitting={false}
                text={applyBtnText}
                btnType="submit"
                btnState={isApplied ? 'applied' : 'apply'}
                handleClick={!isApplied ? e => this.applyThisJob(e, item.id) : null}
                disabled={this.checkIfExpired(item.close_date)}
              />
              <button onClick={e => this.removeJob(e, item)} className="btn remove-button">
                <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="savedjob-popup" transform="translate(-383.000000, -51.000000)" fill="#D2D2D2" fillRule="nonzero">
                      <g id="Shape">
                        <g>
                          <path d="M394.952156,53.0479158 C392.221697,50.3174961 387.778674,50.3172267 385.047945,53.0479158 C382.317217,55.7786048 382.317486,60.2212942 385.047945,62.9519832 C387.778404,65.6826723 392.221427,65.6826723 394.952156,62.9519832 C397.682615,60.2212942 397.682615,55.7783355 394.952156,53.0479158 Z M392.761755,60.761614 C392.551388,60.9719778 392.210384,60.9719778 392.000017,60.761614 L390.000051,58.7616765 L387.905002,60.8566952 C387.694635,61.067059 387.35363,61.067059 387.143264,60.8566952 C386.932897,60.6463314 386.932897,60.305332 387.143264,60.0949682 L389.238312,57.9999495 L387.238346,56.000012 C387.027979,55.7896482 387.027979,55.4483794 387.238346,55.238285 C387.448713,55.0279212 387.789717,55.0279212 388.000084,55.238285 L390.000051,57.2382225 L391.904665,55.3336356 C392.115032,55.1232718 392.456036,55.1232718 392.666403,55.3336356 C392.87677,55.5439993 392.87677,55.8849988 392.666403,56.0953626 L390.761789,57.9999495 L392.761755,59.999887 C392.972122,60.2102508 392.972122,60.5512502 392.761755,60.761614 Z" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                    Remove
              </button>
            </div>
          </div>
        </div>
      );
    });

    const divStyle = {
      overflow: 'auto',
    };

    return (
      <div className="saved-jobs-popup-wrapper">
        <div className="popup-header">Saved Jobs</div>
        <div id="saved-job-popup" className="popup-content" onScroll={this.loadItems.bind(this)} ref={this.myRef} >
          <div className="saved-jobs-list">
            {items}

            { pageLoading &&
              <div className="text-center load-more-preloader">
                <i className="preloader-icon" />
              </div>
                }
          </div>
        </div>       
      </div>
    );
  }
}

// Signup.propTypes = {
//   id: PropTypes.any.isRequired,
// };

const mapStateToProps = state => {
  const { app, posts } = state;

  return {
    appData: app,
    savedJobs: app.savedJobs,
    appliedJobs: state.app.appliedJobs,
    savedJobsCount: app.savedJobsList.length,
  };
};

const mapDispatchToProps = dispatch => ({
  removeUserJob: (token, jobid) => dispatch(removeJob(token, jobid)),
  fetchSavedJobs: (token, page) => dispatch(fetchSavedJobs(token, page)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(SavedJobs)
);
