import React from 'react'
import Button from '@mui/material/Button'

const MaterialDetails = ({material, setMaterial, addMaterial}) => {
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>Material Name</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name"
                            value={material.name}
                            onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>Quantity</label>
                    <div className="col-sm-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="quantity"
                            value={material.quantity}
                            onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">Nature(Small/Commercial)</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="nature"
                            value={material.nature}
                            onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">Remarks</label>
                    <div className="col-sm-6">
                        <textarea 
                            name="remarks" 
                            className="form-control"
                            value={material.remarks}
                            onChange={(e) => setMaterial({...material, [e.target.name] : e.target.value})}
                        ></textarea>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MaterialDetails