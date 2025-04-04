import api from 'api';
import Loading from 'components/utils/Loading';
import { LanguageContext } from 'contexts/LanguageContex';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { MasterContext } from 'contexts/MasterContext';

const UploadOrder = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const { masters:{
        casetypes
    }} = useContext(MasterContext)

    const initialState = {
        district: '',
        establishment: '',
        court: '',
        case_type: '',
        case_number: '',
        case_year: '',
        file: null, // To store the file
    };

    const [form, setForm] = useState(initialState);
    const [orders, setOrders] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false); // State to control dropdown visibility
    const currentYear = new Date().getFullYear(); // Get the current year
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);

    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string().required(),
        case_year: Yup.number()
            .required('Year is required')
            .max(currentYear, `Year cannot be greater than ${currentYear}`)
            .min(1900, 'Year must be greater than or equal to 1900')
            .test('len', 'Year must be 4 digits', (val) => val && val.toString().length === 4),
        file: Yup.mixed()
            .required('File is required')
            .test('fileSize', 'File size must be less than 5MB', (value) => !value || value.size <= 5 * 1024 * 1024)  // 5MB
            .test('fileType', 'Only PDF files are allowed', (value) => !value || value.type === 'application/pdf'), // Only PDF files
    });

    // Function to handle case_number input validation (only numeric input)
    const handleCaseNumberChange = (e) => {
        const value = e.target.value;
        // Allow only numbers (no special characters or letters) and limit to 6 digits
        if (/^[0-9]*$/.test(value) && value.length <= 6) {
            setForm({ ...form, [e.target.name]: value });
        }
    };

    // Function to handle case_year input (typing validation)
    const handleYearChange = (e) => {
        const value = e.target.value;
        
        // Allow only numbers and limit to 4 digits
        if (/^[0-9]*$/.test(value) && value.length <= 4) {
            setForm({ ...form, case_year: value });
    
            if (value.length === 4) {
                // If user types a full year, hide dropdown unless the year is invalid
                if (parseInt(value) >= 1900 && parseInt(value) <= currentYear) {
                    setShowYearDropdown(false);
                } else {
                    setShowYearDropdown(true);
                }
            } else {
                setShowYearDropdown(true);
            }
    
            // Display error for future years
            if (value && parseInt(value) > currentYear) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    case_year: `Year cannot be greater than ${currentYear}`,
                }));
            } else {
                setErrors((prevErrors) => {
                    const { case_year, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };
    
    const handleYearSelect = (year) => {
        setForm({ ...form, case_year: year });
        setShowYearDropdown(false); // Hide dropdown after selection
    };
    
    const filteredYears = [];
    for (let year = currentYear; year >= 1900; year--) {
        filteredYears.push(year);
    }

// Ensure filtering only happens when `form.case_year` is not empty
const filteredResults = form.case_year
    ? filteredYears.filter((y) =>
          y.toString().startsWith(form.case_year)
      )
    : filteredYears;
    
    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await api.post(``, form);
            if (response.status === 200) {
                setOrders(response.data);
                setShowDocumentUpload(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await validationSchema.validate(form, { abortEarly: false });
            
            const response = await api.post(``, form);
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
        <div className="content-wrapper">
            <ToastContainer />
            {loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fas fa-edit mr-2"></i>
                            <strong>{t('upload_order')}</strong>
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {orders.length > 0 && (
                                <div className="col-md-12">
                                    <OrderList orders={orders} handleDelete={handleDelete} />
                                </div>
                            )}
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Select Casetype</label>
                                        <div className="col-sm-8">
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
                                            <div className="invalid-feedback">{errors.case_type}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Case Number</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.case_number ? 'is-invalid' : ''}`}
                                                name="case_number"
                                                value={form.case_number}
                                                onChange={handleCaseNumberChange}
                                                placeholder="Case Number"
                                            />
                                            <div className="invalid-feedback">{errors.case_number}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Year</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.case_year ? 'is-invalid' : ''}`}
                                                name="case_year"
                                                value={form.case_year}
                                                onChange={handleYearChange}
                                                placeholder="Enter Year"
                                                autoComplete="off"
                                            />
                                            <div className="invalid-feedback">{errors.case_year}</div>
                                            {showYearDropdown && filteredResults.length > 0 && (
                                                <ul className="list-group mt-2" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc',cursor: 'pointer', }}>
                                                    {filteredYears.map((year) => (
                                                        <li
                                                            key={year}
                                                            className="list-group-item"
                                                            // style={{ cursor: 'pointer' }}
                                                            onClick={() => handleYearSelect(year)}
                                                        >
                                                            {year}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-4"></div> {/* Empty space to align with input */}
                                        <div className="col-sm-8">
                                            <Button variant="contained" color="primary" type="button" onClick={handleSearch}>
                                                {t('search')}
                                            </Button>
                                        </div>
                                    </div>
                                    {/* {showDocumentUpload && ( */}
                                    <>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Select document</label>
                                        <div className="col-md-8">
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                            />
                                            {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-4"></div> {/* Empty space to align with input */}
                                        <div className="col-sm-8">
                                            <Button variant="contained" color="success" type="submit">
                                                {t('submit')}
                                            </Button>
                                        </div>
                                    </div>
                                    </>
                                    {/* )} */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
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
