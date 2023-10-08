import React from 'react';

const LoadingCard = ({times}) => {
  var numberOfTimes = [];

  for(var i=0;i<times;i++) {
        numberOfTimes.push(
          (<div key={i} className="result-card loading">
            <div className="result-company-logo animated-background"></div>
              <div className="card-text-content">
                <div className="result-card-header">
                  <div className="job-title animated-background"></div>
                  <div className="job-company-location animated-background"></div>
                  <div className="job-salary-range animated-background"></div>
                </div>
                <div className="result-card-ui-actions">
                  <div className="timestamp animated-background"></div>
                </div>
                <div className="result-card-description">
                    <div className="result-loading-line animated-background"></div>
                    <div className="result-loading-line animated-background"></div>
                    <div className="result-loading-line animated-background"></div>
                </div>
              </div>
            </div>)
          );  
    }
  return (
    <div>
      { numberOfTimes }
    </div>
  );
};

export default LoadingCard;
