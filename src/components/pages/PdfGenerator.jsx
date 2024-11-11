import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import generatePDF from "react-to-pdf";
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import api from '../../api';
import { CreateMarkup, formatDate } from '../../utils'
import './pdfstyle.css'

const PdfGenerator = () => {
    
    const[petition, setPetition] = useState({})
    const[petitioner, setPetitioner] = useState([])
    const[respondent, setRespondent] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[grounds, setGrounds] = useState([])
    const[crime, setCrime] = useState({})
    const[count, setCount] = useState(0)
    const {state} = useLocation()


    const options = {
        filename: `${state.efile_no}.pdf`,
        page: {
          margin: 20,
          fontSize:20
        }
      };
    const getTargetElement = () => document.getElementById("pdf-content"); 
    const downloadPdf = () => generatePDF(getTargetElement, options);

    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`case/filing/detail/`, {params:{efile_no:state.efile_no}})
            if(response.status === 200){
                setPetition(response.data.petition)
                setAdvocates(response.data.advocate)
                setCrime(response.data.crime)
                const filtered_petitioner = response.data.litigant.filter((l => {
                    return l.litigant_type === 1
                }))
                setPetitioner(filtered_petitioner)
                const filtered_respondent = response.data.litigant.filter((l => {
                    return l.litigant_type === 2
                }))
                setRespondent(filtered_respondent)
            }
        }
        fetchData()
    }, [])

    if(Object.keys(petition).length > 0){
        return (
            <div className="container-fluid" style={{backgroundColor:'lightgray', marginTop:'-30px'}}>
                <div className="container pdf-container">
                <div id="pdf-content">
                    <div className="row">
                        { parseInt(petition.judiciary?.id) === 2 && (
                        <div className="col-md-12 text-center" style={{textTransform:'uppercase'}}>
                            <h4 className="mb-5"><strong>IN THE COURT OF THE HONOURABLE {petition.court?.court_name}<br/>{petition.establishment.establishment_name}</strong> </h4>
                            <p><strong>{ petition.efile_number }</strong></p>
                            <p className="mb-4">
                                {`In the matter of Crime number: ${crime?.fir_number || '0'}/${crime?.fir_year || '0000'} of ${crime.police_station?.station_name || 'xxxxx'} 
                                Police Station U/s. ${petitioner[0].section } of ${petitioner[0].act } pending before the ${petition.court.court_name}
                                ${petition.establishment.establishment_name}, ${petition.district.district_name}, ${petition.state.state_name}`}
                            </p>
                        </div>
                        )}
                        { parseInt(petition.judiciary?.id) === 1 && (
                        <div className="col-md-12 text-center" style={{textTransform:'uppercase'}}>
                            <h4 className="mb-5"><strong>IN THE COURT OF THE HONOURABLE {petition.judiciary?.judiciary_name}<br/>{petition.seat.seat_name}</strong> </h4>
                            <p><strong>{ petition.efile_number }</strong></p>
                            <p className="mb-4">
                                {`In the matter of Crime number: ${crime?.fir_number || '0'}/${crime?.fir_year || '0000'} of ${crime.police_station?.station_name || 'xxxxx'} 
                                Police Station U/s. ${petitioner[0].section } of ${petitioner[0].act } pending before the ${petition.judiciary?.judiciary_name}
                                ${petition.seat?.seat_name}`}
                            </p>
                        </div>
                        )}
                        <div className="col-md-6">
                            { petitioner.map((l, index) => (
                            <p>
                               <strong>{index+1}. {l.litigant_name}, {l.age}, {l.gender}, {l.rank}</strong><br/>
                                {l.relation} Name: {l.relation_name}<br/>
                                { l.address }<br></br>
                                Mobile Number: {l.mobile_number}<br/>
                                eMail Address: {l.email_address}
                            </p>
                            ))}
                        </div>
                        <div className="col-md-6 d-flex justify-content-end mt-5">
                            <p>Petitioner / Accused</p>
                        </div>
                        <div className="col-md-12 d-flex justify-content-center">
                            <p><strong>-Vs-</strong></p>
                        </div>
                        <div className="col-md-6">
                            { respondent.map((l, index) => (
                                <>
                                    <p><strong>{index+1}. {l.litigant_name} rep by {l.designation}</strong><br/>
                                        { l.address}, { l.address }
                                    </p>
                                </>
                            ))}
                        </div>
                        <div className="col-md-6 d-flex justify-content-end mt-5">
                            <p>Respondent / Complainant.</p>
                        </div>
                        <div className="col-md-12 mt-5">
                            <p className="text-center my-3" style={{textTransform:'uppercase'}}><strong>Bail Petition filed by 
                                { advocates.map((adv, index) => (
                                    <span>&nbsp;{`${adv.adv_name} - [${adv.adv_reg}]`}, &nbsp;</span>
                                ))}
                                 for and on behalf of the Petitioner/Accused&nbsp;[{ petitioner.map((p, index) => (
                            <>
                                <span><strong>&nbsp;{index+1}.{p.litigant_name}&nbsp;&nbsp;</strong></span>
                            </>
                            ))}] U/s {petition.bail_type.type_name}:-</strong></p>
                            <ol style={{lineHeight:'2'}}>
                                {/* <li>
                                    It is most respectfully submitted that the respondent&nbsp;
                                    <strong>{respondent[0].litigant_name}&nbsp;&nbsp;{respondent[0].designation},&nbsp;{respondent[0].police_station.station_name}, &nbsp;{respondent[0].police_district.district_name}</strong> on&nbsp;
                                    <strong>{crime.fir_date_time }</strong>&nbsp;has registered a case for the alleged offenses punishable&nbsp;
                                    U/s&nbsp;<strong>{petitioner[0].section }&nbsp;{petitioner[0].act}</strong>&nbsp;
                                    in Crime Number:&nbsp;<strong>{crime.fir_number}/ {crime.fir_year}</strong>&nbsp;of&nbsp;
                                    <strong>{respondent[0].police_station.station_name}</strong>&nbsp;police station against the petitioner(s) 
                                    { petitioner.map((p, index) => (
                                        <><strong>&nbsp;{index+1}.{p.litigant_name}&nbsp;&nbsp;</strong></>
                                        ))
                                    } based on a petition given by one&nbsp;<strong>{petition.complaintant_name}</strong>.
                                </li> */}
                                <li>
                                    It is most humbly submitted that the alleged facts stated in the F.I.R. are<br></br>
                                    <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_in_local)}></span>
                                </li>
                                <li>
                                    It is most humbly submitted that the petitioner was arrested by the respondent police in connection with this case and was remanded to judicial custody on <strong>[{crime.date_of_arrest}]</strong> and he/she is languishing at District Jail/Central Prison at <strong>[{ petitioner[0].prison ? petitioner[0].prison : '*****'}]</strong>
                                </li>
                                { grounds.map((ground, index) => (
                                    <li key={index}  dangerouslySetInnerHTML={CreateMarkup(ground.description)}></li>
                                ))}
                                <li>
                                    It is most humbly submitted that the petitioner has solvent sureties to secure his/her presence before this Honourable Court as and when required and he/she will not evade the process of law.
                                </li>
                                <li>
                                    It is most humbly submitted that the petitioner is ready to abide with any condition imposed on him/her by this Honourable Court.
                                </li>
                                <li>
                                    I humbly submit that this is the first petition filed by me seeking {petition.case_type.type_full_form } before this Honourable Court and no such petition is filed or pending before any courts
                                </li>
                                <li>
                                    Hence it is most humbly prayed that this Honourable Court may be pleased to accept this petition and pass orders to release the petitioner on bail and thus render justice.
                                </li>
                            </ol>
                        </div>
                        <div className="col-md-6 mt-5">
                            <p>Place: <strong>{ petition.judiciary?.id === 1  ? petition.seat?.seat_name : petition.district?.district_name}</strong></p>
                            <p>Submitted on: {formatDate(petition.created_at)}</p>
                        </div>
                        <div className="col-md-6 mt-5" style={{textAlign:'right'}}>
                            <p>Advocates</p>
                            <p>
                            { advocates.map((a, index) => (
                               <span key={index} style={{textTransform:'uppercase'}}><strong>&nbsp;{`${a.adv_name} - [${a.adv_reg}]`}</strong><br/></span>
                            ))}
                            </p>
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


