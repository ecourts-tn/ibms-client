import React, {useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import UploadIcon from '@mui/icons-material/UploadRounded'
import Button from '@mui/material/Button'
import api from 'api';
import config from 'config'


const Document = () => {

    const initialState = {
        title: '',
        document: ''
    }
    const[form, setForm] = useState(initialState)
    const[documents, setDocuments] = useState([])

    useEffect(() => {
        const fetchDocuments = async() => {
            try{
                const efile_no = localStorage.getItem("efile_no")
                const response = await api.get("case/document/list/", {params:{efile_no}})
                if(response.status === 200){
                    setDocuments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDocuments()
    }, [])


    const deleteDocument = async(document) => {
        try{
            const newDocuments = documents.filter((g) => {
                return g.id !== document.id
            })
            const response = await api.delete("case/document/delete/", {params:{id:document.id}})
            if(response.status === 204){
                setDocuments(newDocuments)
                toast.error("Documents deleted successfully", {
                    theme: "colored"
                })
            }
        }catch(error){
            console.log(error)
        }
    }


    const handleSubmit = async () => {
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = await api.post(`case/document/create/`, form, {
                headers: {
                    'content-type': 'multipart/form-data',
                    // 'X-CSRFTOKEN': CSRF_TOKEN
                },
                params:{
                    efile_no
                }
            })
            if(response.status === 201){
                setDocuments(documents => [...documents, response.data])
                setForm(initialState)
                toast.success(`Document ${response.data.id} uploaded successfully`, {
                    theme:"colored"
                })
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <ToastContainer />
            { documents.length > 0 && (
                <table className='table table-bordered table-striped table-sm'>
                    <thead className="bg-info">
                        <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Document</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((document, index) => (
                        <tr>
                            <td>{ index+1}</td>
                            <td>{ document.title }</td>
                            <td>
                                <a href={`${config.apiUrl}${document.document}`} target="_blank" className="btn btn-info btn-sm">View</a>
                                <button className="btn btn-danger btn-sm ml-2" onClick={() => deleteDocument(document)}>Delete</button>
                            </td>
                        </tr>    
                        ))}

                    </tbody>
                </table>
            )}
            <form encType='multipart/form-data'>
                <div className="row">
                    <div className="col-md-5"> 
                        <div className="form-group">
                        <label htmlFor="title">Document Title</label>
                        <input 
                            type="text" 
                            name="title"
                            className="form-control"
                            value={form.title}
                            onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                        />
                        </div>
                    </div>
                    <div className="col-md-5"> 
                        <div className="form-group">
                        <label htmlFor="document">Document</label>
                        <input 
                            type="file" 
                            name="document" 
                            className="form-control"
                            // value={petition.supporting_document}
                            onChange={(e) => setForm({...form,[e.target.name]:e.target.files[0]})}
                        />
                        </div>
                    </div>
                    <div className="col-md-1 mt-4 pt-2">
                            <div className="">
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={handleSubmit}
                                    startIcon={<UploadIcon/>}
                                >
                                    Upload
                                </Button>
                            </div>
                        </div>
                </div>
            </form>
        </>
    )
}

export default Document