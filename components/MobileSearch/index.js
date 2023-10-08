import React, { Component } from "react";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from "next/router";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import moment from "moment";

import {
  showOrHideMobileSearch,
  storeMobileSearchData,
} from "store/app/actions";

import LocationSearchMobile from "components/LocationSearch/locationSearchMobile";

import { setFilterKeyword } from "store/posts/actions";

import { urls } from "/services/api/urls";

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shouldRenderSuggestions(value) {
  return true;
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>
      {suggestion.isJob ? (
        <svg width="20" height="17" viewBox="0 0 20 17">
          <g fill="#D9D9D9" fillRule="evenodd">
            <path d="M10.995 9.918v-.43a.948.948 0 0 0-1.895 0v.43a.948.948 0 0 0 1.895 0z" />
            <path d="M11.645 10.442a1.674 1.674 0 0 1-1.597 1.192 1.675 1.675 0 0 1-1.598-1.192H1.923a2.67 2.67 0 0 1-1.15-.262v4.333c0 .847.692 1.539 1.539 1.539h15.471c.846 0 1.539-.692 1.539-1.539V10.18a2.67 2.67 0 0 1-1.15.262h-6.527z" />
            <path
              fillRule="nonzero"
              d="M18.107 2.66h-3.693A2.93 2.93 0 0 0 11.526.196h-2.96A2.93 2.93 0 0 0 5.68 2.66H1.987C1.105 2.66.384 3.353.384 4.2V7.75c0 .85.69 1.538 1.539 1.538h6.454a1.67 1.67 0 0 1 .512-1.128l.03-.024a1.69 1.69 0 0 1 .211-.169c.027-.018.058-.03.086-.046.062-.036.124-.073.19-.101.054-.022.11-.035.166-.051.048-.014.093-.033.143-.043a1.665 1.665 0 0 1 .664 0c.05.01.095.029.143.043.055.016.111.03.165.051.067.028.128.065.19.1.028.017.06.03.087.048.076.05.144.107.211.168.01.009.022.016.03.025.3.288.49.686.512 1.128h6.454c.85 0 1.539-.689 1.539-1.538V4.2c0-.847-.722-1.54-1.603-1.54zm-10.946 0a1.485 1.485 0 0 1 1.407-1.024h2.959c.657 0 1.21.432 1.406 1.024H7.161z"
            />
          </g>
        </svg>
      ) : (
        <svg width="12" height="18" viewBox="0 0 12 18">
          <g fill="#D9D9D9" fillRule="nonzero">
            <path d="M11.066 16.284H.597a.597.597 0 1 0 0 1.194h10.469a.597.597 0 1 0 0-1.194zM11.066.651a.597.597 0 0 0-.597-.597H1.194a.597.597 0 0 0-.597.597v15.071h10.469V.652zM4.672 11.682h-1.16a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.319h-1.16a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.318h-1.16a.597.597 0 1 1 0-1.195h1.16a.597.597 0 1 1 0 1.195zm0-2.319h-1.16a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm3.478 6.956H6.99a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.319H6.99a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194zm0-2.318H6.99a.597.597 0 1 1 0-1.195h1.16a.597.597 0 1 1 0 1.195zm0-2.319H6.99a.597.597 0 1 1 0-1.194h1.16a.597.597 0 1 1 0 1.194z" />
          </g>
        </svg>
      )}
      {suggestion.name}
    </span>
  );
}

function renderSectionTitle(section) {
  return (
    <div className="suggestions-result-group job-titles">
      <div className="group-title">{section.title}</div>
    </div>
  );
}

function getSectionSuggestions(section) {
  return section.languages;
}

function renderInputComponent(inputProps) {
  return (
    <div className="inputContainer">
      <input {...inputProps} />
      {inputProps.value !== "" && (
        <div className="input-group-append">
          <button
            onClick={() => inputProps.clearfunction()}
            className="btn border-0 bg-transparent"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                fill="#FFF"
                fillRule="nonzero"
                d="M17.067 2.924c-3.9-3.899-10.244-3.899-14.143 0-3.899 3.9-3.899 10.243 0 14.143 3.9 3.899 10.243 3.899 14.143 0 3.898-3.9 3.898-10.244 0-14.143zM13.939 13.94c-.3.3-.787.3-1.088 0l-2.856-2.856-2.991 2.992a.77.77 0 1 1-1.088-1.088l2.992-2.992L6.052 7.14A.77.77 0 1 1 7.14 6.052l2.855 2.856 2.72-2.72a.77.77 0 1 1 1.088 1.088l-2.72 2.72 2.856 2.855c.3.3.3.787 0 1.088z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

class MobileSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.keyword,
      suggestions: [],
      jobs: [],
      companies: [],
      isLoading: false,
      focused: false,
      showUI: false,
    };
    this.autosuggest = React.createRef();
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.changeKeyword = this.changeKeyword.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(
      this
    );
    this.renderInputComponent = this.renderInputComponent.bind(this);
  }

  componentDidMount() {
    const { keyword } = this.props;
    if (keyword !== "") {
      this.changeKeyword(keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const { keyword, showMobileSearch } = this.props;
    const { showUI, focused } = this.state;
    const oldKeyword = prevProps.keyword;
    const oldshowMobileSearch = prevProps.showMobileSearch;
    if ((oldKeyword === "") & (keyword !== "")) {
      this.changeKeyword(keyword);
      this.changeUIState();
    }
    if ((oldKeyword !== "") & (keyword === "")) {
      this.setState(
        {
          value: "",
        },
        () => {
          this.props.storeKeyword("", false);
        }
      );
    }
  }

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    return false;
  };

  renderInputComponent = (inputProps) => {
    return (
      <div>
        <div className="inputContainer">
          <input {...inputProps} />
          {inputProps.value !== "" && (
            <div className="input-group-append">
              <button
                onClick={(e) => this.clearText(e)}
                className="btn border-0 bg-transparent"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fill="#FFF"
                    fillRule="nonzero"
                    d="M17.067 2.924c-3.9-3.899-10.244-3.899-14.143 0-3.899 3.9-3.899 10.243 0 14.143 3.9 3.899 10.243 3.899 14.143 0 3.898-3.9 3.898-10.244 0-14.143zM13.939 13.94c-.3.3-.787.3-1.088 0l-2.856-2.856-2.991 2.992a.77.77 0 1 1-1.088-1.088l2.992-2.992L6.052 7.14A.77.77 0 1 1 7.14 6.052l2.855 2.856 2.72-2.72a.77.77 0 1 1 1.088 1.088l-2.72 2.72 2.856 2.855c.3.3.3.787 0 1.088z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    let { jobs, companies } = this.state;

    if (escapedValue === "") {
      return [];
    }

    // const regex = new RegExp('^' + escapedValue, 'i');
    let jobsList = [];
    jobs.forEach(function (part, index) {
      let splitStr = part.toLowerCase().split(" ");
      for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }

      this[index] = splitStr.join(" ");
    }, jobs);
    jobs = [...new Set(jobs)];
    jobs.map(function (item, key) {
      jobsList.push({ name: item, isJob: true });
    });

    let companiesList = [];
    companies.forEach(function (part, index) {
      let splitStr = part.toLowerCase().split(" ");
      for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }

      this[index] = splitStr.join(" ");
    }, companies);
    companies = [...new Set(companies)];
    companies.map(function (item, key) {
      companiesList.push({ name: item, isJob: false });
    });

    let ret = [];

    if (jobsList.length) {
      ret.push({ title: "Job Titles", languages: jobsList });
    }

    if (companiesList.length) {
      ret.push({ title: "Companies", languages: companiesList });
    }

    return ret;
  }

  loadSuggestions(value) {
    this.setState({
      isLoading: true,
      jobs: [],
      companies: [],
    });

    var self = this;
    const facade = {};
    const api = axios.create({
      baseURL: urls.SearchIndex.URL,
      headers: { "api-key": urls.SearchIndex.Key },
    });

    facade.request = (config) => api.request(config);
    ["get", "head"].forEach((method) => {
      facade[method] = (url, config) =>
        facade.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade[method] = (url, data, config) =>
        facade.request({ ...config, method, url, data });
    });

    const date = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");

    facade
      .get(
        `/indexes/job-board-uat/docs/suggest?api-version=2017-11-11&search=${value}&suggesterName=title-and-company&searchFields=j_title&fuzzy=true`
      )
      .then((resp) => {
        let jobs = self.state.jobs;
        resp.data.value.map((job) => {
          jobs.push(job["@search.text"]);
        });
        jobs = [...new Set(jobs)];

        facade
          .get(
            `/indexes/job-board-uat/docs/suggest?api-version=2017-11-11&search=${value}&suggesterName=title-and-company&searchFields=company_name&fuzzy=true`
          )
          .then((resp) => {
            let comp = self.state.companies;
            resp.data.value.map((job) => {
              comp.push(job["@search.text"]);
            });
            comp = [...new Set(comp)];

            this.setState(
              {
                isLoading: false,
                suggestions: this.getSuggestions(value),
                companies: comp,
                jobs: jobs,
              },
              () => {
                this.props.storeMobileSearchData({
                  keyword: value,
                  companies: comp,
                  jobs: jobs,
                });
              }
            );
          });
      });
  }

  changeKeyword = (keyword) => {
    const { urlDetails } = this.props;
    this.setState(
      {
        value: keyword,
      },
      () => {
        Router.push({
          pathname: "/",
          query: {
            ...urlDetails.query,
            keyword: keyword,
          },
        });
      }
    );
  };

  onChange = (event, { newValue, method }) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();

    if (newValue === "") {
      this.setState(
        {
          suggestions: [],
          jobs: [],
          companies: [],
        },
        () => {
          this.props.storeMobileSearchData({});
        }
      );
    }

    if (method === "enter") {
      this.props.storeKeyword(newValue);
    } else {
      this.setState({
        value: newValue,
      });
    }
  };

  clearText = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
    this.setState(
      {
        value: "",
      },
      () => {
        this.props.storeKeyword("", false);
        this.props.storeMobileSearchData({});
      }
    );
  };

  onBlur = (event) => {
    // this.props.storeKeyword(this.state.value);
    this.setState({ focused: false });
  };

  onFocus = (event) => {
    this.setState({ focused: true, showUI: true }, () => {
      this.props.showMobileState(true);
      document.body.classList.add("modal-open");
    });
  };

  closeUI = (event) => {
    this.props.showMobileState(false);
    this.props.storeMobileSearchData({});
    this.setState({ focused: false, showUI: false });
    document.body.classList.remove("modal-open");
  };

  changeUIState = (event) => {
    this.props.showMobileState(false);
    this.setState({ focused: false, showUI: false });
  };

  enterPress = (event) => {
    if (event.key === "Enter" && !this.state.value) {
      this.props.storeKeyword("");
    }
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.setState(
      {
        value: suggestionValue,
      },
      () => {
        this.props.storeKeyword(suggestionValue);
        this.autosuggest.current.onBlur();
      }
    );
  };

  onQuerySelected = (event, query) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
    this.setState(
      {
        value: query,
      },
      () => {
        this.props.storeKeyword(query);
        this.onSuggestionsClearRequested();
      }
    );
    this.autosuggest.current.onBlur();
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    if (value !== "") {
      this.loadSuggestions(value);
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions, showUI } = this.state;
    const { keyword, urlDetails } = this.props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Job Title, Company or Keywords",
      value,
      maxLength: 100,
      onChange: this.onChange,
      onBlur: this.onBlur,
      type: "text",
      onKeyPress: this.enterPress,
      onFocus: this.onFocus,
      className:
        "form-control keyword-input bg-transparent border-0 autosuggest-margin",
    };

    const formClass =
      value === ""
        ? "keyword-search-box input-group"
        : "keyword-search-box input-group has-keyword";

    // Finally, render it!
    return (
      <div className="search-wrapper row mx-auto">
        <form
          className={formClass}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="input-group-prepend">
            <button
              className="btn btn-outline-secondary border-0"
              type="button"
              id="keyword-search-button"
            >
              <img
                src="/static/icons/keyword-search-icon.png"
                srcSet="/static/icons/keyword-search-icon@2x.png 2x, /static/icons/keyword-search-icon@3x.png 3x"
                className="keyword-search-icon"
              />
            </button>
          </div>

          <Autosuggest
            ref={this.autosuggest}
            multiSection={true}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            shouldRenderSuggestions={shouldRenderSuggestions}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSectionTitle={renderSectionTitle}
            getSectionSuggestions={getSectionSuggestions}
            inputProps={inputProps}
            highlightFirstSuggestion={true}
            renderSuggestionsContainer={this.renderSuggestionsContainer}
            renderInputComponent={this.renderInputComponent}
          />
        </form>
        {showUI && <LocationSearchMobile urlDetails={urlDetails} />}
        {showUI && (
          <div onClick={this.closeUI} className="cancel-search-mobile">
            Cancel
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { app, posts } = state;

  return {
    location: app.location,
    keyword: posts.facets.keyword,
    showMobileSearch: app.showMobileSearch,
  };
};

const mapDispatchToProps = (dispatch) => ({
  storeKeyword: (keyword, isCompany) =>
    dispatch(setFilterKeyword(keyword, isCompany)),
  showMobileState: (data) => dispatch(showOrHideMobileSearch(data)),
  storeMobileSearchData: (data) => dispatch(storeMobileSearchData(data)),
});

export default withRedux(
  Store,
  mapStateToProps,
  mapDispatchToProps
)(withReduxSaga(MobileSearch));
