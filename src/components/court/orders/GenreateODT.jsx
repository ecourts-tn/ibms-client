import React from "react";
import { saveAs } from "file-saver";

const GenerateODT = () => {
  const createODT = () => {
    const content = `
      <office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0">
        <office:body>
          <office:text>
            <text:p>Hello, this is an ODT file created in React!</text:p>
          </office:text>
        </office:body>
      </office:document-content>
    `;

    const blob = new Blob([content], { type: "application/vnd.oasis.opendocument.text" });
    saveAs(blob, "example.odt");
  };

  return (
    <button onClick={createODT}>
      Generate ODT
    </button>
  );
};

export default GenerateODT;
