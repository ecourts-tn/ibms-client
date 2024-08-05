import React, {useState} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import * as Yup from 'yup'
import api from '../../api'

const ChangePassword = () => {

    const initialState = {
        old_password    : '',
        new_password    : '',
        confirm_password: ''
    }
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        old_password: Yup.string().required('Old password is required'),
        new_password: Yup.string().required('New password is required'),
        confirm_password: Yup.string().required('Confirm password is required').oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("api/auth/change-password/", form)
            switch(response.response.status){
                case 400:
                    toast.error(response.response.data.message, {theme: "colored"})
                    break;
                case 200:
                    toast.success(response.response.data.message, {theme:"colored"})
                    setForm(initialState)
                    break;
                case 404:
                    toast.error(response.response.data.message, {theme:"colored"})
                    break;
            }    
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                });
                setErrors(newErrors)
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">Home</li>
                                <li className="breadcrumb-item text-primary">Authentication</li>
                                <li className="breadcrumb-item active" aria-current="page">Change Password</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-4">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="old-password">Current Password</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.old_password ? 'is-invalid' : null}`}
                                    name="old_password"
                                    value={form.old_password}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.old_password }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-password">New Password</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.new_password ? 'is-invalid' : null}`}
                                    name="new_password"
                                    value={form.new_password}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.new_password }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.confirm_password ? 'is-invalid' : null}`}
                                    name="confirm_password"
                                    value={form.confirm_password}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.confirm_password }
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword