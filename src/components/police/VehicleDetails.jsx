import React,{useState} from 'react';
import * as Yup from 'yup'

const VehicleDetails = ({vehicles, setVehicles}) => {

    const initialState = {
        vehicle_name: '',
        owner_details: '',
        vehicle_number: '',
        fastag_details: '',
        is_owner_accused: ''
    }
    const[vehicle, setVehicle] = useState(initialState)
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        vehicle_name: Yup.string().required(),
        owner_details: Yup.string().required(),
        vehicle_number: Yup.string().required(),
        fastag_details: Yup.string().required(),
        is_owner_accused: Yup.boolean().required()
    })

    const addVehicle = async(e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(vehicle, {abortEarly: false})
            setVehicles([...vehicles, vehicle])

        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }

    const deleteVehicle = () => {

    }

    return (
        <div className='card'>
            <div className="card-header bg-secondary">
                Vehicle Details
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="">Name of the Vehicle</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="vehicle_name"
                                value={vehicle.vehicle_name}
                                onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">Owner details with address</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="owner_details"
                                value={vehicle.owner_details}
                                onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">Vehicle Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="vehicle_number"
                                value={vehicle.vehicle_number}
                                onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">Fastag Details</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="fastag_details"
                                value={vehicle.fastag_details}
                                onChange={(e) => setVehicle({...vehicle, [e.target.name]: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">Whether owner of the vehicle is the accused</label>
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
                    <div className="col-md-2">
                        <button     
                            className="btn btn-success"
                            onClick={(e) => addVehicle(e)}
                        >Add Vehicle</button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default VehicleDetails
