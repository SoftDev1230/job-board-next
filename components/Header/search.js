import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie'
import Link from 'next/link'

import {
  isIOS,
  isAndroid,
  isMobile
} from "react-device-detect";

import LocationSearch from 'components/LocationSearch';
import JobSearch from 'components/JobSearch';
import MobileSearch from 'components/MobileSearch';

class Search extends Component {

  render() {
    const { urlDetails } = this.props;
    return (
      <div className="search-wrapper row mx-auto">
        {isMobile ? (
          <MobileSearch urlDetails={urlDetails} />
        ) : (
          <span>
            <JobSearch urlDetails={urlDetails} />
            <LocationSearch urlDetails={urlDetails} />
          </span>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  // heading: PropTypes.string.isRequired,
  // jobs: PropTypes.instanceOf(Array),
};

export default Search
