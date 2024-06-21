import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const PetitionList = () => {

    const[cases, setCases] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [cases])

    const handleSubmit = async(cino) => {
        try{
            if(window.confirm("Are you sure you want to submit the petition")){
                const response = await api.put(`api/bail/filing/${cino}/update/`, {is_draft:false})
                if(response.status === 200){
                    toast.success("Petition submitted successfully",{
                        theme:"colored"
                    })
                }
                navigate("/dashboard")
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container my-4" style={{minHeight:'500px'}}>
                <h3 className="my-3"><strong>Petitions</strong></h3>
                <table className="table table-striped table-bordered">
                    <thead className="bg-primary">
                        <tr>
                            <th>S. No</th>
                            <th>eFiling Number</th>
                            <th>Filing Date</th>
                            <th>Case Number</th>
                            <th>Litigants</th>
                            <th>View Documents</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cases.map((item, index) => (
                        <tr>
                            <td>{ index+1 }</td>
                            <td>
                                <Link to={`/petition/detail`} state={{cino: item.petition.cino}}>
                                    {item.petition.cino}
                                </Link>
                            </td>
                            <td>{ item.petition.date_of_filing }</td>
                            <td>{ item.petition.filing_type.type_name }/{item.petition.filing_number}/{item.petition.filing_year}</td>
                            <td>
                                { item.petitioner.map((p, index) => (
                                    <span className="text ml-2">{index+1}. {p.petitioner_name}</span>
                                ))}
                                <span className="text text-danger text-center mx-3"><strong>Vs</strong></span>
                                { item.respondent.map((res, index) => (
                                    <span className="text">{res.respondent_name} rep by {res.designation}</span>
                                ))} 
                            </td>
                            <td>
                                { item.petition.vakalath && (
                                    <>
                                        <a href={`http://localhost:8000${item.petition.vakalath}`} target="_blank">Vakalath</a><br/>
                                    </>
                                )}
                                { item.petition.supporting_document && (
                                    <a href={`http://localhost:8000${item.petition.supporting_document}`} target="_blank">Supporting Document</a>
                                )}
                            </td>
                            <td>
                                <Link to="/petition/pdf" state={{cino:item.petition.cino}}>Download</Link>
                            </td>
                         </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PetitionList
