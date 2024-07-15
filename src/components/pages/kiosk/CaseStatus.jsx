import React from 'react'
import { useState } from 'react'
import FilingSearch from './FilingSearch'
import RegistrationSearch from './RegistrationSearch'

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import CNRSearch from './CNRSearch'
import FIRSearch from './FIRSearch'
import PartyNameSearch from './PartyNameSearch'

const CaseStatus = () => {

    const[option, setOption] = useState(1)

    return (
        <>
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row my-5">
                    <div className="col-md-12 d-flex justify-content-center">
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="radio-group"
                                name="option"
                                value={option}
                                onChange={(e) => setOption(e.target.value)}
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Filing Number" />
                                <FormControlLabel value={2} control={<Radio />} label="Registration Number" />
                                <FormControlLabel value={3} control={<Radio />} label="CNR Number" />
                                <FormControlLabel value={4} control={<Radio />} label="FIR Number" />
                                <FormControlLabel value={5} control={<Radio />} label="Party Name" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="col-md-6 offset-3 mt-2">
                        { parseInt(option) === 1 && (
                            <FilingSearch />
                        )}
                        { parseInt(option) === 2 && (
                            <RegistrationSearch />
                        )}
                        { parseInt(option) === 3 && (
                            <CNRSearch />
                        )}
                        { parseInt(option) === 4 && (
                            <FIRSearch />
                        )}
                        { parseInt(option) === 5 && (
                            <PartyNameSearch />
                        )}
                    </div>
                </div>
            </div>
        </>
  )
}

export default CaseStatus