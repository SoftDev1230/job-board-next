import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie'
import Link from 'next/link'

class MobileDownload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {},
    }
  }

  componentDidMount () {
    this.composeImage();
  }

  onClick(e, url){
    e.preventDefault();
    const win = window.open(url, '_blank');
    win.focus();
  }

  composeImage(){
    const { deviceInfo } = this.props;
    let data = {};
    if (deviceInfo.isAndroid) {
      data = {
        downloadLink: 'https://play.google.com/store/apps/details?id=com.unnanu.app&hl=en_US',
        imageLocation: '/static/banners/mobile-download-android.png',
        imageSrcSet: '/static/banners/mobile-download-android@2x.png 2x, /static/banners/mobile-download-android@3x.png 3x'
      }
    } else {
      data = {
        downloadLink: 'https://itunes.apple.com/us/app/unnanu/id1172255010?mt=8',
        imageLocation: '/static/banners/mobile-download-ios.png',
        imageSrcSet: '/static/banners/mobile-download-ios@2x.png 2x, /static/banners/mobile-download-ios@3x.png 3x'
      }
    }
    this.setState({
      data: data,
    });
  }

  render() {
    const { data } = this.state;
    return (
      <span onClick={ e => this.onClick(e, data.downloadLink)} className="download-link" >
        <img src={ data.imageLocation } srcSet={data.imageSrcSet} />
      </span>
    );
  }
}

MobileDownload.propTypes = {
  // heading: PropTypes.string.isRequired,
  // jobs: PropTypes.instanceOf(Array),
};

export default MobileDownload
