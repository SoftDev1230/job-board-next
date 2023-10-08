import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router'

import JobItem from './jobItem';
import Modal from '../Modal/modal'

import {
  showOrHidePopup,
} from "store/app/actions";

class JobsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isSaveOpen: false,
      jobId: null,
    };
    this.dismissModal = this.dismissModal.bind(this);
    this.openSavedJobs = this.openSavedJobs.bind(this);
    this.showJobPopup = this.showJobPopup.bind(this);
  }

  dismissModal () {
    // const { popupShowHide } = this.props;
    // popupShowHide(false);
    document.body.classList.remove('modal-open');
    this.setState({ isSaveOpen: false, jobId: null });
  }

  openSavedJobs () {
    // const { popupShowHide } = this.props;
    // popupShowHide(false);
    document.body.classList.add('modal-open');
    this.setState({ isSaveOpen: true });
  }

  showJobPopup (e, id, jobNameURL) {
    e.preventDefault();
    const { popupShowHide, urlDetails, filters, location } = this.props;
    popupShowHide(true);
    document.body.classList.add('modal-open');
    let param = this.props.isSimilarJobs ? 'similar' : 'saved';
    param = this.props.isPopularJobs ? 'popular' : param; 
    Router.push(`/?jobId=${id}&${param}=true`, `/job/${id}/${jobNameURL}`);
  }

  loadNextOrPrevious (id) {
    // Router.push(`/?jobId=${id}`, `/job?id=${id}`);
    this.setState({ jobId: id });
  }

  render() {
    const { heading, jobs, isSavedJobs = false , savedJobs, isPopup = false, isSimilarJobs = false, isPopularJobs = false } = this.props;
    const { isSaveOpen, jobId } = this.state;

    const getJobs = isSavedJobs ? savedJobs : jobs;
    const showBtn = isSavedJobs && (getJobs && getJobs.length > 5);
    const showJobs = showBtn ? getJobs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0,5) : jobs;
    const noSavedJobs = isSavedJobs && getJobs.length === 0;

    return (
      <div className="widget">
        { (jobs && jobs.length > 0 || isSavedJobs) &&
          <label className="widget-title">{ heading }</label>
        }
        { noSavedJobs &&
          <div className="widget-list widget-jobs-list empty">
            <div className="empty-icon">
              <svg width="27" height="46" viewBox="0 0 27 46">
                <path fill="#000" fillOpacity=".12" fillRule="nonzero" d="M3.039 45.464L13.5 34.612l10.461 10.852c.348.357.782.536 1.26.536.216 0 .433-.045.694-.134.65-.268 1.085-.938 1.085-1.697V1.83C27 .804 26.219 0 25.22 0H1.78C.78 0 0 .804 0 1.831V44.17c0 .76.434 1.384 1.085 1.697.695.268 1.476.134 1.954-.402zM24.81 2.156v40.25l-9.879-10.062a1.97 1.97 0 0 0-1.432-.598c-.543 0-1.037.2-1.432.598L2.189 42.406V2.156h22.622z" />
              </svg>
            </div>
            <div className="empty-text">
                You haven’t saved any<br />jobs yet.
            </div>
          </div>
        }
        <div className="widget-list widget-jobs-list">
          { showJobs && showJobs
            .map((item, key) => (
              <JobItem
                key={key}
                title={item.title}
                company={item.company}
                logo={item.logo}
                jobId={item.id}
                showJobPopup={this.showJobPopup}
                isPopup={isPopup || isSavedJobs || isPopularJobs}
              />
            ))
          }
          { showBtn &&
            <button onClick={() => this.openSavedJobs()} className="btn view-all-btn">View All</button>
          }

          { isSaveOpen &&
            <Modal
              id="saved"
              onDismiss={() => this.dismissModal()}
              type="SavedJobs"
              data={jobs}
            />
          }
        </div>
      </div>
    );
  }
}

JobsList.propTypes = {
  heading: PropTypes.string.isRequired,
  jobs: PropTypes.instanceOf(Array),
};

const mapStateToProps = state => {
  const { app, posts } = state;

  return {
    savedJobs: app.savedJobs,
  };
};

const mapDispatchToProps = dispatch => ({
  popupShowHide: (data) => dispatch(showOrHidePopup(data)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(JobsList)
);
