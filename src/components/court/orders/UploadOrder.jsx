import api from 'api';
import Loading from 'components/utils/Loading';
import { LanguageContext } from 'contexts/LanguageContex';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { MasterContext } from 'contexts/MasterContext';
import { AuthContext } from 'contexts/AuthContext';
import { RequiredField } from 'utils';

const UploadOrder = () => {
    const FILE_SIZE = 5 * 1024 * 1024
    const SUPPORTED_FILES = 'application/pdf'
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const { masters:{
        casetypes
    }} = useContext(MasterContext)
    const { user } = useContext(AuthContext)

    const initialState = {
        seat: '',
        bench: '',
        establishment: '',
        court: '',
        case_type: '',
        case_number: '',
        case_year: '',
        file: null, 
    };

    const [form, setForm] = useState(initialState);
    const [showDocument, setShowDocument] = useState(false)
    const [orders, setOrders] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string()
            .required('Case number required')
            .matches(/^\d{1,6}$/, 'Case number must be up to 6 digits'),
        case_year: Yup.string()
            .required('Year is required')
            .matches(/^\d{4}$/, 'Year must be 4 digits'),
        file: Yup.mixed()
            .required('File is required')
            .test('fileSize', 'File size must be less than 5MB', (value) => !value || value.size <= FILE_SIZE)  
            .test('fileType', 'Only PDF files are allowed', (value) => !value || value.type === SUPPORTED_FILES), 
    });

    const searchValidationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string()
            .required('Case number required')
            .matches(/^\d{1,6}$/, 'Case number must be up to 6 digits'),
        case_year: Yup.string()
            .required('Year is required')
            .matches(/^\d{4}$/, 'Year must be 4 digits'),
    })

    useEffect(() => {
        if(user){
            setForm({
                ...form,
                seat: user.seat?.seat_code,
                bench: user.bench?.bench_code,
                establishment: user.establishment?.establishment_code,
                court: user.court?.court_code
            })
        }
    }, [user])
    
    const handleSearch = async () => {
        try {
            await searchValidationSchema.validate(form, { abortEarly: false })
            setLoading(true);
            const response = await api.post(`court/order/upload/`, form);
            if (response.status === 200) {
                setOrders(response.data);
                setShowDocument(true);
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        } finally {
            setLoading(false); 
        }
    };


    const handleSubmit = async () => {
        try {
            setLoading(true);
            await validationSchema.validate(form, { abortEarly: false });
            
            const response = await api.put(`court/order/upload/`, form);
            if (response.status === 201) {
                toast.success('Order uploaded successfully', { theme: 'colored' });
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderNumber) => {
        try {
            setLoading(true);
            const response = await api.delete(``, {
                data: { orderNumber },
            });
            if (response.status === 204) {
                toast.error('Order deleted successfully', { theme: 'colored' });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // File change handler for validating file type and size
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // File validation
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    file: 'File size must be less than 5MB',
                }));
                return;
            }
            if (file.type !== 'application/pdf') {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    file: 'Only PDF files are allowed',
                }));
                return;
            }

            // If the file is valid, update the form state
            setForm((prevForm) => ({
                ...prevForm,
                file,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                file: '', // Reset file error when file is valid
            }));
        }
    };

    return (
        <div className="">
            <ToastContainer /> {loading && <Loading />}
            <div className="card card-outline card-primary" style={{minHeight:'600px'}}>
                <div className="card-header">
                    <h3 className="card-title">
                        <i className="fas fa-edit mr-2"></i>
                        <strong>{t('upload_order')}</strong>
                    </h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="">Select Casetype</label>
                                        <select
                                            name="case_type"
                                            className={`form-control ${errors.case_type ? 'is-invalid' : ''}`}
                                            value={form.case_type}
                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                        >
                                            <option value="">{t('alerts.select_case_type')}</option>
                                            {casetypes.map((t, index) => (
                                                <option key={index} value={t.id}>
                                                    {language === 'ta' ? t.type_lfull_form : t.type_full_form}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.case_type}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label htmlFor="">Case Number</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.case_number ? 'is-invalid' : ''}`}
                                            name="case_number"
                                            value={form.case_number}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if(value.length <= 6){
                                                    setForm({...form, [e.target.name]: value})
                                                }
                                            }}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.case_number}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Year</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.case_year ? 'is-invalid' : ''}`}
                                            name="case_year"
                                            value={form.case_year}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if(value.length <= 4){
                                                    setForm({...form, [e.target.name] : value})
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                        <div className="invalid-feedback">{errors.case_year}</div>
                                    </div>
                                </div>
                                <div className="col-md-3 pt-4 mt-2">
                                    <div className="form-group">
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            type="button" 
                                            onClick={handleSearch}
                                        >
                                            {t('search')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 offset-md-3">
                            <div className="row">
                                {showDocument && (
                                <React.Fragment>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">Remarks</label>
                                            <textarea 
                                                name="order_remarks" 
                                                className="form-control"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">Order Date <RequiredField /></label>
                                            <input 
                                                type="date" 
                                                name="order_date"
                                                className="form-control" 
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">Document <RequiredField /></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                            />
                                            {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-center">
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                onClick={handleSubmit}
                                            >
                                                {t('submit')}
                                            </Button>
                                        </div>
                                    </div>
                                </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {orders.length > 0 && (
                    <div className="col-md-12">
                        <OrderList orders={orders} handleDelete={handleDelete} />
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderList = ({ orders, handleDelete }) => {
    return (
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((o, index) => (
                    <tr key={o.order_number}>
                        <td>{index + 1}</td>
                        <td>{o.order_number}</td>
                        <td>{o.order_date}</td>
                        <td>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(o.order_number)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UploadOrder;
