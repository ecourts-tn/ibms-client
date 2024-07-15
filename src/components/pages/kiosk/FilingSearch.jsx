import React from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'

const FilingSearch = () => {

    const[form, setForm] = useState({
        filing_number:'',
        filing_year:''
    })
    return (
        <>
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Status</a></li>
                                <li className="breadcrumb-item active"><a href="#">Filing Number</a></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-10 offset-1">
                                <div className="row">
                                    <div className="col-md-5">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="filing_number"
                                                label="Filing Number"
                                                value={form.filing_number}
                                                size="small"
                                                onChange={(e) => setForm({...form, filing_number:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="filing_year"
                                                label="Filing Year"
                                                value={form.filing_year}
                                                size="small"
                                                onChange={(e) => setForm({...form, filing_year:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-3">
                                        <Button 
                                            variant='contained'
                                            color="primary"
                                            endIcon={<SearchIcon />}
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </>
  )
}

export default FilingSearch