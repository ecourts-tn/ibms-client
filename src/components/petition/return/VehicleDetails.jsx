import React from 'react'
import Button from '@mui/material/Button'

const VehicleDetails = ({vehicle, setVehicle}) => {
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>Name of the Vehicle</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="vehicle_name"
                            value={vehicle.vehicle_name}
                            onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>Owner Name</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="owner_details"
                            value={vehicle.owner_details}
                            onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>Owner Address</label>
                    <div className="col-sm-6">
                        <textarea 
                            type="text" 
                            className="form-control" 
                            name="owner_details"
                            value={vehicle.owner_details}
                            onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                        ></textarea>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">Vehicle Number</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="vehicle_number"
                            value={vehicle.vehicle_number}
                            onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">Fastag Details</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="fastag_details"
                            value={vehicle.fastag_details}
                            onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>Whether owner of the vehicle is the accused</label>
                    <div className="col-sm-6">
                        <select 
                            name="is_owner_accused" 
                            className="form-control"
                            value={vehicle.is_owner_accused}
                            onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        variant='contained'
                        color="primary"
                    >Save</Button>
                </div>
            </div>
        </div>
    )
}

export default VehicleDetails