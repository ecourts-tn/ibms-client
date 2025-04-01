import axios from "axios";
import React, { useState } from "react";

const FingerPrintCapture = () => {
  const [fingerprintData, setFingerprintData] = useState(null);

  const captureFingerprint = async () => {
    try {
      // Example SDK API call to capture the fingerprint
      const fingerprint = await window.FingerprintSDK.capture();
      setFingerprintData(fingerprint);
    } catch (error) {
      console.error("Error capturing fingerprint:", error);
    }
  };

  const uploadFingerprint = async () => {
    if (!fingerprintData) {
      alert("No fingerprint data to upload!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload-fingerprint/", {
        fingerprint: fingerprintData,
      });
      console.log("Fingerprint uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading fingerprint:", error);
    }
  };

  return (
    <div className="row">
        <div className="col-md-6">
            <button onClick={captureFingerprint} className="btn btn-secondary btn-sm">Capture Fingerprint</button>
            {/* <button onClick={uploadFingerprint}>Upload Fingerprint</button> */}
        </div>
        <div className="col-md-6">
            {fingerprintData && (
                <>
                    <h6><strong>Fingerprint Data</strong></h6>
                    <pre>{JSON.stringify(fingerprintData, null, 2)}</pre>
                </>
            )}
        </div>
    </div>
  );
};

export default FingerPrintCapture;
