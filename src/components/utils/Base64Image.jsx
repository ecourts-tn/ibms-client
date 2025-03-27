import React from 'react'

const Base64Image = () => {
    const base64Prefix = 'data:image/png;base64,';
    const imageSrc = base64String.startsWith(base64Prefix)
      ? base64String
      : base64Prefix + base64String;
    return <img src={imageSrc} alt="Base64 encoded" />
}

export default Base64Image

