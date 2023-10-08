import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router'
import Link from 'next/link'
import Cookies from 'js-cookie'

import JobFilters from './filters';
import LocationSearch from 'components/LocationSearch';
import JobSearch from 'components/JobSearch';
import MobileSearch from 'components/MobileSearch';
import MobileSuggestions from 'components/MobileSearch/suggestions';
import Logo from './logo';
import LoggedIn from './loggedIn';
import MobileDownload from './mobileDownload';
import Search from './search';

import { urls } from '/services/api/urls';

import { resetSorting } from "store/posts/actions";

// import {
//   profileImageURL,
//   prepareURLQuery,
// } from 'services/utils';

import {
  isIOS,
  isAndroid,
  isMobile,
  isChrome,
  isFirefox,
  isSafari,
  isOpera,
  isIE,
  isEdge,
  isMobileSafari
} from "react-device-detect";

class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      direction:'',
      lastScrollPos: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const lastScrollY = window.scrollY;
    const { deviceInfo } = this.props;
    if (!deviceInfo.isMobile) {
      if(this.state.lastScrollPos > lastScrollY) {
        this.setState({
          direction:'top',
          lastScrollPos: lastScrollY,
        }, () => {
          if (this.refs.headerRef) {
            this.refs.headerRef.style.marginTop  = `0px`;
          }
        });
      } else if(this.state.lastScrollPos < lastScrollY) {
        this.setState({
          direction:'bottom',
          lastScrollPos: lastScrollY,
        }, () => {
          if (this.refs.headerRef) {
            this.refs.headerRef.style.marginTop  = `-${lastScrollY > 70 ? '70' : lastScrollY}px`;
          }
        });
      }
    }
  };

  signup = e => {
    e.preventDefault();
    window.location = `${urls.Recruit}/signup?service=findjobs`;
  }

  async signout (e) {
    e.preventDefault();
    const { appData, userSignOut } = this.props;
    await userSignOut(Cookies.get('token'));
    clearToken();
  }

  resetFilters = () => {
    const { resetFilterSorting, urlDetails, location } = this.props;
    resetFilterSorting({ sortBy: 0, jobType: 'All job types', workType: 'All work types', closeDate: 'Closing anytime', salaryEstimate: 'All salary estimates'});
  }

  render() {
    const { enableSearch, urlDetails, userData, location, deviceInfo, cookie, notifications, showMobileSearch, jobCount, keyword } = this.props;
    const isUserLogged = userData.isLogged && userData.user;

    const queryDetails = {
      keyword: keyword,
      location: location,
    }

    // const queryParams = prepareURLQuery(queryDetails);
    const queryParams = {};


    const margin = {
      margin:0
    }

    let header;
    if (isMobile && !isChrome && !isFirefox && !isSafari && !isOpera && !isIE && !isEdge && !isMobileSafari) {
      header = (<div> </div>)
	} else if (isUserLogged) {
      header = (<LoggedIn userData={userData} />)
    } else {
      header = (
        <div className="guest-user-navigation container">
          <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
            <Link href={urls.Links.Landing}>
              {/* <a className="navbar-brand" style={margin}> */}
                <Logo />
              {/* </a> */}
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobileMenu" aria-controls="mobileMenu" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link">Find Jobs</a>
                </li>
                <li className="nav-item">
                  <Link href={urls.Links.Hire} >
                    {/* <a className="nav-link"> */}
                    For Companies
                  {/* </a> */}
                </Link>
                </li>
              </ul>
              <div className="user-menu-right d-flex my-2 my-lg-0">
                <a href={`${urls.Recruit}/login?service=findjobs`} className="nav-link login-link">Login</a>
                <button onClick={(e) => this.signup(e)} className="btn my-0 signup-button" type="submit">Sign up for free</button>
              </div>
            </div>
          </nav>
        </div>);
    }

    return (
      <header className="app-header">
        { header }
        { enableSearch &&
          <div className="container">
            {isMobile ? (
              <MobileSearch urlDetails={urlDetails} />
            ) : (
              <div className="search-wrapper row mx-auto">
                <JobSearch urlDetails={urlDetails} />
                <LocationSearch urlDetails={urlDetails} />
              </div>
            )}
            
            <div className="collapse mobile-menu" id="mobileMenu">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href='#'>Find Jobs</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={urls.Links.Hire}>For Companies</a>
                </li>
              </ul>
              <div className="mobile-download-app-ui">
                <div className="float-left">
                  <img src="/static/banners/mobile-download-app-1.png" srcSet="/static/banners/mobile-download-app-1@2x.png 2x, /static/banners/mobile-download-app-1@3x.png 3x"/>
                </div>
                <div className="float-right">
                  <img src="/static/banners/mobile-download-app-2.png" srcSet="/static/banners/mobile-download-app-2@2x.png 2x, /static/banners/mobile-download-app-2@3x.png 3x"/>
                </div>
                <div className="download-text">Download Unnanu<br />to your mobile</div>
                <MobileDownload deviceInfo={deviceInfo} />
              </div>
            </div>
          </div>
        }

        { !enableSearch &&
          <div className="container">
            <div className="collapse mobile-menu" id="mobileMenu">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href='#'>Find Jobs</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={urls.Links.Hire}>For Companies</a>
                </li>
              </ul>
              <div className="mobile-download-app-ui">
                <div className="float-left">
                  <img src="/static/banners/mobile-download-app-1.png" srcSet="/static/banners/mobile-download-app-1@2x.png 2x, /static/banners/mobile-download-app-1@3x.png 3x"/>
                </div>
                <div className="float-right">
                  <img src="/static/banners/mobile-download-app-2.png" srcSet="/static/banners/mobile-download-app-2@2x.png 2x, /static/banners/mobile-download-app-2@3x.png 3x"/>
                </div>
                <div className="download-text">Download Unnanu<br />to your mobile</div>
                <MobileDownload deviceInfo={deviceInfo} />
              </div>
            </div>
          </div>
        }

        { enableSearch && !isMobile &&
          <JobFilters urlDetails={urlDetails} />
        }

        { jobCount > 0 && !showMobileSearch && isMobile &&
          <JobFilters urlDetails={urlDetails} />
        }

        { isMobile && showMobileSearch &&
          <MobileSuggestions urlDetails={urlDetails} />
        }
      </header>
    );
  }
}

const mapStateToProps = state => {
  const { app, posts } = state;

  return {
    appData: app,
    location: app.location,
    jobCount: posts.count,
    notifications: app.notifications,
    showMobileSearch: app.showMobileSearch,
    keyword: posts.facets.keyword,
  };
};

const mapDispatchToProps = dispatch => ({
  userSignOut: (data) => dispatch(signOut(data)),
  resetFilterSorting: (data) => dispatch(resetSorting(data)),
  fetchNotifications: (token) => dispatch(fetchNotifications(token)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(Header)
);



