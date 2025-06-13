import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  // Capture the photo from webcam
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  // Upload the photo to the Django backend
  const uploadPhoto = async () => {
    if (!image) return;

    // Convert base64 image to a Blob
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();

    // Create FormData and append the image
    const formData = new FormData();
    formData.append("image", blob, "captured_image.jpg");

    // Send POST request to Django backend
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload-image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="row">
        <div className="col-md-6">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={600}
                videoConstraints={{
                width:1400,
                height: 820,
                facingMode: "user",
                }}
                className="img-thumbnail"
            />
            <div className="text-center">
                <button onClick={capturePhoto} className="btn btn-secondary btn-sm">Capture Photo</button>
            </div>
        </div>
        <div className="col-md-6">
            {image && ( 
                <React.Fragment>
                    <img src={image} alt="Captured" className="img-thumbnail"/>
                    <p className="text-success text-center"><strong>Photo captured successfully</strong></p>
                </React.Fragment>
            )}
        </div>     
    </div>
  );
};

export default WebcamCapture;
