import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobsList from '../JobsList';

class SidebarLeft extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { userData } = this.props;
    const popularJobs =  userData.popularJobs;
    const location =  popularJobs.length > 0 ? popularJobs[0].location : 'Austin, TX';

    return (
      <div className="left-sidebar">
	    <JobsList heading={`Popular Jobs in ${location}`} jobs={popularJobs} isPopularJobs={true} />
	  </div>
    );
  }
}

SidebarLeft.propTypes = {
  // title: PropTypes.string.isRequired,
  // company: PropTypes.string.isRequired,
};

export default SidebarLeft;
