import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router'
import Cookies from 'js-cookie'

import {
  isMobile
} from "react-device-detect";

class DownloadPopup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showed: !props.isLogged,
      lastScrollPos: 0,
    };
    this.dismissModal = this.dismissModal.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll);
    if (isMobile) {
      this.refs.downloadPopup.style.display = "none";
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const lastScrollY = window.scrollY;
    const { deviceInfo, isLogged } = this.props;
    if (!isMobile && !isLogged && !Cookies.get('token')) {
      if(this.state.lastScrollPos < lastScrollY) {
        this.setState({
          showed: true,
        }, () => {
          this.refs.downloadPopup.classList.add('show');
          this.refs.downloadPopup.classList.remove('hide');
          setTimeout(this.dismissModal, 5000);
        });
      }
    }
  };

  dismissModal () {
    this.setState({
      showed: true,
    }, () => {
      this.refs.downloadPopup.classList.add('hide');
      this.refs.downloadPopup.classList.remove('show');
      window.removeEventListener('scroll', this.handleScroll);
    });
    
  }

  render() {
    return (
        <div className="sign-in-up-alert" ref="downloadPopup">
          <header>
            <img src="/static/banners/download-on-mobile.jpg" srcSet="/static/banners/download-on-mobile@2x.jpg 2x, /static/banners/download-on-mobile@3x.jpg 3x" />
            <button onClick={this.dismissModal} >
              <svg width="22px" height="22px" viewBox="0 0 22 22" version="1.1">
                <g id="JobB" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="un-jobpage-job-board---appdownloadpopover" transform="translate(-1408.000000, -579.000000)">
                        <g id="Group-5" transform="translate(1082.000000, 545.000000)">
                            <g id="esc" transform="translate(326.000000, 34.000000)">
                                <circle id="Oval" fill="#A5DAFF" cx="11" cy="11" r="9.77777778"></circle>
                                <path d="M18.7819589,3.21815335 C14.4912375,-1.07250615 7.50934448,-1.07292942 3.21819979,3.21815335 C-1.0729449,7.50923612 -1.07252162,14.4906052 3.21819979,18.7816879 C7.50892121,23.0727707 14.4908142,23.0727707 18.7819589,18.7816879 C23.0726804,14.4906052 23.0726804,7.50881286 18.7819589,3.21815335 Z M14.471687,14.3541832 C14.2117141,14.6141561 13.7902983,14.6141561 13.5303254,14.3541832 L11.0587519,11.8826097 L8.46967462,14.471687 C8.2097017,14.7316599 7.78828594,14.7316599 7.52831302,14.471687 C7.2683401,14.2117141 7.2683401,13.7902983 7.52831302,13.5303254 L10.1173903,10.9412481 L7.64581678,8.46967462 C7.38584387,8.2097017 7.38584387,7.78795307 7.64581678,7.52831302 C7.9057897,7.2683401 8.32720547,7.2683401 8.58717838,7.52831302 L11.0587519,9.99988652 L13.4124887,7.64614966 C13.6724617,7.38617674 14.0938774,7.38617674 14.3538503,7.64614966 C14.6138233,7.90612257 14.6138233,8.32753834 14.3538503,8.58751125 L12.0001135,10.9412481 L14.471687,13.4128216 C14.7316599,13.6727945 14.7316599,14.0942103 14.471687,14.3541832 Z" id="Shape" fill="#386AC0" fillRule="nonzero"></path>
                            </g>
                        </g>
                    </g>
                </g>
              </svg>
            </button>
          </header>
        <div className="alert-body">
          Download Unnanu<br />to your mobile
          <div className="alert-apps d-flex justify-content-center">
            <a href="https://itunes.apple.com/us/app/unnanu/id1172255010?mt=8" target="_blank">
              <img src="/static/banners/alert-ios.png" srcSet="/static/banners/alert-ios@2x.png 2x, /static/banners/alert-ios@3x.png 3x" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.unnanu.app&hl=en_US" target="_blank">
              <img src="/static/banners/alert-android.png" srcSet="/static/banners/alert-android@2x.png 2x, /static/banners/alert-android@3x.png 3x" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

DownloadPopup.propTypes = {
  // heading: PropTypes.string.isRequired,
  // jobs: PropTypes.instanceOf(Array),
};

const mapStateToProps = state => {
  const { app } = state;

  return {
    isLogged: app.isLogged && app.user && app.token,
  };
};

export default withRedux(Store, mapStateToProps)(
  withReduxSaga(DownloadPopup)
);
