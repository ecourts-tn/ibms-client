import * as Yup from 'yup'
import React,{useState} from 'react';
import { toast, ToastContainer } from 'react-toastify';


const VehicleDetails = ({vehicles, setVehicles}) => {

    const initialState = {
        vehicle_name: '',
        owner_details: '',
        vehicle_number: '',
        fastag_details: '',
        is_owner_accused: ''
    }
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        vehicle_name: Yup.string().required(),
        owner_details: Yup.string().required(),
        vehicle_number: Yup.string().required(),
        fastag_details: Yup.string().required(),
        is_owner_accused: Yup.string().required()
    })

    const addVehicle = async(e) => {
        e.preventDefault();
        try{
            await validationSchema.validate(form, {abortEarly: false})
            setVehicles((prevVehicles) => [...prevVehicles, form])
            setForm(initialState)
            // try {
            //     toast.success("Vehicle details added successfully", { theme: "colored" });
            // } catch (err) {
            //     console.error("Toast error:", err);
            // }
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
            <ToastContainer />
            <div className="card-header bg-secondary">
                Vehicle Details
            </div>
            <div className="card-body p-3">
                <div className="row">
                    <div className="col-md-12">
                        { Object.keys(vehicles).length > 0 && (
                            <VehicleList vehicles={vehicles} />
                        )}
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="">Name of the Vehicle</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.vehicle_name ? 'is-invalid' : ''}`} 
                                name="vehicle_name"
                                value={form.vehicle_name}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.vehicle_name }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">Vehicle Number</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.vehicle_number ? 'is-invalid' : ''}`} 
                                name="vehicle_number"
                                value={form.vehicle_number}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.vehicle_number }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">Fastag Details</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.fastag_details ? 'is-invalid' : ''}`} 
                                name="fastag_details"
                                value={form.fastag_details}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.fastag_details }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">Whether owner of the vehicle is the accused</label>
                            <select 
                                name="is_owner_accused" 
                                className={`form-control ${errors.is_owner_accused ? 'is-invalid' : ''}`} 
                                value={form.is_owner_accused}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            <div className="invalid-feedback">
                                { errors.is_owner_accused }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="">Owner details with address</label>
                            <textarea 
                                className={`form-control ${errors.owner_details ? 'is-invalid' : ''}`}  
                                name="owner_details"
                                value={form.owner_details}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            ></textarea>
                            <div className="invalid-feedback">
                                { errors.owner_details }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>                    
                    <div className="col-md-2">
                        <button     
                            className="btn btn-success"
                            onClick={ addVehicle}
                        >Add Vehicle</button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default VehicleDetails


const VehicleList = ({vehicles}) => {
    return(
        <table className="table table-bordered table-striped table-sm">
            <thead className="bg-navy">
                <tr>
                    <th>#</th>
                    <th>Vehicle Name</th>
                    <th>Vehicle Number</th>
                    <th>Fastag Details</th>
                    <th>Is owner accused?</th>
                    <th>Address</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                { vehicles.map((v, index) => (
                <tr key={index}>
                    <td>{ index+1 }</td>
                    <td>{ v.vehicle_name }</td>
                    <td>{ v.vehicle_number }</td>
                    <td>{ v.fastag_details }</td>
                    <td>{ v.is_owner_accused }</td>
                    <td>{ v.owner_details }</td>
                    <td>
                        <button className="btn btn-sm btn-info">Edit</button>
                        <button className="btn btn-sm btn-danger ml-1">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    )
}
