import React from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'

const PartyNameSearch = () => {

    const[partyName, setPartyName] = useState('')
    return (
        <>
            <div className="row">
                <div className="col-md-8 offset-2">
                    <div className="row">
                        <div className="col-md-8">
                            <FormControl fullWidth>
                                <TextField
                                    name="partyName"
                                    label="Party Name"
                                    value={partyName}
                                    size="small"
                                    onChange={(e) => setPartyName(e.target.value)}
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

export default PartyNameSearch