import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment'
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router'

import SubmitButton from 'components/Buttons';

// import {
//   imageURL,
//   prepareURLName,
// } from 'services/utils';

class JobsCard extends Component {

  constructor (props) {
    super(props);
    // this.removeHTMLTags = this.removeHTMLTags.bind(this);
  }
  // MB:01/25/2021
  // removeHTMLTags = content => content.replace(/\n/g, " ").replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ")
  // eslint-disable-next-line no-control-regex
  // removeHTMLTags = content => content.replace(/\n/g, " ").replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ").replace(".", ". ").replace(/[\u0020\u000D]/g, '').replace(/[\u000A]/g, ' ');
  checkIfApplied = id => {
    const { appliedJobs } = this.props;
    if (appliedJobs) {
      return appliedJobs.includes(parseInt(id));
    }
      return false;

  }

  convertToPlain = html => {
    // Create a new div element
    const tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

  checkIfSave = id => {
    const { savedJobs } = this.props;
    if (savedJobs) {
      return savedJobs.includes(parseInt(id));
    }
      return false;

  }

  checkIfExpired = date => moment().isAfter(date)

  render() {
    const {id, title, company, jobWorkType, salary, closeDate, time, description, showJobPopup, logo, applyThisJob, saveThisJob, removeThisJob, data} = this.props;
    // const jobNameURL = prepareURLName({title, company});
    const jobNameURL = "UJID";
    const isSaved = this.checkIfSave(id);
    const isApplied = this.checkIfApplied(data.j_id);
    let applyBtnText = isApplied ? 'Applied' : 'Apply now';
    if (this.checkIfExpired(data.close_date)){
      applyBtnText = isApplied ? 'Applied' : 'Expired';
    }
    let jobLocationType = "";
    if (jobWorkType.length === 2){
        jobLocationType = "Hybrid";
    }else if (jobWorkType.length === 1){
        jobLocationType = jobWorkType[0].split(" - ")[1];
    }
    const loctag = {
      marginLeft: "13px",
      padding: "0 13px",
      height: "25px",
      lineHeight: "24px",
      display: "inline-block",
      fontSize: "12px",
      borderRadius: "12.5px",
      border: "solid 1px rgba(0, 0, 0, 0.12)",
      backgroundColor: "#ffffff",
    };
    return (
      <div className="result-card">
        <a className="result-company-logo" href="#">
          <img src={imageURL(logo)} />
        </a>
        <div className="card-text-content">
          <div className="result-card-header">
            <div className="job-title">
              <a  href={`/job/${id}/${jobNameURL}`} onClick={(e) => showJobPopup(e, id, jobNameURL)}>{ title }</a>
              <span style={loctag}>{jobLocationType}</span>
            </div>
            <div className="job-company-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14">
                <g fill="#000" fillRule="nonzero" opacity=".2">
                  <path d="M8.607 12.665H.464a.464.464 0 1 0 0 .93h8.143a.464.464 0 1 0 0-.93zM8.607.506a.464.464 0 0 0-.465-.464H.93a.464.464 0 0 0-.464.464v11.722h8.142V.506zm-4.973 8.58h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm2.705 5.41h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929z" />
                </g>
              </svg>
              <div>{ `${company} · ${data.location}` }</div>
            </div>
            { salary &&
              <div className="job-salary-range">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                  <path fill="#000" fillRule="nonzero" d="M6.006 11.954A5.966 5.966 0 1 0 6.005.022a5.966 5.966 0 0 0 0 11.932zm-2.083-3.6c.052-.196.11-.392.167-.589.07-.225.133-.253.34-.144.353.185.728.289 1.126.335.254.029.502.006.738-.098.439-.19.508-.698.139-1.004a1.925 1.925 0 0 0-.421-.248c-.387-.168-.785-.3-1.149-.514-.588-.352-.963-.836-.917-1.552.052-.807.508-1.315 1.252-1.586.306-.11.306-.11.312-.427v-.323c.005-.242.046-.283.288-.289h.225c.514 0 .514 0 .514.514 0 .363 0 .363.363.421.277.04.542.127.796.237.139.063.196.161.15.311-.063.22-.127.444-.196.664-.07.207-.133.236-.335.138a2.45 2.45 0 0 0-1.263-.248.937.937 0 0 0-.335.07c-.38.166-.444.588-.12.847.16.133.351.225.547.306.34.138.681.277.998.45 1.021.565 1.298 1.852.577 2.723-.26.317-.6.53-.992.635-.173.046-.248.138-.242.317.005.173 0 .352 0 .53 0 .157-.081.243-.237.243-.19.006-.38.006-.571 0-.167-.006-.242-.098-.248-.26 0-.126 0-.26-.006-.386-.006-.283-.011-.294-.283-.34-.352-.058-.692-.133-1.01-.289-.253-.121-.276-.185-.207-.444z" opacity=".2" />
                </svg>
                <div>{ salary }</div>
              </div>
            }
          </div>
          <div className="result-card-ui-actions">
            <SubmitButton
              submitting={false}
              text={isSaved ? 'Saved' : 'Save'}
              btnType="submit"
              btnState={isSaved ? 'saved' : 'save'}
              handleClick={isSaved ? () => removeThisJob(id, data) : () => saveThisJob(id, data)}
            />
            <SubmitButton
              submitting={false}
              text={applyBtnText}
              btnType="submit"
              btnState={isApplied ? 'applied' : 'apply'}
              handleClick={!isApplied ? () => applyThisJob(id) : null}
              disabled={this.checkIfExpired(data.close_date)}
            />
             <div className="timestamp" style={{color: "#222"}}>Closing in <Moment fromNow ago>{ closeDate }</Moment></div>
            {/* <div className="timestamp"><Moment fromNow ago>{ time }</Moment> ago</div> */}
          </div>
          <div className="result-card-description">
            {/* {this.removeHTMLTags(description)} */}
            {this.convertToPlain(description)}
          </div>
          <div className="btn apply-button apply-button-mobile" onClick={() => applyThisJob(id)}>Apply now</div>
          <div className="timestamp-mobile"><Moment fromNow ago>{ time }</Moment> ago</div>
        </div>
      </div>
    );
  }
}

JobsCard.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  jobWorkType: PropTypes.string.isRequired,
  closeDate: PropTypes.string.isRequired,
  salary: PropTypes.string,
  time: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showJobPopup: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { app } = state;

  return {
    savedJobs: app.savedJobsList,
    appliedJobs: state.app.appliedJobs,
  };
};

export default withRedux(Store, mapStateToProps)(
  withReduxSaga(JobsCard)
);
