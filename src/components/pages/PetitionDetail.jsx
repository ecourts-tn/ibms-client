import React, {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api'

const PetitionDetail = () => {

    const {state} = useLocation()

    const[petition, setPetition] = useState({})
    const[petitioner, setPetitioner] = useState([])
    const[respondent, setRespondent] = useState([])
    const[crime, setCrime] = useState({})
    const[objection, setObjection] = useState([])
    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`case/filing/detail/`, {params: {efile_no:state.efile_no}})
            if(response.status === 200){
                setPetition(response.data.petition)
                setCrime(response.data.crime)
                const filtered_petitioner = response.data.litigant.filter((l => {
                    return l.litigant_type === 1
                }))
                setPetitioner(filtered_petitioner)
                const filtered_respondent = response.data.litigant.filter((l => {
                    return l.litigant_type === 2
                }))
                setRespondent(filtered_respondent)
                setObjection(response.data.objection)
            }
        }
        fetchData()
    }, [])

    console.log(petition)

    return (
        <>
            { Object.keys(petition).length > 0 && (
                <div className="container my-4">
                    <div className="row">
                        <div className="col-md-12">
                            <nav aria-label="breadcrumb" className="mt-2 mb-1">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">Petition</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Detail</li>
                                </ol>
                            </nav>
                            <h3><strong>Petition Detail - {petition.efile_number}</strong></h3>
                            <h6 className="text-center text-danger"><strong>Case Details</strong></h6>
                            <table className="table table-bordered table-striped table-sm">
                                <tbody>
                                    { petition.court_type.id === 2 && (
                                    <>
                                    <tr>
                                        <td>State</td>
                                        <td>{ petition.state.state_name }</td>
                                        <td>District</td>
                                        <td>{ petition.district.district_name }</td>
                                    </tr>
                                    <tr>
                                        <td>Establishment Name</td>
                                        <td>{ petition.establishment.establishment_name }</td>
                                        <td>Court Name</td>
                                        <td>{ petition.court.court_name }</td>
                                    </tr>
                                    </>
                                    )}
                                    <tr>
                                        <td>Filing Number</td>
                                        <td>{ petition.filing_type ? `${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}` : null}</td>
                                        <td>Filing Date</td>
                                        <td>{ petition.filing_date }</td>
                                    </tr>
                                    <tr>
                                        <td>Registration Number</td>
                                        <td>{ petition.reg_type ? `${petition.reg_type.type_name}/${ petition.reg_number}/${ petition.reg_year}` : null }</td>
                                        <td>Registration Date</td>
                                        <td>{  petition.date_of_registration }</td>
                                    </tr>
                                    {  petition.court_type.code === 2 && (
                                    <>
                                        <tr>
                                            <td>State</td>
                                            <td>{ petition.state.state_name}</td>
                                            <td>District</td>
                                            <td>{ petition.district.district_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Establishment</td>
                                            <td>{ petition.establishment.establishment_name}</td>
                                            <td>Court</td>
                                            <td>{ petition.court.court_name}</td>
                                        </tr>
                                    </>
                                    )}
                                    {  petition.court_type.code === 1 && (
                                    <>
                                        <tr>
                                            <td>Court Type</td>
                                            <td>{ petition.court_type.name}</td>
                                            <td>Bench Type</td>
                                            <td>{ petition.bench_type.name}</td>
                                        </tr>
                                    </>
                                    )}
                                </tbody>
                            </table>
                            <h6 className="text-center text-danger"><strong>Petitioner Details</strong></h6>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>
                                        { petitioner.map((p, index) => (
                                            <>
                                                <p>
                                                    <strong>{index+1}. {p.litigant_name}</strong><br/>
                                                    { p.address }
                                                </p>
                                            </>

                                        ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h6 className="text-center text-danger"><strong>Respondent Details</strong></h6>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>
                                        { respondent.map((res, index) => (
                                            <>
                                                <p><strong>{index+1}. {res.litigant_name} {res.designation}</strong><br/>
                                                    { `${res.police_station.station_name}, ${res.district.district_name}, ${res.address}`}
                                                </p>
                                            </>
                                        ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            { Object.keys(objection).length > 0 && (
                            <>
                            <h6 className="text-center text-danger"><strong>Objections</strong></h6>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>
                                        
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PetitionDetail
