import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobsList from '../JobsList';
import { urls } from '/services/api/urls';

class SidebarRight extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { userData } = this.props;
    const isUserLogged = userData.isLogged && userData.user;
    const savedJobs =  userData.savedJobs;

    let sidebar;
    if (!isUserLogged) {
      sidebar = <div className="unnanu-sidebar-cta unnanu-hire-cta">
          <div className="unnanu-hire-cta-title">You want to hire?</div>
          <div className="unnanu-hire-cta-desc">Post unlimited jobs at Unnanu Hire and find the right talent you’re
              looking for.
          </div>
          <a href={urls.Links.Hire} className="btn unnanu-hire-cta-button">Try Unnanu Hire</a>
          <div className="unnanu-hire-cta-image">
            <img src="/static/banners/unnanu-hire-cta-image.png" srcSet="/static/banners/unnanu-hire-cta-image@2x.png 2x, /static/banners/unnanu-hire-cta-image@3x.png 3x" />
          </div>
        </div>
    } else {
      sidebar = <JobsList heading="Saved Jobs" jobs={savedJobs} isSavedJobs={true} />;
    }
    return (
      <div className="right-sidebar">
        { sidebar }
        <div className="unnanu-links"><a href={ urls.Links.Terms }>Terms</a> · <a href={ urls.Links.Privacy }>Privacy</a> · <a href={ urls.Links.FAQ }>FAQ</a> · <a href={ urls.Links.About }>About</a></div>
        <div className="copyright-text">© {(new Date().getFullYear())} Unnanu, Inc.</div>
      </div>
    );
  }
}

SidebarRight.propTypes = {
  // title: PropTypes.string.isRequired,
  // company: PropTypes.string.isRequired,
};

export default SidebarRight;
