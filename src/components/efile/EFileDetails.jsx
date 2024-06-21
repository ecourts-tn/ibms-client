import React, {useState, useEffect} from 'react'
import api from '../../api'

const EFileDetails = () => {

    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[grounds, setGrounds] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const cino = localStorage.getItem("cino")
                const response = await api.get(`api/bail/petition/${cino}/detail/`)
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setPetitioners(response.data.petitioner)
                    setRespondents(response.data.respondent)
                    setGrounds(response.data.grounds)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <div className="card card-outline card-info">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>Basic Details</strong></h3>
                </div>
                <div className="card-body p-2">
                    { Object.keys(petition).length > 0 && (
                    <table className="custom-table">
                        { petition && (
                        <>
                            <tr>
                                <td>Court Type</td>
                                <td>{ petition.court_type.name }</td>
                                <td>Bench Type</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td>{ petition.state.state_name }</td>
                                <td>District</td>
                                <td>{ petition.district.district_name }</td>
                            </tr>
                            <tr>
                                <td>Establishment</td>
                                <td>{ petition.establishment.establishment_name }</td>
                                <td>Court</td>
                                <td>{ petition.court.court_name }</td>
                            </tr>
                            <tr>
                                <td>Case Type</td>
                                <td>{ petition.case_type.name }</td>
                                <td>Bail Type</td>
                                <td>{ petition.bail_type.name }</td>
                            </tr>
                            <tr>
                                <td>Crime Registered</td>
                                <td>{ petition.crime_registered === 1 ? 'Yes' : 'No' }</td>
                                <td>Compliant Type</td>
                                <td>{ petition.complaint_type.name }</td>
                            </tr>
                        </>
                        )}
                    </table>
                    )}
                </div>
            </div>
            <div className="card card-outline card-success">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>Petitioners</strong></h3>
                </div>
                <div className="card-body p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="bg-dark">
                            <tr>
                                <th>S.&nbsp;No.</th>
                                <th>Petitioner&nbsp;Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th width="500">Address</th>
                                <th>Act</th>
                                <th>Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            { petitioners.map((petitioner, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ petitioner.petitioner_name }</td>
                                    <td>{ petitioner.gender }</td>
                                    <td>{ petitioner.age }</td>
                                    <td>{ petitioner.address }</td>
                                    <td>{ petitioner.act }</td>
                                    <td>{ petitioner.section }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card card-outline card-info">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>Respondents</strong></h3>
                </div>
                <div className="card-body p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="bg-dark">
                            <tr>
                                <th>S. No.</th>
                                <th>Respondent&nbsp;Name</th>
                                <th>Designation</th>
                                <th>Address</th>
                                <th>District</th>
                            </tr>
                        </thead>
                        <tbody>
                            { respondents.map((respondent, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ respondent.respondent_name }</td>
                                    <td>{ respondent.designation }</td>
                                    <td>{ respondent.address }</td>
                                    <td>{ respondent.district }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card card-outline card-primary">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>Grounds</strong></h3>
                </div>
                <div className="card-body p-2">
                    { grounds.map((ground, index) => (
                    <div className="card" key={index}>
                        <div className="card-body">
                            { ground.description}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default EFileDetails