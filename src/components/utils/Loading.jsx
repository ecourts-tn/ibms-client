import React from 'react';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <img 
        src={`${process.env.PUBLIC_URL}/images/loader.gif`}
        alt="Loading..." 
        className="loading-spinner" 
      />
    </div>
  );
};

export default Loading;
