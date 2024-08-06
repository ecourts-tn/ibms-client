import React from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import api from '../../../api'
import { toast, ToastContainer } from 'react-toastify'

const CNRSearch = () => {

    const[cino, setCino] = useState('')
    const[petition, setPetition] = useState({})
    const handleSubmit = async() => {
        try{
            const {response} = await api.post("api/case/search/cnr-number/", {cino})
            if(response.status === 200){
                setPetition(response.data)
            }
            if(response.status === 404){
                toast.error(response.data.message, { theme:"colored"})
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">Home</li>
                                <li className="breadcrumb-item text-primary">Status</li>
                                <li className="breadcrumb-item active">CNR Number</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8">
                                <FormControl fullWidth>
                                    <TextField
                                        name="cino"
                                        label="CNR Number"
                                        value={cino}
                                        size="small"
                                        onChange={(e) => setCino(e.target.value)}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-md-4">
                                <Button 
                                    variant='contained'
                                    color="primary"
                                    endIcon={<SearchIcon />}
                                    onClick={handleSubmit}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default CNRSearch