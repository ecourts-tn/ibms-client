import React from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'

const CNRSearch = () => {

    const[cnrNumber, setCnrNumber] = useState('')
    return (
        <>
            <div className="row">
                <div className="col-md-8 offset-2">
                    <div className="row">
                        <div className="col-md-8">
                            <FormControl fullWidth>
                                <TextField
                                    name="cnr_number"
                                    label="CNR Number"
                                    value={cnrNumber}
                                    size="small"
                                    onChange={(e) => setCnrNumber(e.target.value)}
                                />
                            </FormControl>
                        </div>
                        <div className="col-md-4">
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
        </>
  )
}

export default CNRSearch