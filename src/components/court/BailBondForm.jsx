import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BailBondForm = () => {
  const generatePDF = () => {
    const input = document.getElementById('bail-bond-form');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('bail-bond-form.pdf');
    });
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="container bg-white">
          <div id="bail-bond-form" style={{ padding: 20 }}>
            <h3>FORM No. 3 BOND AND BAIL-BOND AFTER ARREST UNDER A WARRANT</h3>
            <p>(See section 83)</p>
            <p>IN THE COURT OF THE <b>COURT NAME</b></p>
            <p><b>[Police Station Name]</b></p>
            <p><b>[Crime No]</b></p>
            <p><b>[Crime Year]</b></p>
            <p><b>[BAIL CASE NO]</b> <b>[ORDER DATE]</b></p>
            <p>
              I, <b>[Name of Accused]</b> <b>[Relation Type]</b> <b>[Relation Name]</b> being brought before the <b>[Judge Designation]</b> <b>[Court Location]</b> under a warrant issued to compel my appearance to answer to the charge of <b>[Accused Section]</b>, do hereby bind myself to attend in the Court of on the day of next hearing, to answer to the said charge, and to continue so to attend until otherwise directed by the Court; and, in case of my making default herein, I bind myself to forfeit, to Government, the sum of rupees <b>[SURETY AMOUNT]</b>.
            </p>
            <p>
              Dated, this <b>[DD]</b> day of <b>[MONTH]</b>, <b>[Year]</b>.
            </p>
            <p>(Signature / Thumb)</p>
            <p>
              I/ We <b>[Suety Name 1]</b> <b>[Surety Relation type]</b> <b>[Surety Relation Name]</b> <b>[Suety Name 2]</b> <b>[Surety Relation type]</b> <b>[Surety Relation Name]</b> do hereby declare myself surety for the above-named of that he shall attend before in the Court of on the day of next hearing date, to answer to the charge on which he has been arrested, and shall continue so to attend until otherwise directed by the Court; and, in case of his making default therein, I bind myself to forfeit, to Government, the sum of rupees <b>[Surety Amount]</b>.
            </p>
            <p>
              Dated, this <b>[DD]</b> day of <b>[MONTH]</b>, <b>[Year]</b>.
            </p>
            <p>Photo</p>
            <p>Thumb/ Signature</p>
            <p>Photo</p>
            <p>Thumb/ Signature</p>
            <p>Condition:</p>
            <p><b>[Condition Details]</b></p>
            <p>Remarks:</p>
            <p><b>[Remarks]</b></p>
            <p><b>[JUDGE DESIGNATION]</b></p>
            <p><b>[COURT NAME]</b></p>
            <p><b>[PLACE]</b></p>
          </div>
        </div>
      </div>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default BailBondForm;
