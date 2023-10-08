import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router'
import Link from 'next/link'

// import {
//   imageURL,
//   prepareURLName,
// } from 'services/utils';

class JobItem extends Component {
  constructor (props) {
    super(props);
    this.showSimilarJob = this.showSimilarJob.bind(this);
  }

  showSimilarJob = (e, id, urlname) => {
    e.preventDefault();
    const { jobId } = this.props;
    Router.push(`/job/${jobId}/${urlname}`)
    // Router.push(`/?jobId=${id}`, `/job?id=${id}`);
  }

  render() {
    const { company, logo, jobId, title, location, isPopup, showJobPopup } = this.props;
    // const jobNameURL = prepareURLName({title, company});
    const jobNameURL = "UJID";
    return (
      <div className="widget-job">
        <Link  href={`/job/${jobId}/jobNameURL`} onClick={isPopup ? (e) => showJobPopup(e, jobId, jobNameURL) : (e) => this.showSimilarJob(e, jobId, jobNameURL)}>
          {/* <a href={`/job/${jobId}/jobNameURL`} > */}
            <span className="company-logo">
              <img src={imageURL(logo)} />
            </span>
            <div className="job-texts">
              <div className="job-title">{ title }</div>
              <div className="company-name">{ company }</div>
            </div>
          {/* </a> */}
        </Link>
      </div>
    );
  }
}

JobItem.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
};

export default JobItem;
