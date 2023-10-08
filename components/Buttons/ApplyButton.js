import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ApplyButton extends Component {

  constructor (props) {
    super(props);
    this.state = {
      status: 'initial',
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      submitting,
      resetAfterComplete,
      buttonMessageTimeout,
    } = this.props;

    if (!submitting && nextProps.submitting) {
      this.setState({ status: 'working' });
    } else if (submitting && !nextProps.submitting) {
      if (nextProps.submitFailed) {
        this.setState({ status: 'fail' });
      } else if (nextProps.submitSucceeded) {
        this.setState({ status: 'success' });
      }
      if (resetAfterComplete || nextProps.resetAfterComplete) {
        this.timer = setTimeout(() => {
          this.setState({ status: 'initial' });
        }, buttonMessageTimeout);
      }
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  doClick = e => {
    e.preventDefault();
    if (this.props.handleClick) {
      this.props.handleClick();
    }
  }

  render() {
    const {
      btnType,
      img,
      disabled,
      text,
      errorText,
      btnState,
      size,
    } = this.props;

    const { status } = this.state;

    let buttonText;
    if (status === 'working') {
      buttonText = (
        <span>...</span>
      );
    } else if (status === 'success') {
      buttonText = (
        <span>Success!</span>
      );
    } else if (status === 'fail') {
      buttonText = (
        <span>{ errorText }</span>
      );
    }  else {
      buttonText = (
        <span>{ text }</span>
      );
    }


    let btnCss = classNames({
      'btn': true,
      'apply-button': btnState === 'apply' || btnState === 'applied',
      'applied': btnState === 'applied',
      'large': size === 'large',
    });

    let btnContents = buttonText;

    if (btnState === 'applied' && !disabled) {
      btnContents = (
        <span>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path fill="#0FBB85" fillRule="nonzero" d="M8 0C3.564 0 0 3.564 0 8s3.564 8 8 8 8-3.564 8-8-3.564-8-8-8zm4.618 5.49L6.8 11.528a.33.33 0 0 1-.255.11c-.109 0-.218-.037-.254-.11L3.455 8.473 3.382 8.4a.393.393 0 0 1-.11-.255c0-.072.037-.181.11-.254l.509-.51a.352.352 0 0 1 .509 0l.036.037 2 2.146a.176.176 0 0 0 .255 0l4.873-5.055h.036a.352.352 0 0 1 .51 0l.508.51c.146.108.146.326 0 .472z"/>
          </svg>
          { btnContents }
        </span>
      );
    }

    return (
      <button 
        className={ btnCss }
        type="submit"
        disabled={ disabled }
        onClick={ this.doClick }
      >
        { btnContents }
      </button>
    );
  }
}

ApplyButton.propTypes = {
  img: PropTypes.string,
  submitFailed: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  submitSucceeded: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  submitting: PropTypes.bool,
  errorText: PropTypes.string,
  text: PropTypes.string,
  btnType: PropTypes.string,
  handleClick: PropTypes.func,
  disabled: PropTypes.bool,
  resetAfterComplete: PropTypes.bool,
  buttonMessageTimeout: PropTypes.number,
  btnState: PropTypes.string,
  size: PropTypes.string,
};

ApplyButton.defaultProps = {
  disabled: false,
  resetAfterComplete: true,
  errorText: 'Save failed',
  buttonMessageTimeout: 1000,
  submitFailed: false,
  submitSucceeded: false,
  btnState: 'apply',
  size: 'default',
};

export default ApplyButton;
