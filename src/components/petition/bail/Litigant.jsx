import React from 'react'

import SearchLitigant from './SearchLitigant'
import PetitionerContainer from '../../petitioner/PetitionerContainer'
import RespondentContainer from '../../respondent/RespondentContainer'


function Litigant(props){
    

    return (
        <>
            <div className="container-fluid" style={{ paddingLeft:'100px', paddingRight:'100px', minHeight:'800px'}}>
                <div className="card" style={{ boxShadow:'none', border:'none'}}>
                    <div className="card-body mt-4" style={{ minHeight:'600px', boxShadow:'none', borderColor:'none'}}>
                        <SearchLitigant />
                        {/* <PetitionerContainer />
                        <RespondentContainer /> */}
                    </div>
                </div>
            </div>

        </>
    )
}

export default Litigant
