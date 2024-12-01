import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const BailBond = () => {
  const generateODT = async () => {
    const zip = new JSZip();

    // Add the ODT content structure
    const contentXml = `
      <office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
        xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
        xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
        xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
        xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0">
        <office:automatic-styles>
        <style:style style:name="center" style:family="paragraph">
          <style:paragraph-properties fo:text-align="center" />
        </style:style>
        <style:style style:name="right" style:family="paragraph">
          <style:paragraph-properties fo:text-align="right" />
        </style:style>
      </office:automatic-styles>
        <office:body>
          <office:text>
            <text:p text:style-name="center">BOND AND BAIL-BOND AFTER ARREST UNDER A WARRANT</text:p>
            <text:p text:style-name="center">IN THE COURT OF THE COURT NAME</text:p>
            <text:p>[Police Station Name]</text:p>
            <text:p>[Crime No]</text:p>
            <text:p>[Crime Year]</text:p>
            <text:p>[BAIL CASE NO ][ORDER DATE]</text:p>
            <text:p>
              
                I, [Name of Accused ] [Relation Type][Relation Name ] being brought before the [Judge Designation][ Court Location]
                under a warrant issued to compel my appearance to answer to the charge of [ Accused Section ], do hereby bind myself
                to attend in the Court of on the day of next hearing, to answer to the said charge, and to continue so to attend until
                otherwise directed by the Court; and, in case of my making default herein, I bind myself to forfeit, to Government, the
                sum of rupees [ SURETY AMOUNT ].
              
            </text:p>
            <text:p>Dated, this [ DD ]day of [MONTH ] ,[Year] .</text:p>
            <text:p text:style-name="right">(Signature / Thumb)</text:p>
            <text:p>
              
                I/ We [[Suety Name 1 ][Surety Relation type][Surety Relation Name ]]
                [[Suety Name 2 ][Surety Relation type][Surety Relation Name ]] do hereby declare myself surety for the above-named of
                that he shall attend before in the Court of on the day of next hearing date, to answer to the charge on which he has
                been arrested, and shall continue so to attend until otherwise directed by the Court; and, in case of his making default
                therein, I bind myself to forfeit, to Government, the sum of rupees [ Surety Amount ].
              
            </text:p>
            <text:p>Dated, this [ DD ]day of [MONTH ] ,[Year] .</text:p>
            <text:p>Photo</text:p>
            <text:p text:style-name="right">Thumb/ Signature</text:p>
            <text:p>Condition:</text:p>
            <text:p>[Condition Details]</text:p>
            <text:p>[Remarks]</text:p>
            <text:p>[JUDGE DESIGNATION]</text:p>
            <text:p>[COURT NAME]</text:p>
            <text:p>[PLACE]</text:p>
          </office:text>
        </office:body>
      </office:document-content>
    `;

    // Add content.xml and required files
    zip.file("content.xml", contentXml);
    zip.file("mimetype", "application/vnd.oasis.opendocument.text");
    zip.file("META-INF/manifest.xml", `
      <manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
        <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.text" manifest:full-path="/" />
        <manifest:file-entry manifest:media-type="text/xml" manifest:full-path="content.xml" />
      </manifest:manifest>
    `);

    // Generate the ODT file
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "BailBond.odt");
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <button onClick={generateODT}>Generate ODT</button>
      </div>
    </div>
  );
};

export default BailBond;
