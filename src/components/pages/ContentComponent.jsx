// ContentComponent.jsx
import React, { forwardRef } from "react";

const ContentComponent = forwardRef((props, ref) => {
  return (
    <div ref={ref} style={{ padding: 20 }}>
      <h2>Dynamic Content for PDF</h2>
      <p>{props.data}</p>
      {/* Add more dynamic content here */}
    </div>
  );
});

export default ContentComponent;
