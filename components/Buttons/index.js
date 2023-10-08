import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class SubmitButton extends Component {

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

    // let btnCss;
    // if (btnState === 'apply') {
    //   btnCss = 'btn apply-button';
    // } else if (btnState === 'applied') {
    //   btnCss = 'btn applied apply-button';
    // } else if (btnState === 'save') {
    //   btnCss = 'btn save-button';
    // } else if (btnState === 'saved') {
    //   btnCss = 'btn save-button saved';
    // } else {
    //   btnCss = 'btn';
    // }

    let btnCss = classNames({
      'btn': true,
      'apply-button': btnState === 'apply' || btnState === 'applied',
      'applied': btnState === 'applied',
      'save-button': btnState === 'save' || btnState === 'saved',
      'saved': btnState === 'saved',
      'large': size === 'large',
    });

    let btnContents = buttonText;

    if (btnState === 'applied') {
      btnContents = (
        <span>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path fill="#0FBB85" fillRule="nonzero" d="M8 0C3.564 0 0 3.564 0 8s3.564 8 8 8 8-3.564 8-8-3.564-8-8-8zm4.618 5.49L6.8 11.528a.33.33 0 0 1-.255.11c-.109 0-.218-.037-.254-.11L3.455 8.473 3.382 8.4a.393.393 0 0 1-.11-.255c0-.072.037-.181.11-.254l.509-.51a.352.352 0 0 1 .509 0l.036.037 2 2.146a.176.176 0 0 0 .255 0l4.873-5.055h.036a.352.352 0 0 1 .51 0l.508.51c.146.108.146.326 0 .472z"/>
          </svg>
          { btnContents }
        </span>
      );
    }

    if (btnState === 'saved') {
      btnContents = (
        <span>
          <svg width="9" height="16" viewBox="0 0 9 16">
            <g fill="#FFBA00" fillRule="nonzero">
                <path d="M1.057 15.738L4.5 12l3.443 3.738a.552.552 0 0 0 .414.185.666.666 0 0 0 .229-.046.627.627 0 0 0 .357-.585V.708c0-.354-.257-.631-.586-.631H.643c-.329 0-.586.277-.586.63v14.585c0 .262.143.477.357.585a.558.558 0 0 0 .643-.139z"/>
                <path d="M7.757 1.338V13.77L4.9 10.662a.552.552 0 0 0-.414-.185c-.157 0-.3.061-.415.185l-2.857 3.107V1.34h6.543z"/>
            </g>
          </svg>
          { btnContents }
        </span>
      );
    }

    if (btnState === 'save') {
      btnContents = (
        <span>
          <svg width="9" height="16" viewBox="0 0 9 16">
              <path fill="#317EFF" fillRule="nonzero" d="M1.057 15.738L4.5 12l3.443 3.738a.552.552 0 0 0 .414.185.666.666 0 0 0 .229-.046.627.627 0 0 0 .357-.585V.708c0-.354-.257-.631-.586-.631H.643c-.329 0-.586.277-.586.63v14.585c0 .262.143.477.357.585a.558.558 0 0 0 .643-.139zm6.7-14.4V13.77L4.9 10.662a.552.552 0 0 0-.414-.185c-.157 0-.3.061-.415.185l-2.857 3.107V1.34h6.543z"/>
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

SubmitButton.propTypes = {
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

SubmitButton.defaultProps = {
  disabled: false,
  resetAfterComplete: true,
  errorText: 'Save failed',
  buttonMessageTimeout: 1000,
  submitFailed: false,
  submitSucceeded: false,
  btnState: 'apply',
  size: 'default',
};

export default SubmitButton;
