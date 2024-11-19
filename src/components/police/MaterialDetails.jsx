import React, {useState} from 'react'
import {toast, ToastContainer} from 'react-toastify'
import * as Yup from 'yup'

const MaterialDetails = ({materials, setMaterials}) => {
    const initialState = {
        name: '',
        quantity:'',
        nature:'',
        is_produced: false,
        produced_date: '',
        reason: ''
    }
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        quantity: Yup.string().required("Quantity is required"),
        nature: Yup.string().required("Nature is required"),
        is_produced: Yup.boolean(),
        produced_date: Yup.date().nullable().required("Produced date is required"),
        reason: Yup.string().required("Reason is required") 
    });
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})
    const addMaterial = async(e) => {
        e.preventDefault();
        try{
            await validationSchema.validate(form, {abortEarly:false})
            setMaterials((prevMaterials) => [...prevMaterials, form])
            setForm(initialState)
            // try {
            //     toast.success("Material details added successfully", { theme: "colored" });
            // } catch (err) {
            //     console.error("Toast error:", err);
            // }
        }catch(error){
            if(error.inner){
                const validationErrors = {}
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message
                })
                setErrors(validationErrors)
            }
            console.error(error)
        }
    }
    return (
        <div className="card">
            <ToastContainer />
            <div className="card-header bg-secondary">
                Material Details
            </div>
            <div className="card-body p-3">
                <div className="row">
                    <div className="col-md-12">
                        { Object.keys(materials).length > 0 && (
                            <MaterialList materials={materials} />
                        )}
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="">Name of the material</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                name="name"
                                value={form.name}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                {errors.name}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="">Quantity of the material</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                name="quantity"
                                value={form.quantity}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.quantity }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group">
                            <label htmlFor="">Nature of Quantity(Small/Commercial)</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.nature ? 'is-invalid' : ''}`}
                                name="nature"
                                value={form.nature}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.nature }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-8 mt-2">Whether material produced before competent court</label>
                            <div className="col-md-4 mt-2">
                                <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="radioIsProduced1" 
                                        name="is_produced" 
                                        onChange={(e) => setForm({...form, [e.target.name] : true})} 
                                        checked={form.is_produced === true}
                                    />
                                    <label htmlFor="radioIsProduced1">Yes</label>
                                </div>
                                <div className="icheck-danger d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="radioIsProduced2" 
                                        name="is_produced" 
                                        onChange={(e) => setForm({...form, [e.target.name] : false})} 
                                        checked={form.is_produced === false}
                                    />
                                    <label htmlFor="radioIsProduced2">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="">Produced date</label>
                            <input 
                                type="date" 
                                className={`form-control ${errors.produced_date ? 'is-invalid' : ''}`}
                                name="produced_date"
                                value={form.produced_date}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.produced_date }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="">Reason</label>
                            <textarea 
                                name="reason"
                                className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                value={form.reason}
                                onChange={(e)=> setForm({...form, [e.target.name]: e.target.value})}
                            ></textarea>
                            <div className="invalid-feedback">
                                { errors.reason }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button 
                            className="btn btn-success"
                            onClick={addMaterial}
                        >Add Material</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


const MaterialList = ({materials}) => {
    return(
        <table className="table table-bordered table-striped table-sm">
            <thead className='bg-light'>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Nature</th>
                    <th>Remarks</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                { materials.map((m, index)=> (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{m.name}</td>
                    <td>{m.quantity}</td>
                    <td>{m.nature}</td>
                    <td>{m.reason}</td>
                    <td>
                        <button className="btn btn-sm btn-info">Edit</button>
                        <button className="btn btn-sm btn-danger ml-2">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    )
}

export default MaterialDetails