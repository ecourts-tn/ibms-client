import React from 'react'
import { useState } from 'react'
import GroundsList from './GroundsList'
import GroundsForm from './GroundsForm'

const GroundsContainer = ({grounds, addGround, deleteGround}) => {

    const[count, setCount] = useState(0)

    const incrementCount = () => {
        setCount(count+1)
    }

    const decrementCount = () => {
        setCount(count-1)
    }
    
    return (
        <>
            <div className="card card-outline card-info">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-file mr-2"></i><strong>Grounds</strong></h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <GroundsList 
                                grounds={grounds} 
                                deleteGround={deleteGround} 
                                count={count}
                                decrementCount={decrementCount}
                            />
                        </div>   
                        <div className="col-md-12"> 
                            <GroundsForm 
                                addGround={addGround} 
                                count={count}
                                incrementCount={incrementCount}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="card-footer">
                    <button 
                        type="button" 
                        id="add_ground_button" 
                        className="btn btn-info float-right"
                        onClick={addGround}
                    ><i className="fa fa-plus mr-2"></i>
                        Add Ground</button>
                </div> */}
            </div>
        </>
     )
}

export default GroundsContainer