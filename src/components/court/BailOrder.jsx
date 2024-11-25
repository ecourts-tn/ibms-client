import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import generatePDF from "react-to-pdf";
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import api from '../../api';
import { CreateMarkup } from '../../utils'


const options = {
    filename: "my-petition.pdf",
    page: {
      margin: 20,
      fontSize:40
    }
  };
const getTargetElement = () => document.getElementById("pdf-content");

const downloadPdf = () => generatePDF(getTargetElement, options);


const BailOrder = () => {
    
    const[petition, setPetition] = useState({})
    const[litigant, setLitigant]    = useState([])
    const[crime, setCrime] = useState({})
    const[grounds, setGrounds] = useState([])
    const[advocates, setAdvocates] = useState([])
    const {state} = useLocation()

    useEffect(() => {
        async function fetchData(){
            const response = await api.post(`court/petition/detail/`, {efile_no:state.efile_no})
            if(response.status === 200){
                const { petition, grounds, advocate, crime, litigant } = response.data
                setPetition(petition)
                setLitigant(litigant)
                setAdvocates(advocate)
                setGrounds(grounds)
                setCrime(crime)
            }
        }
        fetchData()
    }, [])

    if(Object.keys(petition).length > 0){
        return (
            <div className="content-wrapper">
                <div className="container-fluid" style={{backgroundColor:'lightgray'}}>
                    <div className="container" style={{backgroundColor:"#FAFAFA", padding:'100px', fontSize:'20px', fontFamily:'sans-serif'}}>
                    <div id="pdf-content">
                        <div className="row">
                            <div className="col-md-12">
                                <div>
                                    <p style={{textAlign: 'left'}}>QR CODE</p>
                                    <p style={{textAlign: 'right'}}>UNIQUE ORDER CODE</p>
                                    <p style={{textAlign: 'center'}}>In the Court of <strong>{petition.court.court_name}</strong><br />Before the [JUDGE DESIGNATION], [DISTRICT].<br /><strong>Present:[JUDGE NAME],</strong><br />[JUDGE DESIGNATION], {petition.court.court_name}, {petition.district.district_name}<br />[DAY] [DATE] [MONTH IN WORDS] [YEAR]<br /><span style={{textDecoration: 'underline'}}><strong>{`${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}`}</strong></span></p>
                                    <p style={{textAlign: 'left'}}>{litigant.filter(l=>l.litigant_type===1).map((l, index)=>(<span><strong>{l.litigant_name}, {l.age}, {l.gender}</strong><br />{l.relation} Name: {l.relation_name}</span>))},</p>
                                    <p style={{textAlign: 'right'}}><br /> ... Petitioner / Accused.</p>
                                    <p style={{textAlign: 'center'}}><br />// Versus //</p>
                                    <p style={{textAlign: 'left'}}><br />State of Tamilnadu Rep by {litigant.filter(l=>l.litigant_type===2).map((l, index)=>(<span>{l.designation?.designation_name},<br />{l.police_station.station_name}, {l.district.district_name}</span>))}</p>
                                    <p style={{textAlign: 'right'}}><br /> ... Respondent/Complainant.</p>
                                    <p style={{textAlign: 'center'}}>Petition in [CASE NO], [FILING DATE] filed [BAIL TYPE] Cr. P.C. prays to grant [CASE TYPE] to the petitioner in [FIR NO][FIR YEAR] in the file of [Police Station].</p>
                                    <p>&nbsp;This petition is coming on this day for hearing before me, in the presence of [PRESENT PETITIONER ADVOCATE NAME(s)], Advocate(s) for the petitioner and [PROCECUTOR NAME], [PROCECUTOR DESIGNATION] for the respondent and upon hearing both side arguments, this Court passed the following:</p>
                                    <p style={{textAlign: 'center'}}><br />ORDER</p>
                                    <p style={{textAlign: 'justify'}}><br /> The petitioner/accused {'{'}Bail [was arrested and remanded to judicial custody on [Arrest Date]]{'}'} for the alleged offences [SECTION] [ACT], registered by respondent police, and seeks bail. <br /> The learned counsel for the petitioner/accused would submit that, <br />[GROUND 1]<br />[GROUND 2]</p>
                                    <p style={{textAlign: 'justify'}}>The learned Public Prosecutor would submit that <br />[PP REMARKS]</p>
                                    <p style={{textAlign: 'justify'}}>Heard both sides. [JUDGE REMARK]</p>
                                    <p><strong>In the result, this [CASE TYPE] is </strong><strong>Allowed {'{'}if condition true{'}'} (with following conditions</strong>)</p>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>The petitioner is ordered to be released on bail on executing a bond for&nbsp; [AMOUNT][AMOUNT IN WORDS] {'{'}if surety required{'}'} (with two sureties for a like sum each to the satisfaction of the learned [Juridictional Court]</p>
                                            <p>&nbsp;</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>The sureties shall affix their photographs and Left Thumb Impression in the surety bond and the Magistrate may obtain a copy of their Aadhaar card or Bank passbook to ensure their identity{'}'}</p>
                                            <p>&nbsp;</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>{'{'}The petitioner shall report and sign before the [Police station Name ] / learned [COURT NAME] daily at [TIMING]., for {'{'} [] days/ until further orders{'}'}</p>
                                            <p>&nbsp;</p>
                                            <p>the shall make available himself for interrogation as and when required by the investigation Officer</p>
                                            <p>&nbsp;</p>
                                            <p>&nbsp;</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>That the petitioner shall not tamper with evidence or witness either during investigation or trial;</p>
                                            <p>&nbsp;</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>That the petitioner shall not abscond either during investigation or trial ;</p>
                                            <p>&nbsp;</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>That on breach of any of the aforesaid conditions, the learned Magistrate / Trial Court is entitled to take appropriate action against the petitioner in accordance with law as if the conditions have been imposed and the petitioner released on bail by the learned Magistrate/trial Court himself.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'justify'}} width={66}>
                                            <p>[S.NO]</p>
                                            </td>
                                            <td style={{textAlign: 'justify'}} width={567}>
                                            <p>If the accused thereafter absconds, a fresh FIR can be registered U/S.229 A IPC.</p>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&nbsp;&nbsp; Pronounced by me in open court, this is the [DATE].</strong></p>
                                    <p style={{textAlign: 'right'}}><strong>[JUDGE DESIGNATION], [DISTRICT]</strong></p>
                                    <p style={{textAlign: 'left'}}><strong>[DATE TIME]</strong></p>
                                    <p style={{textAlign: 'left'}}><strong>[COURT SEAL]</strong></p>
                                    <p style={{textAlign: 'left'}}>Copy to :</p>
                                    <p style={{textAlign: 'left'}}>1. [JURIDICTIONAL COURT]</p>
                                    <p style={{textAlign: 'left'}}>2. [PUBLIC PROCECUTOR]</p>
                                    <p style={{textAlign: 'left'}}>3. [RESPONDENTS]</p>
                                    <p style={{textAlign: 'left'}}>4.[JAIL]</p>
                                    <p style={{textAlign: 'left'}}>5.[PETITIONER COUNCEL]</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<DownloadIcon />}
                            onClick={downloadPdf}
                        >Download PDF</Button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }else{
        return(
            <p>Details not found...</p>
        )
    }
  }


export default BailOrder;


