import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Header from './Header';
import Footer from './Footer';
import DownloadPopup from './DownloadPopup';
// import stylesheet from '/static/css/scss/app.sass';

import Notifications from 'react-notify-toast';

const Layout = props => (
  <div className="viewport d-flex flex-column h-100">
    <Head>
      <meta property="og:title" content={props.fbtitle} />
      <meta property="og:image" content="/static/banners/og-image@1x.png" />
      <meta property="og:description" content={props.fbdescription} />
      <meta property="og:url" content={props.fburl} />
      <meta property="og:site_name" content="uat.jobs.unnanu.com" />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content="Unnanu" />
      <title> {props.title !== 'Unnanu Job Board' ? `Unnanu Job Board - ${props.title}` : props.title} </title>
    </Head>
    <Header enableSearch={props.showSearch} urlDetails={props.urlDetails} userData={props.userData} deviceInfo={props.deviceInfo} cookie={props.cookie} />
    { !props.userData.isLogged &&
      <DownloadPopup deviceInfo={props.deviceInfo} />
    }
    <Notifications options={{ zIndex: 100000, top: '50px' }} />
    <main>
      {props.children}
    </main>
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string,
  showSearch: PropTypes.bool,
  fburl: PropTypes.string,
  fbtitle: PropTypes.string,
  fbdescription: PropTypes.string,
};

Layout.defaultProps = {
  title: 'Unnanu Job Board',
  showSearch: true,
  fburl: 'https://uat.jobs.unnanu.com',
  fbtitle: 'Let we find together the workplace you’ve dreamed of',
  fbdescription: 'Have companies connect with you directly for their job applications you have submitted. Unnanu will try to match active jobs you can apply for.',
};

export default Layout;
