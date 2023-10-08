import React, { Component } from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Head from "next/head";
import PropTypes from "prop-types";
import styled from "styled-components";
import Store from "store";
import Router from 'next/router'
import { fetchPost, fetchSimilarJobs, fetchMoreCompanyJobs, setFilterKeyword } from "store/posts/actions";
import {
  showOrHidePopup,
  saveJob,
  removeJob,
} from "store/app/actions";
import NProgress from "components/NProgress";
import Link from 'next/link'
import renderHTML from 'react-render-html';
import Moment from 'react-moment';
import moment from 'moment'
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { notify } from 'react-notify-toast';

import SubmitButton from 'components/Buttons';
import ApplyButton from 'components/Buttons/ApplyButton';

import JobsList from '../JobsList';

import { urls } from '/services/api/urls';
// import api from "services/api";

// import {
//   prepareTweetData,
//   prepareEmailData,
//   prepareFBData,
//   prepareLinkedinData,
//   imageURL,
//   prepareURLQuery,
//   prepareURLName,
// } from 'services/utils';

ApplyButton

class JobPage extends Component {
  constructor(props) {
    super(props);
    this.applyJob = this.applyJob.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.removeJob = this.removeJob.bind(this);
  }

  componentDidMount() {
    const { fetchPostAction, location, id, fetchSimilarJobsAction, checkCompanyJobs, post, isSimilarJobs } = this.props;

    fetchPostAction(id);
    api.postUpdate(id);

    if (!isSimilarJobs) {
      fetchSimilarJobsAction(id);
    }

    if (post && post.j_id === id) {
      checkCompanyJobs({ company: post.company_name, location: post.location, id: post.j_id });
    }
  }

  componentDidUpdate(prevProps) {
    const oldId = prevProps.id;
    const newId = this.props.id;

    const oldPostId = prevProps.post;
    const newPostId = this.props.post;

    const { fetchPostAction, fetchSimilarJobsAction, checkCompanyJobs, post, id, isSimilarJobs } = this.props;

    if (oldId !== newId) {
      fetchPostAction(newId);
      api.postUpdate(newId);
    }

    if (oldId !== newId && !isSimilarJobs) {
      fetchSimilarJobsAction(newId);
    }

    if (Object.keys(oldPostId).length === 0 && oldPostId.constructor === Object && newPostId) {
      checkCompanyJobs({ company: newPostId.company_name, location: newPostId.location, id: newPostId.j_id });
    }
  }

  checkIfSave = id => {
    const { savedJobsList } = this.props;
    if (savedJobsList) {
      return savedJobsList.includes(parseInt(id));
    }
    return false;

  }

  getOtherSavedJobs = id => {
    const { savedJobs } = this.props;
    const otherJobs = savedJobs.filter((el) => el.id != id);
    const returnSaved = otherJobs.length > 5 ? otherJobs.slice(0, 5) : otherJobs;
    return returnSaved;
  }

  getOtherPopularJobs = id => {
    const { popularJobs } = this.props;
    const otherJobs = popularJobs.filter((el) => el.id != id).sort(() => Math.random() - 0.5);
    // const otherJobs = popularJobs.filter(function(el) { return el.id != id; });
    const returnPopular = otherJobs.length > 5 ? otherJobs.slice(0, 5) : otherJobs;
    return returnPopular;
  }

  getOtherSimilarJobs = id => {
    const { similarJobs } = this.props;
    const otherJobs = similarJobs.filter((el) => el.j_id != id);
    const returnSimilar = otherJobs.length > 5 ? otherJobs.slice(0, 5) : otherJobs;
    return returnSimilar;
  }

  checkIfApplied = id => {
    const { appliedJobs } = this.props;
    if (appliedJobs) {
      return appliedJobs.includes(parseInt(id));
    }
    return false;

  }

  composeSalaryRange = (type, item) => {
    const label = parseInt(type) === 1 ? 'Annually' : 'Hourly';

    const startRange = parseInt(type) === 1 ? Math.ceil(item.salary_annually) : Math.ceil(parseInt(item.salary_hr_start));
    const endRange = parseInt(type) === 1 ? Math.ceil(item.salary_annually_end) : Math.ceil(parseInt(item.salary_hr_end));

    if (startRange === 0 && endRange === 0) {
      return null;
    } else if (endRange === 0) {
      return `$${startRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${label}`;
    }
    return `$${startRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - $${endRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${label}`;

  }

  formatSimilarJobs = jobs => {
    const jobsList = [];
    jobs.map((job) => {
      jobsList.push({ id: job.j_id, title: job.j_title, company: job.company_name, logo: job.logo });
    });
    return jobsList;
  }

  applyJob(id) {
    const { appData, post, showSignupPopup } = this.props;
    if (!appData.isLogged && appData.isModalOpen) {
      // document.body.classList.add('modal-open');
      // Router.push(`/job?id=${post.j_id}&signup=true`);

      // showSignupPopup(id, 'apply');
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
    } else {
      const format = 'JID000000000';
      const formatJobId = format.substring(0, format.length - id.toString().length) + id;
      // MB:01/25/2021
      window.location = `${urls.Recruit}/jobboard/apply/${formatJobId}?source=UJSL`;
    }
  }

  saveJob(id, data) {
    const { appData, post, saveUserJob, showSignupPopup } = this.props;
    if (!appData.isLogged && appData.isModalOpen) {
      // document.body.classList.add('modal-open');
      // Router.push(`/job?id=${post.j_id}&signup=true`);
      showSignupPopup(id, 'save');
    } else {
      const prepSave = {
        "logo": data.logo,
        "company": data.company_name,
        "title": data.j_title,
        "id": parseInt(id),
        "close_date": data.closing_date,
        "timestamp": moment().toISOString(),
      };
      saveUserJob(appData.token, id, prepSave);
    }
  }

  removeJob(id) {
    const { appData, removeUserJob } = this.props;
    if (!appData.isLogged && appData.user) {
      document.body.classList.add('modal-open');
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
                <p>Are you sure you want to remove this job from your saved jobs?</p>
              </div>
              <div className="popup-footer text-right">
                <button onClick={onClose} className="btn cancel-button large">Cancel</button>
                <button
                  className="btn confirm-button large"
                  onClick={() => {
                    removeUserJob(appData.token, id)
                    onClose()
                  }}
                >Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  async viewMoreCompany(e, company) {
    e.preventDefault();
    const { location, filters, storeKeyword, closeModal } = this.props;

    const { sortBy, salaryEstimate, jobType, workType, closeDate, keyword } = filters;
    const userfilters = {
      sort: sortBy,
      salary: salaryEstimate,
      jobtype: jobType,
      worktype: workType,
      closedate: closeDate,
      keyword: company,
      location,
    };
    await this.props.storeKeyword(company, true);
    // const queryParams = prepareURLQuery(userfilters);

    // // console.log(queryParams);
    // Router.push({
    //   pathname: '/',
    //   query: { name: 'Zeit' }
    // })
    closeModal();
  }

  onCopy = () => {
    notify.show('Copied to clipboard!', 'success');
  };

  render() {
    const { id, post, similarJobs, showMoreJobs, isJobExpired, isPopular } = this.props;

    const showJob = post.j_id == id && post.text;
    const modalJob = post;

    // job type data
    let terms = [];
    let types = [];
    let jobWorkTypes = [];

    if (modalJob.job_type_array_facet) {
      modalJob.job_type_array_facet.map((item) => {
        const type = item.split(" ");
        terms.push(type[0] === 'Full' ? 'Full time' : 'Part time');
        types.push(type[2].replace(/[()]/g, ''));
      });
    }


    if (modalJob.job_schd_facet){
      modalJob.job_schd_facet.map((item) => {
        const type = item.split(" - ");
        jobWorkTypes.push(type[1]);
      });
    }

    terms = [...new Set(terms)];
    types = [...new Set(types)];
    jobWorkTypes = [...new Set(jobWorkTypes)];

    const termsList = terms.map((item, key) => (
      <span key={key} className="tag">{item}</span>
    ));

    const typesList = types.map((item, key) => (
      <span key={key} className="tag">{item}</span>
    ));

    const workList = jobWorkTypes.map((item, key) => (
      <span key={key} className="tag">
        {item}
      </span>
    ));

    const similarJobsList = this.formatSimilarJobs(this.getOtherSimilarJobs(modalJob.j_id));
    // const jobNameURL = prepareURLName({ title: modalJob.j_title, company: modalJob.company_name });
    const jobNameURL = "UJID";
    const shareObject = {
      title: modalJob.j_title,
      company: modalJob.company_name,
      url: `${urls.BaseURL}/job/${modalJob.j_id}/${jobNameURL}`,
    };

    const isSaved = this.checkIfSave(modalJob.j_id);
    const isApplied = this.checkIfApplied(modalJob.j_id);
    let applyBtnText = isApplied ? 'Applied' : 'Apply now';
    if (isJobExpired) {
      applyBtnText = 'Expired';
    }

    const shareWidgetCSS = classNames({
      'widget': true,
      'widget-disabled': isJobExpired,
    });

    let jobListSide;
    if (isSaved || isPopular) {
      const title_jobs = isSaved ? 'saved' : 'popular'
      const sideListJobs = isSaved ? this.getOtherSavedJobs(modalJob.j_id) : this.getOtherPopularJobs(modalJob.j_id);
      jobListSide = <JobsList heading={`Other ${title_jobs} jobs`} jobs={sideListJobs} isPopup />;
    } else {
      jobListSide = <JobsList heading="Similar Jobs" jobs={similarJobsList} isPopup isSimilarJobs />;
    }

    return (
      <div className='modal-main'>
        { showJob &&
          <div className="popup-wrapper">
            <div className="popup-content">
              <div className="popup-header">
                <div className="logo">
                  <img src={imageURL(modalJob.logo)} />
                </div>
                <div className="header-content">
                  <h1>{modalJob.j_title}</h1>
                  <div className="job-company-location">
                    <svg width="10" height="14" viewBox="0 0 10 14">
                      <g fill="#000" fillRule="nonzero" opacity=".2">
                        <path d="M8.607 12.665H.464a.464.464 0 1 0 0 .93h8.143a.464.464 0 1 0 0-.93zM8.607.506a.464.464 0 0 0-.465-.464H.93a.464.464 0 0 0-.464.464v11.722h8.142V.506zm-4.973 8.58h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm2.705 5.41h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929z" />
                      </g>
                    </svg>{`${modalJob.company_name} · ${modalJob.location}`}
                     <span style={{float:"right"}}>Closing in <Moment fromNow ago>{ modalJob.closing_date }</Moment></span>
                  </div>
                  {modalJob.salary_annually !== 0 &&
                    <div className="job-salary-range">
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path fill="#000" fillRule="nonzero" d="M6.006 11.954A5.966 5.966 0 1 0 6.005.022a5.966 5.966 0 0 0 0 11.932zm-2.083-3.6c.052-.196.11-.392.167-.589.07-.225.133-.253.34-.144.353.185.728.289 1.126.335.254.029.502.006.738-.098.439-.19.508-.698.139-1.004a1.925 1.925 0 0 0-.421-.248c-.387-.168-.785-.3-1.149-.514-.588-.352-.963-.836-.917-1.552.052-.807.508-1.315 1.252-1.586.306-.11.306-.11.312-.427v-.323c.005-.242.046-.283.288-.289h.225c.514 0 .514 0 .514.514 0 .363 0 .363.363.421.277.04.542.127.796.237.139.063.196.161.15.311-.063.22-.127.444-.196.664-.07.207-.133.236-.335.138a2.45 2.45 0 0 0-1.263-.248.937.937 0 0 0-.335.07c-.38.166-.444.588-.12.847.16.133.351.225.547.306.34.138.681.277.998.45 1.021.565 1.298 1.852.577 2.723-.26.317-.6.53-.992.635-.173.046-.248.138-.242.317.005.173 0 .352 0 .53 0 .157-.081.243-.237.243-.19.006-.38.006-.571 0-.167-.006-.242-.098-.248-.26 0-.126 0-.26-.006-.386-.006-.283-.011-.294-.283-.34-.352-.058-.692-.133-1.01-.289-.253-.121-.276-.185-.207-.444z" opacity=".2" />
                      </svg>{this.composeSalaryRange(modalJob.salary_type, modalJob)}
                    </div>
                  }
                  <div className="term-type-wrapper">
                    <div className="term-type d-flex">
                      <span className="label">Term:</span>
                      {termsList}
                      <span className="label" style={{marginLeft:"15px"}}>Work:</span>
                      {workList}
                    </div>
                    <div className="term-type d-flex">
                      <span className="label">Type:</span>
                      {typesList}
                    </div>
                  </div>
                  {modalJob.is_video_required &&
                    <div className="profile-video-required">
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10">
                        <path fill="#000" fillRule="nonzero" d="M15.365.114c.444-.325.809-.147.809.395v8.88c0 .543-.364.721-.809.396L12.94 8.008c-.444-.326-.809-1.036-.809-1.578V3.47c0-.543.365-1.253.809-1.579L15.365.114zM11.12 2.483v5.92a.998.998 0 0 1-1.011.987H1.01A.998.998 0 0 1 0 8.403V1.496A.998.998 0 0 1 1.01.51h9.098a.999.999 0 0 1 1.012.987v.987zM4.043 6.43a.998.998 0 0 0-1.01-.987.998.998 0 0 0-1.011.987c0 .545.452.986 1.01.986a.998.998 0 0 0 1.011-.986z" opacity=".3" />
                      </svg>Profile video required
                    </div>
                  }
                </div>
              </div>
              <div className="popup-body">
                {renderHTML(modalJob.text)}
              </div>
              <hr />
              <div className="job-post-footer d-flex justify-content-between">
                <div className="job-post-timestamp"><Moment fromNow ago>{modalJob.updated_time}</Moment> ago</div>
                {showMoreJobs !== 0 &&
                  <a href="" onClick={(e) => this.viewMoreCompany(e, modalJob.company_name)} className="more-job-posts">View other open positions at {modalJob.company_name}</a>
                }
              </div>
            </div>
            <div className="popup-sidebar">
              <ApplyButton
                submitting={false}
                text={applyBtnText}
                btnType="submit"
                btnState={isApplied ? 'applied' : 'apply'}
                size="large"
                handleClick={!isApplied ? () => this.applyJob(modalJob.j_id) : null}
                disabled={isJobExpired}
              />
              <SubmitButton
                submitting={false}
                text={isSaved ? 'Saved' : 'Save'}
                btnType="submit"
                size="large"
                btnState={isSaved ? 'saved' : 'save'}
                handleClick={isSaved ? () => this.removeJob(id) : () => this.saveJob(id, modalJob)}
                disabled={isJobExpired && !isSaved}
              />

              <div className={shareWidgetCSS}>
                <label className="widget-title">Share</label>
                <div className="widget-share">
                  <div className="share-platforms">
                    <a target={!isJobExpired ? '_blank' : '_self'} href={!isJobExpired ? prepareEmailData(shareObject) : '#'} className="platform-button" rel="noreferrer">
                      <svg width="17" height="13" viewBox="0 0 17 13">
                        <g fill="#777" fillRule="nonzero">
                          <path d="M1.63 4.024c.215.147.863.584 1.944 1.312 1.08.727 1.908 1.288 2.483 1.68.064.044.198.137.403.282.206.144.376.26.512.35.136.089.3.188.493.299a2.9 2.9 0 0 0 .545.248c.171.056.329.083.474.083h.02c.145 0 .303-.027.473-.083.171-.055.353-.138.545-.248.193-.11.357-.21.493-.3.136-.088.307-.205.512-.35l.403-.28 4.437-2.994a4.44 4.44 0 0 0 1.156-1.132c.31-.442.465-.906.465-1.39 0-.406-.15-.753-.45-1.042A1.487 1.487 0 0 0 15.47.026H1.517c-.487 0-.861.16-1.124.48C.131.824 0 1.223 0 1.702c0 .386.174.806.521 1.257.348.451.718.806 1.11 1.064z" />
                          <path d="M16.04 5.009a197.266 197.266 0 0 0-4.721 3.177c-.36.258-.653.46-.877.604a5.472 5.472 0 0 1-.896.442c-.373.15-.72.225-1.043.225h-.019c-.322 0-.67-.075-1.042-.225a5.475 5.475 0 0 1-.896-.442 22.463 22.463 0 0 1-.877-.604C4.816 7.58 3.245 6.52.958 5.01c-.36-.233-.68-.5-.958-.801v7.312c0 .406.148.752.446 1.04.297.29.654.434 1.07.434h13.955c.417 0 .774-.144 1.071-.433.297-.289.446-.635.446-1.04V4.207a5.186 5.186 0 0 1-.948.8z" />
                        </g>
                      </svg>
                    </a>
                    <a target={!isJobExpired ? '_blank' : '_self'} href={!isJobExpired ? prepareLinkedinData(shareObject.url) : '#'} className="platform-button" rel="noreferrer">
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#777" fillRule="nonzero" d="M14.788 0H1.18C.528 0 0 .512 0 1.144v13.679c0 .632.528 1.144 1.18 1.144h13.608c.652 0 1.18-.513 1.18-1.144V1.144C15.967.512 15.44 0 14.787 0zM4.841 13.366H2.428v-7.21h2.413v7.21zM3.635 5.172h-.016c-.81 0-1.334-.553-1.334-1.246 0-.707.54-1.245 1.365-1.245s1.333.538 1.349 1.245c0 .693-.524 1.246-1.364 1.246zm9.902 8.194h-2.412V9.509c0-.97-.349-1.63-1.221-1.63-.667 0-1.063.445-1.237.876-.065.154-.08.369-.08.584v4.027H6.174s.032-6.533 0-7.21h2.412V7.18c.32-.492.892-1.192 2.173-1.192 1.587 0 2.777 1.03 2.777 3.245v4.134zM8.571 7.24c.011-.018.027-.04.042-.061v.061h-.042z" />
                      </svg>
                    </a>
                    <a target={!isJobExpired ? '_blank' : '_self'} href={!isJobExpired ? prepareFBData(shareObject.url) : '#'} className="platform-button" rel="noreferrer">
                      <svg width="9" height="16" viewBox="0 0 9 16">
                        <path fill="#777" fillRule="nonzero" d="M8.262.003L6.206 0c-2.31 0-3.803 1.532-3.803 3.902v1.8H.336a.323.323 0 0 0-.323.323V8.63c0 .179.145.324.323.324h2.067v6.577c0 .179.145.323.324.323h2.697a.323.323 0 0 0 .323-.323V8.955h2.417a.323.323 0 0 0 .324-.324V6.025a.324.324 0 0 0-.323-.324H5.747V4.176c0-.733.175-1.105 1.13-1.105h1.385a.323.323 0 0 0 .323-.324V.327a.323.323 0 0 0-.323-.324z" />
                      </svg>
                    </a>
                    <a target={!isJobExpired ? '_blank' : '_self'} href={!isJobExpired ? prepareTweetData(shareObject) : '#'} className="platform-button" rel="noreferrer">
                      <svg width="18" height="14" viewBox="0 0 18 14">
                        <path fill="#777" fillRule="nonzero" d="M18 1.656a7.63 7.63 0 0 1-2.12.557A3.582 3.582 0 0 0 17.503.258a7.647 7.647 0 0 1-2.347.859A3.76 3.76 0 0 0 12.461 0C10.422 0 8.77 1.583 8.77 3.535c0 .277.032.547.095.805-3.068-.147-5.789-1.555-7.61-3.694a3.396 3.396 0 0 0-.5 1.777c0 1.227.653 2.31 1.643 2.943a3.818 3.818 0 0 1-1.673-.444v.044c0 1.712 1.274 3.142 2.962 3.467-.31.08-.636.124-.973.124-.238 0-.47-.023-.695-.066.47 1.406 1.833 2.428 3.448 2.456a7.62 7.62 0 0 1-4.585 1.51c-.298 0-.592-.017-.881-.048A10.776 10.776 0 0 0 5.66 14c6.793 0 10.505-5.387 10.505-10.06l-.012-.457A7.21 7.21 0 0 0 18 1.656z" />
                      </svg>
                    </a>
                  </div>
                  <div className="share-url input-group">
                    <input type="text" className="form-control" value={shareObject.url} disabled={isJobExpired} readOnly />
                    <div className="input-group-append">
                      <CopyToClipboard text={shareObject.url} onCopy={this.onCopy}>
                        <button className="btn" disabled={isJobExpired}>
                          <svg width="12px" height="14px" viewBox="0 0 12 14" version="1.1">
                            <g id="JobB" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="1">
                              <g id="un-jobpage-job-board---job-post---expired" transform="translate(-1134.000000, -396.000000)" fill="#317EFF" fillRule="nonzero">
                                <g id="jobpost" transform="translate(246.000000, 152.000000)">
                                  <g id="share" transform="translate(715.000000, 171.000000)">
                                    <g id="Rectangle-7-+-https://uat.talent.unnanu.com/A-Mask" transform="translate(0.000000, 63.000000)">
                                      <g id="copy" transform="translate(173.000000, 10.000000)">
                                        <path d="M8.1505102,2.44498978 L1.20153061,2.44498978 C0.549489796,2.44498978 0.0198979592,2.9402863 0.0198979592,3.55010225 L0.0198979592,12.8748466 C0.0198979592,13.4846626 0.549489796,13.9799591 1.20153061,13.9799591 L8.1505102,13.9799591 C8.80255102,13.9799591 9.33214286,13.4846626 9.33214286,12.8748466 L9.33214286,3.55010225 C9.32908163,2.9402863 8.7994898,2.44498978 8.1505102,2.44498978 Z M8.50255102,12.8719836 C8.50255102,13.0552147 8.34336735,13.20409 8.14744898,13.20409 L1.19846939,13.20409 C1.00255102,13.20409 0.843367347,13.0552147 0.843367347,12.8719836 L0.843367347,3.55010225 C0.843367347,3.36687117 1.00255102,3.21799591 1.19846939,3.21799591 L8.14744898,3.21799591 C8.34336735,3.21799591 8.50255102,3.36687117 8.50255102,3.55010225 L8.50255102,12.8719836 Z" id="Shape" />
                                        <path d="M10.8076531,0 L3.85867347,0 C3.20663265,0 2.67704082,0.495296524 2.67704082,1.10511247 C2.67704082,1.3198364 2.86071429,1.49161554 3.09030612,1.49161554 C3.31989796,1.49161554 3.50357143,1.3198364 3.50357143,1.10511247 C3.50357143,0.921881391 3.6627551,0.773006135 3.85867347,0.773006135 L10.8076531,0.773006135 C11.0035714,0.773006135 11.1627551,0.921881391 11.1627551,1.10511247 L11.1627551,10.4298569 C11.1627551,10.6130879 11.0035714,10.7619632 10.8076531,10.7619632 C10.5780612,10.7619632 10.3943878,10.9337423 10.3943878,11.1484663 C10.3943878,11.3631902 10.5780612,11.5349693 10.8076531,11.5349693 C11.4596939,11.5349693 11.9892857,11.0396728 11.9892857,10.4298569 L11.9892857,1.10511247 C11.9892857,0.495296524 11.4596939,0 10.8076531,0 Z" id="Shape" />
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </button>
                      </CopyToClipboard>
                    </div>

                  </div>
                </div>
              </div>

              <hr className="seperator" />

              {jobListSide}

            </div>
          </div>
        }
      </div>
    );
  }
}

JobPage.propTypes = {
  id: PropTypes.any.isRequired,
};

const mapStateToProps = state => {
  const { app, posts } = state;

  return {
    location: app.location,
    post: posts.currentPost,
    similarJobs: posts.similarJobs,
    appData: app,
    showMoreJobs: posts.moreJobs,
    savedJobs: app.savedJobs,
    savedJobsList: app.savedJobsList,
    popularJobs: app.popularJobs,
    appliedJobs: app.appliedJobs,
    filters: posts.facets,
    isJobExpired: moment().isAfter(posts.currentPost.closing_date),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPostAction: (id) => dispatch(fetchPost(id)),
  fetchSimilarJobsAction: (id) => dispatch(fetchSimilarJobs(id)),
  popupShowHide: (data) => dispatch(showOrHidePopup(data)),
  checkCompanyJobs: (data) => dispatch(fetchMoreCompanyJobs(data)),
  storeKeyword: (keyword, isCompany) => dispatch(setFilterKeyword(keyword, isCompany)),
  saveUserJob: (token, jobid, job) => dispatch(saveJob(token, jobid, job)),
  removeUserJob: (token, jobid) => dispatch(removeJob(token, jobid)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(JobPage)
);
