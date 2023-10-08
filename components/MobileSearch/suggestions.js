import React, { Component } from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router'

import {
  storeMobileSearchData,
  showOrHideMobileSearch,
} from "store/app/actions";

import { setFilterKeyword } from "store/posts/actions";

class MobileSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.keyword,
      suggestions: [],
      jobs: [],
      companies:[],
      isLoading: false,
      focused: false,
      showUI: false,
    };
    this.changeKeyword = this.changeKeyword.bind(this);
  }

  componentDidMount () {
    const { keyword } = this.props;
    if (keyword !== '') {
      this.changeKeyword(keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const { keyword } = this.props;
    const oldKeyword = prevProps.keyword;
    if (oldKeyword === '' & keyword !== '') {
      this.changeKeyword(keyword);
    }
  }

  changeKeyword(keyword) {
    document.body.classList.remove('modal-open');
    const { urlDetails, showMobileState, storeMobileSearchData } = this.props;
    Router.push({
        pathname: '/',
        query: { 
          ...urlDetails.query,
          keyword: keyword,
        }
      }).then(() => {
        // showMobileState(false);
      });
  }

  render() {
    // const { value, suggestions, showUI } = this.state;
    const { mobileSearch } = this.props;

    let jobTitles;
    try {
      jobTitles = mobileSearch.jobs.map((item, key) =>
      <li onClick={(e) => this.changeKeyword(item) } key={key} ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
        <g fill="#D9D9D9" fillRule="evenodd">
            <path d="M10.995 9.918v-.43a.948.948 0 0 0-1.895 0v.43a.948.948 0 0 0 1.895 0z"></path>
            <path d="M11.645 10.442a1.674 1.674 0 0 1-1.597 1.192 1.675 1.675 0 0 1-1.598-1.192H1.923a2.67 2.67 0 0 1-1.15-.262v4.333c0 .847.692 1.539 1.539 1.539h15.471c.846 0 1.539-.692 1.539-1.539V10.18a2.67 2.67 0 0 1-1.15.262h-6.527z"></path>
            <path fillRule="nonzero" d="M18.107 2.66h-3.693A2.93 2.93 0 0 0 11.526.196h-2.96A2.93 2.93 0 0 0 5.68 2.66H1.987C1.105 2.66.384 3.353.384 4.2V7.75c0 .85.69 1.538 1.539 1.538h6.454a1.67 1.67 0 0 1 .512-1.128l.03-.024a1.69 1.69 0 0 1 .211-.169c.027-.018.058-.03.086-.046.062-.036.124-.073.19-.101.054-.022.11-.035.166-.051.048-.014.093-.033.143-.043a1.665 1.665 0 0 1 .664 0c.05.01.095.029.143.043.055.016.111.03.165.051.067.028.128.065.19.1.028.017.06.03.087.048.076.05.144.107.211.168.01.009.022.016.03.025.3.288.49.686.512 1.128h6.454c.85 0 1.539-.689 1.539-1.538V4.2c0-.847-.722-1.54-1.603-1.54zm-10.946 0a1.485 1.485 0 0 1 1.407-1.024h2.959c.657 0 1.21.432 1.406 1.024H7.161z"></path>
        </g>
      </svg>{ item }
    </li>);
    } catch (e) {
      jobTitles = null;
    }

    let companyTitles;
    try {
      companyTitles = mobileSearch.companies.map((item, key) =>
      <li onClick={(e) => this.changeKeyword(item) } key={key} ><svg xmlns="http://www.w3.org/2000/svg" width="12" height="18" viewBox="0 0 12 18">
        <g fill="#D9D9D9" fillRule="nonzero">
          <path d="M11.066 16.284H.597a.597.597 0 1 0 0 1.194h10.469a.597.597 0 1 0 0-1.194zM11.066.651a.597.597 0 0 0-.597-.597H1.194a.597.597 0 0 0-.597.597v15.071h10.469V.652zM4.672 11.682h-1.16a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.319h-1.16a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.318h-1.16a.597.597 0 1 1 0-1.195h1.16a.597.597 0 1 1 0 1.195zm0-2.319h-1.16a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm3.478 6.956H6.99a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.319H6.99a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.318H6.99a.597.597 0 1 1 0-1.195h1.16a.597.597 0 1 1 0 1.195zm0-2.319H6.99a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194z"></path>
        </g>
      </svg>{ item }
    </li>);
    } catch (e) {
      companyTitles = null;
    }

    let ret;
    if (Object.entries(mobileSearch).length === 0 && mobileSearch.constructor === Object) {
      ret = <div className="mobile-search-keyword-suggestions">
            <div className="suggestions-empty">Search for job positions listed in<br /> Unnanu by title, keywords or location</div>
          </div>
    } else {
      ret = <div className="mobile-search-keyword-suggestions">
        <div className="suggestions-header">
            <div className="header-icon float-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
                    <path fill="#D9D9D9" fillRule="nonzero" d="M16.163 15.484l-4.046-4.208a6.842 6.842 0 0 0 1.61-4.412A6.872 6.872 0 0 0 6.864 0 6.872 6.872 0 0 0 0 6.864a6.872 6.872 0 0 0 6.864 6.863 6.79 6.79 0 0 0 3.932-1.242l4.077 4.24a.89.89 0 0 0 1.266.025.896.896 0 0 0 .024-1.266zm-9.3-13.693a5.079 5.079 0 0 1 5.074 5.073 5.079 5.079 0 0 1-5.073 5.073A5.079 5.079 0 0 1 1.79 6.864 5.079 5.079 0 0 1 6.864 1.79z"></path>
                </svg>
            </div>
            <div className="currently-typing" onClick={(e) => this.changeKeyword(mobileSearch.keyword) }>{ `“${mobileSearch.keyword}”`}</div>
        </div>
        { jobTitles.length > 0 &&
          <div className="suggestions-result-group job-titles">
            <div className="group-title">Job Titles</div>
            <ul className="suggestions-results-list">
                { jobTitles }
            </ul>
          </div>
        }
        { companyTitles.length > 0 &&
          <hr />
        }
        { companyTitles.length > 0 &&
          <div className="suggestions-result-group companies">
            <div className="group-title">Companies</div>
            <ul className="suggestions-results-list">
              { companyTitles }
            </ul>
          </div>
        }
      </div>
    }

    return (
      <span>{ret}</span>
    );
  }
}
const mapStateToProps = state => {
  const { app, posts } = state;

  return {
    location: app.location,
    keyword: posts.facets.keyword,
    mobileSearch: app.mobileSearch,
  };
};

const mapDispatchToProps = dispatch => ({
  storeKeyword: (keyword, isCompany) => dispatch(setFilterKeyword(keyword, isCompany)),
  showMobileState: (data) => dispatch(showOrHideMobileSearch(data)),
  storeMobileSearchData: (data) => dispatch(storeMobileSearchData(data)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(MobileSuggestions)
);
