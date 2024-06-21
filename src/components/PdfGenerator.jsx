import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import generatePDF from "react-to-pdf";
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import api from '../api';


const options = {
    filename: "my-petition.pdf",
    page: {
      margin: 20,
      fontSize:40
    }
  };
const getTargetElement = () => document.getElementById("pdf-content");

const downloadPdf = () => generatePDF(getTargetElement, options);


const PdfGenerator = () => {
    
    const[petition, setPetition] = useState({})
    const {state} = useLocation()
    console.log(state.cino)
    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`api/bail/petition/${state.cino}/detail/`)
            if(response.status === 200){
                setPetition(response.data)
            }
        }
        fetchData()
    }, [])


    console.log(petition)

    if(Object.keys(petition).length > 0){
        return (
            <div className="container-fluid" style={{backgroundColor:'lightgray'}}>
                <div className="container" style={{backgroundColor:"#FAFAFA", padding:'100px', fontSize:'20px', fontFamily:'sans-serif'}}>
                <div id="pdf-content">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h4 className="mb-5"><strong>IN THE COURT OF THE HONOURABLE {petition.petition.court.court_name}<br/>
                            {petition.petition.establishment.establishment_name}
                            </strong> </h4>
                            <p><strong>{ petition.petition.cino }</strong></p>
                            <p className="mb-4">
                                (In the matter of Crime number: {petition.petition.crime_number} / {petition.petition.crime_year} of {petition.petition.police_station.station_name} &nbsp;
                                Police Station U/s. {petition.petitioner[0].section } of {petition.petitioner[0].act } pending before the {petition.petition.court.court_name},&nbsp;
                                {petition.petition.establishment.establishment_name},&nbsp;{petition.petition.district.district_name},&nbsp;{petition.petition.state.state_name}
                            </p>
                        </div>
                        <div className="col-md-6">
                            { petition.petitioner.map((p, index) => (
                            <>
                                <p><strong>{index+1}. {p.petitioner_name}, {p.age}, {p.gender}, {p.rank}</strong><br/>
                                {p.relation} Name: {p.relation_name}<br/>
                                { p.address }<br></br>
                                Mobile Number: {p.mobile_number}<br/>
                                eMail Address: {p.email_address}
                                </p>
                            </>
                            ))}
                        </div>
                        <div className="col-md-6 d-flex justify-content-end mt-5">
                            <p>Petitioner /accused /Intervener</p>
                        </div>
                        <div className="col-md-12 d-flex justify-content-center">
                            <p><strong>-Vs-</strong></p>
                        </div>
                        <div className="col-md-6">
                            { petition.respondent.map((res, index) => (
                                <>
                                    <p><strong>{index+1}. {res.respondent_name} rep by {res.designation}</strong><br/>
                                        { res.address}, { res.address }
                                    </p>
                                </>
                            ))}
                        </div>
                        <div className="col-md-6 d-flex justify-content-end mt-5">
                            <p>Respondent / Complainant.</p>
                        </div>
                        <div className="col-md-12 mt-5">
                            <p className="text-center my-3" style={{textTransform:'uppercase'}}><strong>Bail Petition filed by 
                                { petition.advocate.map((adv, index) => (
                                    <span>&nbsp;{`${adv.advocate_name} - [${adv.enrolment_number}]`}, &nbsp;</span>
                                ))}
                                 for and on behalf of the Petitioner/Accused&nbsp;[{ petition.petitioner.map((p, index) => (
                            <>
                                <span><strong>&nbsp;{index+1}.{p.petitioner_name}&nbsp;&nbsp;</strong></span>
                            </>
                            ))}] U/s {petition.petition.bail_type.name}:-</strong></p>
                            <ol style={{lineHeight:'2'}}>
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    It is most respectfully submitted that the respondent&nbsp;
                                    <strong>{petition.respondent[0].respondent_name}&nbsp;rep by&nbsp;{petition.respondent[0].designation},&nbsp;{petition.petition.police_station.station_name}</strong> on&nbsp;
                                    <strong>{petition.petition.fir_date_time }</strong>&nbsp;has registered a case for the alleged offenses punishable&nbsp;
                                    U/s&nbsp;<strong>{petition.petitioner[0].section }&nbsp;{petition.petitioner[0].act}</strong>&nbsp;
                                    in Crime Number:&nbsp;<strong>{petition.petition.crime_number}/ {petition.petition.crime_year}</strong>&nbsp;of&nbsp;
                                    <strong>{petition.petition.police_station.station_name}</strong>&nbsp;police station against the petitioner(s) 
                                    { petition.petitioner.map((p, index) => (
                                        <><strong>&nbsp;{index+1}.{p.petitioner_name}&nbsp;&nbsp;</strong></>
                                        ))
                                    }and 2 other(s) based on a petition given by one&nbsp;<strong>{petition.petition.complaintant_name}</strong>.
                                </li>
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    It is most humbly submitted that the alleged facts stated in the F.I.R. are<br></br>{petition.petition.gist_in_local}.
                                </li>
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    It is most humbly submitted that the petitioner was arrested by the respondent police in connection with this case and was remanded to judicial custody on <strong>[Date of Arrest]</strong> and he/she is languishing at District Jail/Central Prison at <strong>{petition.petitioner[0].prison.name}</strong></li>
                                { petition.grounds.map((ground, index) => (
                                    <li key={index}  style={{marginTop:'20px', textAlign:'justify'}}>
                                        {ground.description}
                                    </li>
                                    ))
                                }
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    It is most humbly submitted that the petitioner has solvent sureties to secure his/her presence before this Honourable Court as and when required and he/she will not evade the process of law.
                                </li>
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    It is most humbly submitted that the petitioner is ready to abide with any condition imposed on him/her by this Honourable Court.
                                </li>
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    ( if previous case Yes ). Earlier bail petitions filed by the petitioner before the [ Court] as [Case No ] [Status] , [ Court] as [Case No ] [Status] , respectively if NIL {'{'} I humbly submit that this is the first petition filed by me seeking Anticipatory Bail before this Honourable Court and no such petition is filed or pending before any courts{'}'}
                                </li>
                                <li style={{marginTop:'20px', textAlign:'justify'}}>
                                    Hence it is most humbly prayed that this Honourable Court may be pleased to accept this petition and pass orders to release the petitioner on bail and thus render justice.
                                </li>
                            </ol>
                        </div>
                        <div className="col-md-6 mt-5">
                            <p>Place: <strong>{petition.petition.district.district_name}</strong></p>
                            <p>Date: [Date Time]</p>
                        </div>
                        <div className="col-md-6 mt-5" style={{textAlign:'right'}}>
                            <p>Advocates:</p>
                            <p>[e-signed submitted on Date Time]</p>
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
        );
    }else{
        return(
            <p>Details not found...</p>
        )
    }
  }


export default PdfGenerator;


