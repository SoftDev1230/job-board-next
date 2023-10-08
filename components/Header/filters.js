import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from 'next/router';
import {
  changeSortBy,
  changeJobType,
  changeWorkType,
  changeClosingDate,
  changeSalaryEstimate,
  resetSorting,
} from "store/posts/actions";

import moment from 'moment'
import Cookies from 'js-cookie'

class JobFilters extends Component {

  constructor (props) {
    super(props);
    this.state = {
      salaryFilterType: 0,
      showMobileFilters: false,
      typesList: [
        { name: 'Full time (Employee)', count: 0 },
        { name: 'Full time (Contract)', count: 0 },
        { name: 'Full time (Intern)', count: 0 },
        { name: 'Full time (Volunteer)', count: 0 },
        { name: 'Part time (Employee)', count: 0 },
        { name: 'Part time (Contract)', count: 0 },
        { name: 'Part time (Intern)', count: 0 },
        { name: 'Part time (Volunteer)', count: 0 },
      ],
      workTypesList: [
        { name: 'Schedule (M-F) - Onsite', count: 0 },
        { name: 'Schedule (M-F) - Remote', count: 0 },
      ],
      dateTypes: [
        { type: 'Today', count: 0},
        { type: 'Tomorrow', count: 0},
        { type: 'This week', count: 0},
        { type: 'Next week', count: 0},
        { type: 'In two weeks', count: 0},
        { type: 'In a month', count: 0},
        { type: 'In 30 days+', count: 0},
      ],
      annualSalaryTypes: []
    };
    this.getTypeCount = this.getTypeCount.bind(this);
    this.getDatesCount = this.getDatesCount.bind(this);
    this.getWorkTypeCount = this.getWorkTypeCount.bind(this);
    this.getSalaryRangesCount = this.getSalaryRangesCount.bind(this);
    this.sortByChange = this.sortByChange.bind(this);
    this.jobTypeChange = this.jobTypeChange.bind(this);
    this.workTypeChange = this.workTypeChange.bind(this);
    this.closeDateChange = this.closeDateChange.bind(this);
    this.salaryEstimateChange = this.salaryEstimateChange.bind(this);
    this.compileFilters = this.compileFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this)
  }

  componentDidMount () {
    this.compileFilters();
  }

  componentDidUpdate (prevProps, prevState) {
    const { filters } = this.props;
    const { salaryFilterType } = this.state;
    const oldsalaryFilterType = prevState.salaryFilterType;
    const { sortBy, salaryEstimate, jobType, workType, workTypes, closeDate, close, jobTypes, salary_annually } = filters;
    const oldSortBy = prevProps.filters.sortBy;
    const oldsalaryEstimate = prevProps.filters.salaryEstimate;
    const oldjobType = prevProps.filters.jobType;
    const oldcloseDate = prevProps.filters.closeDate;
    const oldworkType = prevProps.filters.workType;

    const oldClose = prevProps.filters.close;
    const oldjobTypes = prevProps.filters.jobTypes;
    const oldworkTypes = prevProps.filters.workTypes;
    const oldSalaryAnnually = prevProps.filters.salary_annually;

    if (oldSortBy !== sortBy || oldsalaryEstimate !== salaryEstimate || oldjobType !== jobType || oldworkType !== workType || oldcloseDate !== closeDate) {
      this.compileFilters();
    }

    if (JSON.stringify(oldClose) !== JSON.stringify(close) || JSON.stringify(oldjobTypes) !== JSON.stringify(jobTypes) || JSON.stringify(oldworkTypes) !== JSON.stringify(workTypes) || JSON.stringify(oldSalaryAnnually) !== JSON.stringify(salary_annually)) {
      this.compileFilters();
    }

    if (oldsalaryFilterType !== salaryFilterType) {
      this.compileFilters();
    }
  }

  getTypeCount = type => {
    const { filters = {} } = this.props;
    const { jobTypes, jobType } = filters;

    const selected = jobTypes.filter(function (obj) { 
      return obj.value === type; 
    })[0];

    try{
      if (jobType === 'All job types' || jobType === type ) {
        return selected.count;
      } else {
        return 0;
      }
    } catch(e){
      return 0;
    }
  };

  getWorkTypeCount = type => {
    const { filters = {} } = this.props;
    const { workTypes, workType } = filters;

    const selected = workTypes.filter(function (obj) {
      return obj.value === type;
    })[0];

    try{
      if (workType === 'All work types' || workType === type ) {
        return selected.count;
      } else {
        return 0;
      }
    } catch(e){
      return 0;
    }
  };

  getDatesCount = type => {
    let count = 0;
    const { filters = {} } = this.props;
    const { close, closeDate } = filters;

    const today = moment().endOf('day');
    const tomorrow = moment().add(1,'days').endOf('day');
    const thisWeek = moment().endOf('week');
    const nextWeekStart = moment().utc().add(1, 'weeks').startOf('week');
    const nextWeekEnd = moment().utc().add(1, 'weeks').endOf('week');
    const nextTwoWeeksStart = moment().add(2, 'weeks').startOf('week');
    const nextTwoWeeksEnd = moment().add(2, 'weeks').endOf('week');
    const inOneMonth = moment().add(1, 'months').endOf('week');

    close.forEach(function (arrayItem) {
        let filter;
        const dateCheck = moment(arrayItem.value.replace('Z', '')).endOf('day');
        switch(type) {
          case 1:
            filter = dateCheck.isSame(today);
            break;
          case 2:
            filter = dateCheck.isAfter(today) && dateCheck.isBefore(tomorrow) || dateCheck.isSame(tomorrow);
            break;
          case 3:
            filter = dateCheck.isBefore(thisWeek) || dateCheck.isSame(thisWeek);
            break;
          case 4:
            filter = dateCheck.isAfter(nextWeekStart) && dateCheck.isBefore(nextWeekEnd) || dateCheck.isSame(nextWeekStart) || dateCheck.isSame(nextWeekEnd);
            break;
          case 5:
            filter = dateCheck.isAfter(nextTwoWeeksStart) && dateCheck.isBefore(nextTwoWeeksEnd) || dateCheck.isSame(nextTwoWeeksStart) || dateCheck.isSame(nextTwoWeeksEnd);
            break;
          case 6:
            filter = dateCheck.isBefore(inOneMonth) || dateCheck.isSame(inOneMonth);
            break;
          case 7:
            filter = dateCheck.isAfter(inOneMonth);
            break;
          default:
            return dateCheck.isAfter(inOneMonth);
        }
        if (filter) {
          count = count + arrayItem.count;
        }
    });
    if (closeDate === 'Closing anytime' || closeDate === this.getDateTypeFromIndex(type) ) {
      return count;
    } else {
      return 0;
    }
    
  }

  getDateTypeFromIndex = index => {
    switch(index) {
      case 1:
        return 'Today';
        break;
      case 2:
        return 'Tomorrow';
        break;
      case 3:
        return 'This week';
        break;
      case 4:
        return 'Next week';
        break;
      case 5:
        return 'In two weeks';
        break;
      case 6:
        return 'In a month';
        break;
      case 7:
        return 'In 30 days+';
        break;
      default:
        return 'Closing anytime';
    }
  }

  getSalaryRangesCount = index => {
    let totalCount = 0;
    let salaryType = 'Unspecified';

    const { filters = {} } = this.props;
    const { salaryFilterType } = this.state;
    const { salary_annually } = filters;
    let filterAnnual, filterAnnualEnd;
    let arr = [];

    if (index === 0) {
      filterAnnual = salary_annually.filter(function (el) {
        const baseValue = 50000;
        arr = el.value.split('-');
        return (parseInt(arr[0]) < baseValue && parseInt(arr[0]) > 0) && (parseInt(arr[1]) < baseValue && parseInt(arr[1]) > 0);
      });
      filterAnnual.forEach(function (arrayItem) {
        totalCount = totalCount + arrayItem.count;
      });

      salaryType = salaryFilterType === 0 ? 'Below $50,000' : 'Below $24';
    } else if (index === 6) {
      filterAnnual = salary_annually.filter(function (el) {
        arr = el.value.split('-');
        return (parseInt(arr[0]) === 0 ) && (parseInt(arr[1]) === 0);
      });
      filterAnnual.forEach(function (arrayItem) {
        totalCount = totalCount + arrayItem.count;
      });

      salaryType = 'Unspecified';
    } else {
      let lowerBound = index * 10000; 
      // const upperBound = lowerBound + 20000;

      filterAnnual = salary_annually.filter(function (el) {
        arr = el.value.split('-');
        return (parseInt(arr[0]) >= lowerBound ) || (parseInt(arr[1]) >= lowerBound);
        // return el.value > lowerBound && el.value <= upperBound;
      });
      filterAnnual.forEach(function (arrayItem) {
        totalCount = totalCount + arrayItem.count;
      });

      lowerBound = salaryFilterType === 0 ? lowerBound : Math.floor(lowerBound/2080);
      const lowerBoundFormat = lowerBound.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      salaryType = `$${lowerBoundFormat}+`;
    }

    return { type: salaryType, count: totalCount };
  }

  compileFilters() {
    const composeTypesList = [
      { name: 'Full time (Employee)', count: this.getTypeCount('Full time (Employee)') },
      { name: 'Full time (Contract)', count: this.getTypeCount('Full time (Contract)') },
      { name: 'Full time (Intern)', count: this.getTypeCount('Full time (Intern)') },
      { name: 'Full time (Volunteer)', count: this.getTypeCount('Full time (Volunteer)') },
      { name: 'Part time (Employee)', count: this.getTypeCount('Part time (Employee)') },
      { name: 'Part time (Contract)', count: this.getTypeCount('Part time (Contract)') },
      { name: 'Part time (Intern)', count: this.getTypeCount('Part time (Intern)') },
      { name: 'Part time (Volunteer)', count: this.getTypeCount('Part time (Volunteer)') },
    ];

    const composeWorkTypesList = [
      { name: 'Schedule (M-F) - Onsite', count: this.getWorkTypeCount('Schedule (M-F) - Onsite') },
      { name: 'Schedule (M-F) - Remote', count: this.getWorkTypeCount('Schedule (M-F) - Remote') },
    ]

    const composeDateTypes = [
      { type: 'Today', count: this.getDatesCount(1)},
      { type: 'Tomorrow', count: this.getDatesCount(2)},
      { type: 'This week', count: this.getDatesCount(3)},
      { type: 'Next week', count: this.getDatesCount(4)},
      { type: 'In two weeks', count: this.getDatesCount(5)},
      { type: 'In a month', count: this.getDatesCount(6)},
      { type: 'In 30 days+', count: this.getDatesCount(7)},
    ];

    let composeAnnualSalaryTypes = [];
    let salaryFilterCount = this.getSalaryRangesCount(0);
    if (salaryFilterCount.count > 0) {
      composeAnnualSalaryTypes.push(salaryFilterCount);
    }
    let start = 5;
    while (start <= 13) {
      salaryFilterCount = this.getSalaryRangesCount(start);
      if (salaryFilterCount.count > 0) {
        composeAnnualSalaryTypes.push(salaryFilterCount);
      }
      start = start + 2;
    }
    salaryFilterCount = this.getSalaryRangesCount(6);
    if (salaryFilterCount.count > 0) {
      composeAnnualSalaryTypes.push(salaryFilterCount);
    }

    // filter date types empty objects
    const filterDateTypes = composeDateTypes.filter(function (el) {
      return el.count > 0 ;
    });

    // filter date types empty objects
    const filterTypesList = composeTypesList.filter(function (el) {
      return el.count > 0 ;
    });

    const filterWorkTypesList = composeWorkTypesList.filter(function (el) {
      return el.count > 0 ;
    });

    this.setState({
      typesList: filterTypesList,
      dateTypes: filterDateTypes,
      workTypesList: filterWorkTypesList,
      annualSalaryTypes: composeAnnualSalaryTypes,
    }, () => {
      //Set Cookies
      const { location, filters } = this.props;
      const filterCookie = {
        ...filters,
        location: location,
      };
      Cookies.set('filters', filterCookie, { expires: 365, path: '/' });
    });

    
  }

  sortByChange (e, sort) {
    const { updateSortBy, urlDetails } = this.props;
    e.preventDefault();
    updateSortBy(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: '/',
      query: { ...urlDetails.query, sort: sort }
    });
  }

  jobTypeChange (e, sort) {
    const { updateJobType, urlDetails } = this.props;
    e.preventDefault();
    updateJobType(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: '/',
      query: { ...urlDetails.query, jobtype: sort }
    });
  }

  workTypeChange (e, sort) {
    const { updateWorkType, urlDetails } = this.props;
    e.preventDefault();
    updateWorkType(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: '/',
      query: { ...urlDetails.query, worktype: sort }
    });
  }

  closeDateChange (e, sort) {
    const { updateCloseDate, urlDetails } = this.props;
    e.preventDefault();
    updateCloseDate(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: '/',
      query: { ...urlDetails.query, closedate: sort }
    });
  }

  salaryEstimateChange (e, sort) {
    const { updateEstimateType, urlDetails } = this.props;
    e.preventDefault();
    updateEstimateType(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: '/',
      query: { ...urlDetails.query, salary: sort }
    });
  }

  toggleSalaryFilterType (e, value) {
    e.preventDefault();
    this.setState({
      salaryFilterType: value,
    });
    document.getElementById("salaryFilterDiv").classList.add('show');
    document.getElementById("salaryFilterContent").classList.add('show');
    this.compileFilters();
  }

  toggleMobileFilter (e) {
    e.preventDefault();
    this.setState({
      showMobileFilters: !this.state.showMobileFilters,
    });
  }

  toggleNone (e) {

  }

  resetFilters = () => {
    const { resetFilterSorting } = this.props;
    resetFilterSorting({ sortBy: 0, jobType: 'All job types', workType: 'All work types', closeDate: 'Closing anytime', salaryEstimate: 'All salary estimates'});
  }

  render() {

    const { salaryFilterType, typesList, workTypesList, dateTypes, annualSalaryTypes, showMobileFilters } = this.state;

    const jobTypesList = typesList.map(function(type, index){
      return <a key={index} onClick={(e) => type.count != '-' ? this.jobTypeChange(e, type.name) : false } className={ type.count > 0 ? 'dropdown-item' : 'dropdown-item no-data' }>{type.name} <span className="filter-property-count float-right text-center">{ type.count > 0 ? type.count : '-'}</span></a>;
    }.bind(this));

    const allWorkTypesList = workTypesList.map(function(type, index){
      return <a key={index} onClick={(e) => type.count != '-' ? this.workTypeChange(e, type.name) : false } className={ type.count > 0 ? 'dropdown-item' : 'dropdown-item no-data' }>{type.name.split(" - ")[1]} <span className="filter-property-count float-right text-center">{ type.count > 0 ? type.count : '-'}</span></a>;
    }.bind(this));

    const dateTypesList = dateTypes.map(function(date, index){
      return <a key={index} onClick={(e) => date.count > 0 ? this.closeDateChange(e, date.type) : false } className={ date.count > 0 ? 'dropdown-item' : 'dropdown-item no-data' }>{date.type} <span className="filter-property-count float-right text-center">{ date.count > 0 ? date.count : '-' }</span></a>;
    }.bind(this));

    const annualSalaryList = annualSalaryTypes.map(function(salary, index){
      return <a key={index} onClick={(e) => salary.count > 0 ? this.salaryEstimateChange(e, salary.type) : false } className={ salary.count > 0 ? 'dropdown-item' : 'dropdown-item no-data' }>{salary.type} <span className="filter-property-count float-right text-center">{salary.count > 0 ? salary.count : '-'}</span></a>
    }.bind(this));

    const { filters, jobCount } = this.props;
    const sortBy = filters.sortBy === 0 ? 'Relevance' : 'Date';

    const searchResult = jobCount > 100 ? `Showing ${jobCount}+ results` : `Showing ${jobCount} results`;

    // mobile filters
    const jobTypesMobileList = typesList.map(function(type, index){
      return <li key={index} onClick={(e) => type.count != '-' ? this.jobTypeChange(e, type.name) : false } >{type.name} <span className="filter-property-count float-right text-center">{ type.count > 0 ? type.count : '-'}</span></li>;
    }.bind(this));

    const workTypesMobileList = workTypesList.map(function(type, index){
      return <li key={index} onClick={(e) => type.count != '-' ? this.workTypeChange(e, type.name) : false } >{type.name.split(" - ")[1]} <span className="filter-property-count float-right text-center">{ type.count > 0 ? type.count : '-'}</span></li>;
    }.bind(this));

    const dateTypesMobileList = dateTypes.map(function(date, index){
      return <li key={index} onClick={(e) => date.count > 0 ? this.closeDateChange(e, date.type) : false } >{date.type} <span className="filter-property-count float-right text-center">{ date.count > 0 ? date.count : '-' }</span></li>;
    }.bind(this));

    const annualSalaryMobileList = annualSalaryTypes.map(function(salary, index){
      return <li key={index} onClick={(e) => salary.count > 0 ? this.salaryEstimateChange(e, salary.type) : false } >{salary.type} <span className="filter-property-count float-right text-center">{salary.count > 0 ? salary.count : '-'}</span></li>
    }.bind(this));

    return (
      <div className="find-jobs-filters">
        <div className="filters-container row mx-auto">
          <div className="filters-control-mobile-tab">
            <div className="result-header-mobile-tab float-left">{ searchResult }</div>
            <button className="filters-button-mobile-tab float-right" onClick={(e) => this.toggleMobileFilter(e)}>Filters ></button>
          </div>

          <div className="filter-item-desktop">
            <button className="filter-item-button btn dropdown-toggle" type="button" id="allJobTerms" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              { filters.closeDate }
            </button>
            <div className="dropdown-menu dropdown-closing-time" aria-labelledby="allJobTerms">
              <a className="dropdown-item" onClick={(e) => this.closeDateChange(e, 'Closing anytime')}>Closing anytime</a>
              { dateTypesList }
            </div>
          </div>
          <div className="filter-item-desktop">
            <button className="filter-item-button btn dropdown-toggle" type="button" id="allJobTitles" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              { filters.jobType }
            </button>
            <div className="dropdown-menu dropdown-job-types" aria-labelledby="allJobTitles">
              <a className="dropdown-item" onClick={(e) => this.jobTypeChange(e, 'All job types')}>All job types</a>
              { jobTypesList }
            </div>
          </div>
          <div className="filter-item-desktop">
            <button className="filter-item-button btn dropdown-toggle" type="button" id="allWorkTitles" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              { filters.workType !== 'All work types' ? filters.workType.split(" - ")[1] : filters.workType }
            </button>
            <div className="dropdown-menu dropdown-job-types" aria-labelledby="allWorkTitles">
              <a className="dropdown-item" onClick={(e) => this.workTypeChange(e, 'All work types')}>All work types</a>
              { allWorkTypesList }
            </div>
          </div>
          <div id="salaryFilterDiv" className="filter-item-desktop">
            <button className="filter-item-button btn dropdown-toggle" type="button" id="allSalaryEstimates" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              { filters.salaryEstimate }
            </button>
            <div id="salaryFilterContent" className="dropdown-menu dropdown-salary-estimates" aria-labelledby="allSalaryEstimates">
              <div className="range-toggle">
                <button onClick={(e) => this.toggleSalaryFilterType(e, 0) } className={ salaryFilterType === 0 ? 'range-toggle-option active' : 'range-toggle-option' }>Annually</button>
                <button onClick={(e) => this.toggleSalaryFilterType(e, 1) } className={ salaryFilterType === 1 ? 'range-toggle-option active' : 'range-toggle-option' }>Hourly</button>
              </div>
              <a className="dropdown-item" onClick={(e) => this.salaryEstimateChange(e, 'All salary estimates')}>All salary estimates</a>
              { annualSalaryList }
            </div>
          </div>
          {/*<div className="filter-item-desktop ml-auto">*/}
          {/*  <span className="filter-label">Sort by</span>*/}
          {/*  <button className="filter-item-button has-border btn dropdown-toggle" type="button" id="allSalaryEstimates" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">*/}
          {/*    { sortBy }*/}
          {/*  </button>*/}
          {/*  <div className="dropdown-menu" aria-labelledby="allSalaryEstimates">*/}
          {/*    <a className="dropdown-item" onClick={(e) => this.sortByChange(e, 0)}>Relevance</a>*/}
          {/*    <a className="dropdown-item" onClick={(e) => this.sortByChange(e, 1)}>Date</a>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div  className="filter-item-desktop" style={{boxShadow: "0 1px 3px 0 rgba(168, 168, 168, 0.12)", border:"solid 1px #e6e6e6", borderRadius: "16px"}}>
            <button onClick={this.resetFilters} className="filter-item-button btn" type="button">
              Reset filters
            </button>
          </div>
        </div>

        { showMobileFilters &&
          <div className="mobile-filters-ui">
            <div className="filters-header">
                <div className="title float-left">Filters</div>
                <div className="close float-right" onClick={(e) => this.toggleMobileFilter(e)}>x</div>
            </div>
            <div className="filters-list-wrapper">
              <div className="filter-item">
                <div className="filter-name collapsed" onClick={this.toggleNone} data-toggle="collapse" href="#closingTimeSelect" role="button" aria-expanded="false" aria-controls="closingTimeSelect">
                { filters.closeDate }
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6">
                        <path fill="#777" fillRule="nonzero" d="M0 0l5.475 5.457L10.951 0z"/>
                    </svg>
                </div>
                <div className="collapse filter-select-items-wrapper" id="closingTimeSelect">
                    <ul className="filter-select-list">
                        <li onClick={(e) => this.closeDateChange(e, 'Closing anytime')}>Closing anytime</li>
                        { dateTypesMobileList }
                    </ul>
                </div>
              </div>
              <div className="filter-item">
                <div className="filter-name collapsed" onClick={this.toggleNone} data-toggle="collapse" href="#jobTermSelect" role="button" aria-expanded="false" aria-controls="jobTermSelect">
                { filters.jobType }
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6">
                        <path fill="#777" fillRule="nonzero" d="M0 0l5.475 5.457L10.951 0z"/>
                    </svg>
                </div>
                <div className="collapse filter-select-items-wrapper" id="jobTermSelect">
                    <ul className="filter-select-list">
                        <li onClick={(e) => this.jobTypeChange(e, 'All job types')}>All job types</li>
                        { jobTypesMobileList }
                    </ul>
                </div>
            </div>
              <div className="filter-item">
                <div className="filter-name collapsed" onClick={this.toggleNone} data-toggle="collapse" href="#workSelect" role="button" aria-expanded="false" aria-controls="workSelect">
                  { filters.workType !== 'All work types' ? filters.workType.split(" - ")[1] : filters.workType }

                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6">
                        <path fill="#777" fillRule="nonzero" d="M0 0l5.475 5.457L10.951 0z"/>
                    </svg>
                </div>
                <div className="collapse filter-select-items-wrapper" id="workSelect">
                    <ul className="filter-select-list">
                        <li onClick={(e) => this.workTypeChange(e, 'All work types')}>All work types</li>
                        { workTypesMobileList }
                    </ul>
                </div>
            </div>
            <div className="filter-item">
                <div className="filter-name collapsed" onClick={this.toggleNone} data-toggle="collapse" href="#salarySelect" role="button" aria-expanded="false" aria-controls="salarySelect">
                { filters.salaryEstimate }
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6">
                        <path fill="#777" fillRule="nonzero" d="M0 0l5.475 5.457L10.951 0z"/>
                    </svg>
                </div>
                <div className="collapse filter-select-items-wrapper" id="salarySelect">
                    <div className="range-toggle">
                        <button onClick={(e) => this.toggleSalaryFilterType(e, 0) } className={ salaryFilterType === 0 ? 'range-toggle-option active' : 'range-toggle-option' }>Annually</button>
                        <button onClick={(e) => this.toggleSalaryFilterType(e, 1) } className={ salaryFilterType === 1 ? 'range-toggle-option active' : 'range-toggle-option' }>Hourly</button>
                    </div>
                    <ul className="filter-select-list">
                        <li onClick={(e) => this.salaryEstimateChange(e, 'All salary estimates')}>All salary estimates</li>
                        { annualSalaryMobileList }
                    </ul>
                </div>
            </div>
            <hr />
            {/*<div className="filter-item">*/}
            {/*    <label>Sort by</label>*/}
            {/*    <div className="filter-name collapsed" onClick={this.toggleNone} data-toggle="collapse" href="#sortbySelect" role="button" aria-expanded="false" aria-controls="sortbySelect">{ sortBy }*/}
            {/*        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6">*/}
            {/*            <path fill="#777" fillRule="nonzero" d="M0 0l5.475 5.457L10.951 0z"/>*/}
            {/*        </svg>*/}
            {/*    </div>*/}
            {/*    <div className="collapse filter-select-items-wrapper" id="sortbySelect">*/}
            {/*        <ul className="filter-select-list">*/}
            {/*            <li onClick={(e) => this.sortByChange(e, 0)}>Relevance</li>*/}
            {/*            <li onClick={(e) => this.sortByChange(e, 1)}>Date</li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div  className="filter-item">
              <button onClick={this.resetFilters} className="filter-name" type="button">
                Reset filters
              </button>
            </div>

            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { posts, app } = state;

  return {
    filters: posts.facets,
    jobCount: posts.count,
    location: app.location,
  };
};

const mapDispatchToProps = dispatch => ({
  updateSortBy: (sort) => dispatch(changeSortBy(sort)),
  updateCloseDate: (type) => dispatch(changeClosingDate(type)),
  updateJobType: (type) => dispatch(changeJobType(type)),
  updateWorkType: (type) => dispatch(changeWorkType(type)),
  updateEstimateType: (type) => dispatch(changeSalaryEstimate(type)),
  resetFilterSorting: (data) => dispatch(resetSorting(data)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(JobFilters)
);

