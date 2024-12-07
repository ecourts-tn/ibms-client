import React, { useEffect, useState } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";
import Button from '@mui/material/Button'

// Convert pt to px function
const ptToPx = (pt) => {
  return pt * 1.333;
};

const GenerateStyledDocx = ({order}) => {
  const {petition, litigants} = order

    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
//   const [courtData, setCourtData] = useState(null); // State for fetched data

//   // Fetch data using Axios (replace with your own API endpoint)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://your-api-endpoint.com/data");
//         setCourtData(response.data);  // Assuming data contains dynamic values for the document
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, []); // Empty dependency array means this runs once when the component mounts

  // Handle document download
  const handleDownload = async () => {
    // if (!courtData) {
    //   alert("Data is still loading, please try again.");
    //   return;
    // }
    try {
    const fontSize = 24; // Font size in half-points (12pt = fontSize in docx)
    const tableWidth = 100; // Table width in percentage
    const cellWidth = 50; // Cell width in percentage

    const fontSizePt = 24.5; // Example font size in pt
    const fontSizePx = ptToPx(fontSizePt); // Convert pt to px
    const data = [
        { id: "1.", title: "The petitioner is ordered to be released on bail on executing a bond for&nbsp; [AMOUNT][AMOUNT IN WORDS] {'{'}if surety required{'}'} (with two sureties for a like sum each to the satisfaction of the learned [Juridictional Court]" },
        { id: "2.", title: "The sureties shall affix their photographs and Left Thumb Impression in the surety bond and the Magistrate may obtain a copy of their Aadhaar card or Bank passbook to ensure their identity{'}'}" },
        { id: "3.", title: "The petitioner shall report and sign before the [Police station Name ] / learned [COURT NAME] daily at [TIMING]., for {'{'} [] days/ until further orders the shall make available himself for interrogation as and when required by the investigation Officer" },
        { id: "4.", title: "That the petitioner shall not tamper with evidence or witness either during investigation or trial" },
        { id: "5.", title: "That the petitioner shall not abscond either during investigation or trial" },
        { id: "6.", title: "That on breach of any of the aforesaid conditions, the learned Magistrate / Trial Court is entitled to take appropriate action against the petitioner in accordance with law as if the conditions have been imposed and the petitioner released on bail by the learned Magistrate/trial Court himself." },
        { id: "7.", title: "If the accused thereafter absconds, a fresh FIR can be registered U/S.229 A IPC." },
      ];

    // Create a new document with multiple paragraphs
    const doc = new Document({
      sections: [
        {
          children: [
            // First Paragraph
            new Paragraph({
              alignment: AlignmentType.CENTER, // Align text to the center
              spacing: {
                before: 240,
                after: 240,
                line: 300, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `In the Court of ${petition.court?.court_name}, ${petition.district?.district_name}`,
                  font: "Times New Roman",
                  size: fontSizePx,
                  bold: true,
                  underline: true,
                }),
              ],
            }),

            // Second Paragraph (Simulates Line Break)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 240,
                after: 240,
                line: 300, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `Present: Thiru. S. Karthikeyan, Judge, High Court, Chennai.`,
                  font: "Times New Roman",
                  size: fontSizePx,
                  bold: true,
                  underline: true,
                  break: 0,
                }),
              ],
            }),

            // Third Paragraph (Simulates Line Break)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 240,
                after: 240,
                line: 300, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `[DAY] 12 December 2024 12545/1254`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: true,
                }),
              ],
            }),

            // More paragraphs with dynamic data
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                before: 240,
                after: 240,
                line: 250, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `[PETITIONER NAME] `,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: false,
                  underline: false,
                }),
              ],
            }),

            // Simulating Centered text with dynamic case number
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                before: fontSize,
                after: 240,
                line: 250, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `[RELATION TYPE] . [RELATION NAME]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: false,
                  underline: false,
                }),
              ],
            }),

            // More dynamic content as required
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: {
                before: 240,
                after: 240,
                line: 250, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `:Petitioner / Accused.`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: false,
                  underline: false,
                }),
              ],
            }),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 240,
                after: 240,
                line: 250, // 1.5 line spacing
              },
              children: [
                new TextRun({
                  text: `-Vs- `,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: false,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 250, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `State of Tamilnadu Rep by [DESIGNATION]`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 250, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `[POLICESTATION NAME]`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `:Respondent/Complainant.`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `Petition in [CASE NO], [FILING DATE] filed [BAIL TYPE] Cr. P.C. prays to grant [CASE TYPE] to the petitioner in [FIR NO][FIR YEAR] in the file of [Police Station].`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `This petition is coming on this day for hearing before me, in the presence of [PRESENT PETITIONER ADVOCATE NAME(s)], Advocate(s) for the petitioner and [PROCECUTOR NAME], [PROCECUTOR DESIGNATION] for the respondent and upon hearing both side arguments, this Court passed the following:`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `ORDER`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: true,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `The petitioner/accused {'{'}Bail [was arrested and remanded to judicial custody on [Arrest Date]]{'}'} for the alleged offences [SECTION] [ACT], registered by respondent police, and seeks bail. <br /> The learned counsel for the petitioner/accused would submit that, <br />[GROUND 1]<br />[GROUND 2]`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `The learned Public Prosecutor would submit that <br />[PP REMARKS]`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `Heard both sides. [JUDGE REMARK]`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: false,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 350, // 1.5 line spacing
                    break: 1,
                  },
                children: [
                  new TextRun({
                    text: `In the result, this [CASE TYPE] is </strong><strong>Allowed {'{'}if condition true{'}'} (with following conditions</strong>)`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: true,
                    underline: false,
                    break: 1,
                  }),
                ],
            }),

            new Table({
                width: { size: tableWidth }, // Full-width table
                rows: [
                  // Header row
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: cellWidth },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                              before: 240,
                              after: 240,
                              line: 250, // 1.5 line spacing
                            },
                            children: [
                              new TextRun({
                                text: "S.no",
                                bold: true,
                                font: "Times New Roman",
                                size: fontSize,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: cellWidth },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                              before: 240,
                              after: 240,
                              line: 250, // 1.5 line spacing
                            },
                            children: [
                              new TextRun({
                                text: "Title",
                                bold: true,
                                font: "Times New Roman",
                                size: fontSize,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Data rows
                  ...data.map((item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: cellWidth },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              spacing: {
                                before: 240,
                                after: 240,
                                line: 250, // 1.5 line spacing
                              },
                              children: [
                                new TextRun({
                                  text: `${item.id}`,
                                  font: "Times New Roman",
                                  size: fontSize,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: cellWidth },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              spacing: {
                                before: 240,
                                after: 240,
                                line: 250, // 1.5 line spacing
                              },
                              children: [
                                new TextRun({
                                  text: `${item.title}`,
                                  font: "Times New Roman",
                                  size: fontSize,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  ),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                    before: 240,
                    after: 240,
                    line: 300, // 1.5 line spacing
                  },
                children: [
                  new TextRun({
                    text: `Pronounced by me in open court, this is the [DATE].`,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: true,
                    underline: false,
                  }),
                ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: {
                  before: 240,
                  after: 240,
                  line: 300, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `[JUDGE DESIGNATION], [DISTRICT]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 240,
                  after: 240,
                  line: 250, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `[DATE TIME]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 240,
                  after: 240,
                  line: 250, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `[COURT SEAL]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 240,
                  after: 240,
                  line: 250, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `Copy to :`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 200,
                  after: 200,
                  line: 180, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `1. [JURIDICTIONAL COURT]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 200,
                  after: 200,
                  line: 180, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `2. [PUBLIC PROCECUTOR]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 200,
                  after: 200,
                  line: 180, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `3. [RESPONDENTS]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 200,
                  after: 200,
                  line: 180, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `4. [JAIL]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: {
                  before: 200,
                  after: 200,
                  line: 180, // 1.5 line spacing
                },
              children: [
                new TextRun({
                  text: `5. [PETITIONER COUNCEL]`,
                  font: "Times New Roman",
                  size: fontSize,
                  bold: true,
                  underline: false,
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Convert the document to a Blob
    const blob = await Packer.toBlob(doc);

    // Use FileSaver to download the document
    saveAs(blob, "styled-court-order-with-dynamic-data.docx");
  } catch (error) {
    console.error("Error generating document:", error);
  }
  };
  

  return (
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
      >
        Download Order
      </Button>
  );
};

export default GenerateStyledDocx;
