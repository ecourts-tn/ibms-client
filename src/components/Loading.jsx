import React from 'react';
import './Loading.css'; // Add custom styles

const Loading = () => {
  return (
    <div className="loading-overlay">
      <img 
        src={`${process.env.PUBLIC_URL}/images/spinner.webp`}
        alt="Loading..." 
        className="loading-spinner" 
      />
    </div>
  );
};

export default Loading;
