import React, {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api'

const PetitionDetail = () => {

    const {state} = useLocation()

    const[petition, setPetition] = useState({})

    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`api/bail/petition/${state.cino}/detail/`)
            if(response.status === 200){
                setPetition(response.data)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            { Object.keys(petition).length > 0 && (
                <div className="container my-4">
                    <h3 className="my-4"><strong>Petition Detail</strong></h3>
                    <h6 className="text-center text-danger"><strong>Case Details</strong></h6>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td>Filing Number</td>
                                <td>{petition.petition.filing_type.type_name}/{petition.petition.filing_number}/{petition.petition.filing_year}</td>
                                <td>Filing Date</td>
                                <td>{ petition.petition.date_of_filing }</td>
                            </tr>
                            <tr>
                                <td>Registration Number</td>
                                <td>{petition.petition.reg_type.type_name}/{petition.petition.reg_number}/{petition.petition.reg_year}</td>
                                <td>Registration Date</td>
                                <td>{ petition.petition.date_of_registration }</td>
                            </tr>
                            { petition.petition.court_type.code === 2 && (
                            <>
                                <tr>
                                    <td>State</td>
                                    <td>{petition.petition.state.state_name}</td>
                                    <td>District</td>
                                    <td>{petition.petition.district.district_name}</td>
                                </tr>
                                <tr>
                                    <td>Establishment</td>
                                    <td>{petition.petition.establishment.establishment_name}</td>
                                    <td>Court</td>
                                    <td>{petition.petition.court.court_name}</td>
                                </tr>
                            </>
                            )}
                            { petition.petition.court_type.code === 1 && (
                            <>
                                <tr>
                                    <td>Court Type</td>
                                    <td>{petition.petition.court_type.name}</td>
                                    <td>Bench Type</td>
                                    <td>{petition.petition.bench_type.name}</td>
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
                                { petition.petitioner.map((p, index) => (
                                    <>
                                        <p><strong>{index+1}. {p.petitioner_name}</strong><br/>
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
                                { petition.respondent.map((res, index) => (
                                    <>
                                        <p><strong>{index+1}. {res.respondent_name} rep by {res.designation}</strong><br/>
                                            { res.address}, { res.address }
                                        </p>
                                    </>
                                ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h6 className="text-center text-danger"><strong>Objections</strong></h6>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default PetitionDetail
