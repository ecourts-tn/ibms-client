import React from 'react'
import Button from 'react-bootstrap/Button'
import { CreateMarkup } from '../../utils'

const GroundsList = ({grounds, deleteGround}) => {

    return (
        <>
            { grounds.map((ground, index) => (
                <div className="card" key={index}>
                    <div className="card-body" dangerouslySetInnerHTML={CreateMarkup(ground.description)}>

                    </div>
                    <div className="card-footer d-flex justify-content-end" style={{backgroundColor:"inherit", borderTop:"none", marginTop:"-20px"}}>
                    <Button 
                            variant="primary" 
                            size="sm" 
                            className="mr-2"
                        >
                            <i className="fa fa-pencil-alt mr-2"></i>
                        Edit</Button>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={()=>deleteGround(ground) }
                        >
                            <i className="fa fa-trash mr-2"></i>
                        Delete</Button>
                    </div>
                </div>
            ))}
        </>
    )
}

export default GroundsList