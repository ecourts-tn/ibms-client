import React from 'react'
import { useState } from 'react'
import FIRSearch from '../../search/FIRSearch'
import CaseSearch from '../../search/CaseSearch'


const CaseDetails = ({ petition, setPetition }) => {

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-center">
          <div className="form-group clearfix">
            <label htmlFor="" className="mr-2">Search Case By:</label>
            <div className="icheck-primary d-inline mx-2">
              <input 
                type="radio" 
                name="search_type" 
                id="search_type_fir" 
                onClick={(e) => setPetition({...petition, [e.target.name]: 1 })} 
                checked={ petition.search_type === 1 }
              />
              <label htmlFor="search_type_fir">FIR Number</label>
            </div>
            <div className="icheck-primary d-inline mx-2">
              <input 
                type="radio" 
                name="search_type" 
                id="search_type_case" 
                onClick={(e) => setPetition({...petition, [e.target.name]: 2 })}
                checked={ petition.search_type === 2 }
              />
              <label htmlFor="search_type_case">Case Number</label>
            </div>
          </div>
        </div>
      </div>  
      { petition.search_type === 1 && (<FIRSearch petition={petition} setPetition={setPetition}/>)}
      { petition.search_type === 2 && (<CaseSearch petition={petition} setPetition={setPetition} />)}
    </>
  )
}

export default CaseDetails