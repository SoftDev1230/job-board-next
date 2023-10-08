import React from 'react'
import JobPage from './frame'
import Signup from './signup'
import SavedJobs from './savedjobs'

// import {
//   prepareURLName,
// } from 'services/utils';

export default class extends React.Component {

  constructor (props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount () {
    document.addEventListener('keydown', this.onKeyPress);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyPress);
  }

  onKeyPress (e) {
    if (e.keyCode === 37) {
      const getData = this.props.type === 'Job' ? this.compilePreviousAndNext(this.props.id) : { left: null, right: null };
      if (getData.left) {
        this.props.loadNextJob(getData.left, getData.leftName);
      }
    }

    if (e.keyCode === 39) {
      const getData = this.props.type === 'Job' ? this.compilePreviousAndNext(this.props.id) : { left: null, right: null };
      if (getData.right) {
        this.props.loadNextJob(getData.right, getData.rightName);
      }
    }

    if (e.keyCode === 27) {
      this.props.onDismiss();
    }
  }


  dismiss (e) {
    if (this._shim === e.target ||
       this._photoWrap === e.target) {
      if (this.props.onDismiss) {
        // this.props.onDismiss();
      }
    }
  }

  compilePreviousAndNext (id) {
    const { jobs, jobCount, loadMoreJobs } = this.props;
    
    let previous = null;
    let next = null; 
    let leftJobNameURL = null;
    let rightJobNameURL = null;

    try {
      const getIndex = jobs.findIndex(j => j.j_id == id);

      if (getIndex === 0 && getIndex === jobs.length - 1) {
        previous = null;
        next = null;
      } else if (getIndex !== 0 && getIndex !== jobs.length - 1) {
        previous = jobs[getIndex - 1].j_id;
        next = jobs[getIndex + 1].j_id;

        leftJobNameURL = prepareURLName({title: jobs[getIndex - 1].j_title || jobs[getIndex - 1].title, company: jobs[getIndex - 1].company_name || jobs[getIndex - 1].company });
        rightJobNameURL = prepareURLName({title: jobs[getIndex + 1].j_title || jobs[getIndex + 1].title, company: jobs[getIndex + 1].company_name || jobs[getIndex + 1].company});

      } else if (getIndex !== 0 && getIndex === jobs.length - 1) {
        previous = jobs[getIndex - 1].j_id;
        next = null;

        leftJobNameURL = prepareURLName({title: jobs[getIndex - 1].j_title || jobs[getIndex - 1].title, company: jobs[getIndex - 1].company_name || jobs[getIndex - 1].company });
        rightJobNameURL = null;
      } else if (getIndex === 0 && getIndex !== jobs.length - 1) {
        previous = null;
        next = jobs[getIndex + 1].j_id;

        leftJobNameURL = null;
        rightJobNameURL = prepareURLName({title: jobs[getIndex + 1].j_title || jobs[getIndex + 1].title, company: jobs[getIndex + 1].company_name || jobs[getIndex + 1].company});
      } else {
        previous = null;
        next = null;
      }

      return { left:previous, right:next, leftName: leftJobNameURL, rightName: rightJobNameURL };
    } catch(e) {
      return { left:previous, right:next, leftName: leftJobNameURL, rightName: rightJobNameURL };
    } 
  }

  closePopup (e){
    this.props.onDismiss();
  }

  nextJob (e, id, name) {
    e.preventDefault();
    this.props.loadNextJob(id, name);
  }

  previousJob (e, id, name) {
    e.preventDefault();
    this.props.loadPreviousJob(id, name);
  }

  render () {
  
    const getData = this.props.type === 'Job' ? this.compilePreviousAndNext(this.props.id) : { left: null, right: null };
    const showLeftButton = this.props.type === 'Job' && getData.left;
    const showRightButton = this.props.type === 'Job' && getData.right;

    let content;
    if (this.props.type === 'Job') {
      content = <JobPage id={this.props.id} showSignupPopup={this.props.showSignupPopup} isSimilarJobs={this.props.similarJobs} isPopular={this.props.isPopular} closeModal={ this.closePopup } />;
    } else if (this.props.type === 'Signup') {
      content = <Signup id={this.props.id} applyJobID={this.props.jobID} actionType={this.props.actionType} />;
    } else if (this.props.type === 'SavedJobs') {
      content = <SavedJobs data={this.props.data} close={this.props.onDismiss} />;
    } else {
      content = null;
    }

    return (
      <div ref={el => (this._shim = el)} className='shim' onClick={(e) => this.dismiss(e)}>
        <div className="popup-close-button" onClick={(e) => this.closePopup(e)}>
            <svg width="40" height="40" viewBox="0 0 40 40">
                <g fill="none" fillRule="evenodd">
                    <circle cx="20" cy="20" r="20" fill="#FFF"/>
                    <circle cx="20" cy="20.8" r="12.8" fill="#777"/>
                    <path fill="#FFF" fillRule="nonzero" d="M29.504 10.496c-5.46-5.461-14.347-5.462-19.808 0-5.462 5.461-5.461 14.347 0 19.808 5.46 5.461 14.347 5.461 19.808 0s5.461-14.347 0-19.808zm-4.38 15.427c-.421.421-1.103.421-1.524 0l-4-4-4.19 4.19a1.077 1.077 0 1 1-1.523-1.523l4.19-4.19-4-4a1.077 1.077 0 1 1 1.523-1.523l4 4 3.81-3.81a1.077 1.077 0 1 1 1.523 1.524l-3.81 3.809 4 4c.421.42.421 1.103 0 1.523z"/>
                </g>
            </svg>
        </div>
        <div ref={el => (this._photoWrap = el)} className='modal-main'>

            { showLeftButton &&
              <button className="previous-button" onClick={(e) => this.previousJob(e, getData.left, getData.leftName)}>
                <svg width="22px" height="40px" viewBox="0 0 22 40" version="1.1">
                    <g id="JobB" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="un-jobpage-job-board---job-post/popularjobs" transform="translate(-224.000000, -404.000000)" fill="#BDBDBD" stroke="#BDBDBD" strokeWidth="0.8">
                            <g id="back" transform="translate(235.000000, 424.000000) rotate(-180.000000) translate(-235.000000, -424.000000) translate(225.000000, 405.000000)">
                                <path d="M16.829656,18.9662134 L0.0745436567,2.11645925 C-0.499577793,1.53909485 -0.499577793,0.61132356 0.0745436567,0.033959164 C0.649905921,-0.544653055 1.57633914,-0.544653055 2.1517014,0.033959164 L19.9461678,17.9289382 C20.5145137,18.5004945 20.511135,19.4382757 19.9382627,20.0034885 L2.14906581,37.8930674 C1.87454298,38.1797591 1.49733085,38.3344142 1.10916996,38.3344142 C0.72856471,38.3344142 0.351354195,38.1768417 0.0745436567,37.8984676 C-0.499577793,37.3211032 -0.499577793,36.3933319 0.0745436567,35.8159675 L16.829656,18.9662134 Z" id="Path"></path>
                            </g>
                        </g>
                    </g>
                </svg>
              </button>
            }
        
            { showRightButton &&
              <button className="next-button" onClick={(e) => this.nextJob(e, getData.right, getData.rightName)}>
                <svg width="22px" height="40px" viewBox="0 0 22 40" version="1.1" >
                    <g id="JobB" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="un-jobpage-job-board---job-post/popularjobs" transform="translate(-1194.000000, -404.000000)" fill="#BDBDBD" stroke="#BDBDBD" strokeWidth="0.8">
                            <g id="next" transform="translate(1195.000000, 405.000000)">
                                <path d="M16.829656,18.9662134 L0.0745436567,2.11645925 C-0.499577793,1.53909485 -0.499577793,0.61132356 0.0745436567,0.033959164 C0.649905921,-0.544653055 1.57633914,-0.544653055 2.1517014,0.033959164 L19.9461678,17.9289382 C20.5145137,18.5004945 20.511135,19.4382757 19.9382627,20.0034885 L2.14906581,37.8930674 C1.87454298,38.1797591 1.49733085,38.3344142 1.10916996,38.3344142 C0.72856471,38.3344142 0.351354195,38.1768417 0.0745436567,37.8984676 C-0.499577793,37.3211032 -0.499577793,36.3933319 0.0745436567,35.8159675 L16.829656,18.9662134 Z" id="Path"></path>
                            </g>
                        </g>
                    </g>
                </svg>
              </button>
            }

          { content }
        </div>
        <style jsx>{`
          .shim {
            position: fixed;
            top: 0px;
            left: 0px;
            z-index: 1050;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            outline: 0px;
            background: rgba(0, 0, 0, 0.65);
          }

          .modal-main {
            max-width: 870px;
            min-height: calc(100% - 3.5rem);
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            margin: 1.75rem auto;
          }

          .previous-button {
            cursor: pointer;
            padding: 0;
            position:fixed;
            top:405px;
            margin-left:-60px;
            width: 20px;
            height: 38px;
            background: none;
            border:0;
            box-shadow: none;
          }

          .next-button {
              cursor: pointer;
              padding: 0;
              position:fixed;
              top:405px;
              margin-left: 910px;
              width: 20px;
              height: 38px;
              background: none;
              border:0;
              box-shadow: none;
          }
        `}
        </style>
      </div>
    )
  }
}
