import React, {useState, useEffect} from 'react'
import {toast, ToastContainer} from 'react-toastify'
import * as Yup from 'yup'
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const MaterialDetails = ({materials, setMaterials}) => {
    const initialState = {
        material_name: '',
        quantity:'',
        quantity_nature:'',
        is_produced: false,
        produced_date: '',
        reason: ''
    }
    const validationSchema = Yup.object({
        material_name: Yup.string().required("Name is required"),
        quantity: Yup.string().required("Quantity is required"),
        quantity_nature: Yup.string().required("Nature is required"),
        is_produced: Yup.boolean(),
        produced_date: Yup.date().nullable().required("Produced date is required"),
        reason: Yup.string().required("Reason is required") 
    });
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})

    const produced_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const produced_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const produced_date = flatpickr(".produced_date-date-picker", {
            dateFormat: "d/m/Y",
            maxDate: "today",
            defaultDate: form.produced_date ? produced_date_Display(new Date(form.produced_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? produced_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, produced_date: formattedDate });
            },
        });

        return () => {
            if (produced_date && typeof produced_date.destroy === "function") {
                produced_date.destroy();
            }
        };
    }, [form]);

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
                                className={`form-control ${errors.material_name ? 'is-invalid' : ''}`} 
                                name="material_name"
                                value={form.material_name}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                {errors.material_name}
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
                                className={`form-control ${errors.quantity_nature ? 'is-invalid' : ''}`}
                                name="quantity_nature"
                                value={form.quantity_nature}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.quantity_nature }
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
                                className={`form-control produced_date-date-picker ${errors.produced_date ? 'is-invalid' : ''}`}
                                name="produced_date"
                                value={form.produced_date}
                                readOnly={form.is_produced === true ? false : true }
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                 placeholder="DD/MM/YYYY"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #ccc', // Optional: Adjust border
                                    padding: '8px',            // Optional: Adjust padding
                                }}
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
                    <td>{m.material_name}</td>
                    <td>{m.quantity}</td>
                    <td>{m.quantity_nature}</td>
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