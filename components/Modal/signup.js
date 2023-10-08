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

import { urls } from '/services/api/urls';

// import {
//   prepareURLQuery,
// } from 'services/utils';

class Signup extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentDidUpdate(prevProps) {
  }

  signup = e => {
    e.preventDefault();
    const { applyJobID, actionType, filters, location } = this.props;
    const format = 'JID000000000';
    const formatJobId = format.substring(0, format.length - applyJobID.toString().length) + applyJobID;
    const isJobApplied = formatJobId ? `&${actionType}job=${formatJobId}` : '';
    const { sortBy, salaryEstimate, jobType, workType, closeDate, keyword } = filters;
    
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
    window.location = `${urls.Recruit}/signup?service=findjobs${isJobApplied}&${queryParams}`;
  }

  render() {
    const { applyJobID, actionType, filters, location } = this.props;
    const format = 'JID000000000';
    const formatJobId = format.substring(0, format.length - applyJobID.toString().length) + applyJobID;
    const isJobApplied = formatJobId ? `&${actionType}job=${formatJobId}` : '';

    const { sortBy, salaryEstimate, jobType, workType, closeDate, keyword } = filters;
    
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

    return (
      <div className='modal-main'>
        <div className="signin-popup-wrapper">
          <div className="popup-content">
            <img
              className="float-left login-popup-artwork"
              src="/static/banners/login-popup-artwork.jpg"
              srcSet="/static/banners/login-popup-artwork@2x.jpg 2x,
                    /static/banners/login-popup-artwork@3x.jpg 3x"
            />
            <h1>Create an Unnanu<br />account for free</h1>
            <p>Find your next great opportunity. Capture short videos that highlight your education, experience and certifications. Speak from the heart to share your unique achievements and experiences.</p>
            <button onClick={(e) => this.signup(e)} className="btn signup-button large">Sign up for free</button>
            <div className="signin-link">Already have an account? <a href={`${urls.Recruit}/login?service=findjobs${isJobApplied}&${queryParams}`}>Sign in.</a></div>
            <div className="popup-footer">
              <img
                className="float-left login-popup-footer-artwork"
                src="/static/banners/login-popup-footer-artwork.png"
                srcSet="/static/banners/login-popup-footer-artwork@2x.png 2x,
                        /static/banners/login-popup-footer-artwork@3x.png 3x"
              />
              <span className="float-left">Download Unnanu<br />to your mobile</span>
              <a href="https://itunes.apple.com/us/app/unnanu/id1172255010?mt=8" target="_blank" className="popup-app-store-image float-left">
                <img
                  src="/static/banners/popup-app-store-image.png"
                  srcSet="/static/banners/popup-app-store-image@2x.png 2x,
                            /static/banners/popup-app-store-image@3x.png 3x"
                />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.unnanu.app&hl=en_US" target="_blank" className="google-play-badge float-left">
                <img
                  src="/static/banners/google-play-badge.png"
                  srcSet="/static/banners/google-play-badge@2x.png 2x,
                            /static/banners/google-play-badge@3x.png 3x"
                />
              </a>
            </div>
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
    location: app.location,
    filters: posts.facets,
  };
};

const mapDispatchToProps = dispatch => ({
});

export default withRedux(Store, mapStateToProps)(
  withReduxSaga(Signup)
);
