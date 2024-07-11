import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

const DraftList = () => {

    const[cases, setCases] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/draft/list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [])

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
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Petition</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Draft</li>
                            </ol>
                        </nav>
                        <h3><strong>Draft Petitions</strong></h3>
                        <table className="table table-striped table-bordered">
                            <thead className="bg-secondary">
                                <tr>
                                    <th>S. No</th>
                                    <th>eFiling Number</th>
                                    <th>Litigants</th>
                                    <th>View Documents</th>
                                    <th>Payment</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { cases.map((item, index) => (
                                <tr>
                                    <td>{ index+1 }</td>
                                    <td>{ item.petition.cino }</td>
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
                                    </td>
                                    <td>
                                        <button className="btn btn-info mx-1">
                                            <i className="fa fa-pencil-alt"></i>
                                        </button>
                                        <button className="btn btn-danger mx-1">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick = {(e) => handleSubmit(item.petition.cino) }
                                        >
                                            Submit
                                        </Button>
                                    </td>
                                </tr>
                                ))}
                                { cases.length <= 0 && (
                                <tr>
                                    <td colSpan={6} className="text-danger text-center">***** No petitions found *****</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DraftList
