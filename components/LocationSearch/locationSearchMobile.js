import React, { Component } from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import { fetchLocation } from "store/app/actions";
import { fetchPosts, resetSorting } from "store/posts/actions";


class LocationSearchMobile extends Component {

  constructor (props) {
    super(props);
    this.state = {
      address: this.props.location,
      latitude: null,
      longitude: null,
      errorMessage: null,
      focused: false,
    };
  }

  componentDidMount () {
    this.setURL();
  }

  componentDidUpdate(prevProps) {
    const oldAddress = prevProps.location;
    const newAddress = this.props.location;
    if (oldAddress !== newAddress) {
      this.handleChange(newAddress);
    }
  }

  handleChange = address => {
    if (address === 'Global') {
      this.resetAndRoute('Global');
      this.setState({
        address: '',
        latitude: null,
        longitude: null,
        errorMessage: null,
        focused: false,
      }, () => {
        this.props.updateLocation('Global');
      });
    } else {
      this.setState({
        address,
        latitude: null,
        longitude: null,
        errorMessage: null,
        focused: false,
      });
    }
  };

  resetToAustin = address => {
    this.handleChange(address);
    this.props.updateLocation(address);
  }

  onBlur = address => {
    this.setState({ focused: false })
  };

  onFocus = address => {
    // this.setState({ focused: true })
  };

  onError = error => {
    this.setState({ errorMessage: error })
  };

  handleKeyPress = text => {
    this.setState({ focused: true })
  };


  handleSelect = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: null,
      focused: false,
    });
    const { updateLocation, loadNewJobs, location, resetFilterSorting, urlDetails } = this.props;
    if (address !== location) {
      updateLocation(address);
    }
    // loadNewJobs(address);
    // reset job filters sortBy, jobType, closeDate, salaryEstimate
    // resetFilterSorting({ sortBy: 0, jobType: 'All job types', closeDate: 'Closing anytime', salaryEstimate: 'All salary estimates'});
    // Router.push({
    //   pathname: '/',
    //   query: { 
    //     ...urlDetails.query,
    //     location: address,
    //     sort: 0,
    //     salary: 'All salary estimates',
    //     jobtype: 'All job types',
    //     closedate: 'Closing anytime',
    //     keyword: '',
    //   }
    // });
    this.resetAndRoute(address);
  };

  resetAndRoute = address => {
    const { resetFilterSorting, urlDetails } = this.props;
    resetFilterSorting({ sortBy: 0, jobType: 'All job types', workType: 'All work types', closeDate: 'Closing anytime', salaryEstimate: 'All salary estimates'});
    Router.push({
      pathname: '/',
      query: { 
        ...urlDetails.query,
        location: address,
        sort: 0,
        salary: 'All salary estimates',
        jobtype: 'All job types',
        worktype: 'All work types',
        closedate: 'Closing anytime',
      }
    });
  }

  setURL = () => {
    const { location, urlDetails } = this.props;
    Router.push({
      pathname: '/',
      query: { ...urlDetails.query, location: location }
    });
  }

  render() {
    const {
      address,
      errorMessage,
      latitude,
      longitude,
      isGeocoding,
      focused,
    } = this.state;



    const searchOptions = {
      types: ['geocode']
    }

    const formClass = address === '' || address === 'Global' ? 'location-search-box input-group' : 'location-search-box input-group has-keyword';

    return (
      <PlacesAutocomplete
        value={this.state.address !== 'Global' ? this.state.address : ''}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onError={this.onError}
        highlightFirstSuggestion
        ref={c => {
          if (!c) return;
          c.handleInputOnBlur = () => {};
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <form className={formClass}>
            <div className="input-group-prepend">
              <button className="btn btn-outline-secondary border-0" type="button" id="location-search-button">
                <img src="/static/icons/location-search-icon.png" srcSet="/static/icons/location-search-icon@2x.png 2x, /static/icons/location-search-icon@3x.png 3x" className="location-search-icon" />
              </button>
            </div>
            <input
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onKeyPress={this.handleKeyPress}
              {...getInputProps({
                placeholder: 'City, State',
                className: 'form-control location-input bg-transparent border-0',
              })
              }
            />
            { suggestions.length > 0 && !errorMessage &&
              <div className="search-keyword-suggestions mobile">
                {!errorMessage && suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestions-results-list'
                    : 'suggestions-results-list';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { cursor: 'pointer' }
                    : { cursor: 'pointer' };
                  return (
                    <div key={suggestion.id} className="suggestions-result-group companies">
                      <ul
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <li key={suggestion.id}>{suggestion.description}</li>
                      </ul>
                    </div>
                  );
                })}
                { errorMessage &&
                  <span>
                    <div className="suggestions-header">
                      <div className="currently-typing">No matches</div>
                    </div>
                    <div className="suggestions-no-matches" onClick={() => this.resetToAustin('Austin, TX, USA')}>See jobs in Austin, TX</div>
                  </span>
                }
              </div>
            }

            { errorMessage &&
              <div className="search-keyword-suggestions mobile">
                { errorMessage &&
                  <span>
                    <div className="suggestions-header">
                      <div className="currently-typing">No matches</div>
                    </div>
                    <div className="suggestions-no-matches" onClick={() => this.resetToAustin('Austin, TX, USA')}>See jobs in Austin, TX</div>
                  </span>
                }
              </div>
            }
            { address !== '' && address !== 'Global' &&
              <div className="input-group-append">
                <button className="btn border-0 bg-transparent" type="button" onClick={() => this.handleChange('Global')}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path fill="#FFF" fillRule="nonzero" d="M17.067 2.924c-3.9-3.899-10.244-3.899-14.143 0-3.899 3.9-3.899 10.243 0 14.143 3.9 3.899 10.243 3.899 14.143 0 3.898-3.9 3.898-10.244 0-14.143zM13.939 13.94c-.3.3-.787.3-1.088 0l-2.856-2.856-2.991 2.992a.77.77 0 1 1-1.088-1.088l2.992-2.992L6.052 7.14A.77.77 0 1 1 7.14 6.052l2.855 2.856 2.72-2.72a.77.77 0 1 1 1.088 1.088l-2.72 2.72 2.856 2.855c.3.3.3.787 0 1.088z" />
                  </svg>
                </button>
              </div>
            }
          </form>
        )}
      </PlacesAutocomplete>
    );
  }
}

const mapStateToProps = state => {
  const { app } = state;

  return {
    location: app.location,
  };
};

const mapDispatchToProps = dispatch => ({
  updateLocation: (location) => dispatch(fetchLocation(location)),
  loadNewJobs: (location) => dispatch(fetchPosts(location)),
  resetFilterSorting: (data) => dispatch(resetSorting(data)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(LocationSearchMobile)
);
