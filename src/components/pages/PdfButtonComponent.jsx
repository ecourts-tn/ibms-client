// PdfButtonComponent.jsx
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PdfButtonComponent = ({ contentRef }) => {
  const generatePdf = async () => {
    const content = contentRef.current;
    if (content) {
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("download.pdf");
    } else {
      console.log("No content found to generate PDF");
    }
  };

  return <button onClick={generatePdf}>Download PDF</button>;
};

export default PdfButtonComponent;
