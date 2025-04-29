import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import api from 'api';
import Loading from 'components/utils/Loading';
import { LanguageContext } from 'contexts/LanguageContex';
import { MasterContext } from 'contexts/MasterContext';
import { AuthContext } from 'contexts/AuthContext';


const ModifyBusiness = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const {masters:{casetypes}} = useContext(MasterContext)
    const { user } = useContext(AuthContext)

    const initialState = {
        seat:'',
        bench: '',
        establishment: '',
        court: '',
        case_type: '',
        case_number: '',
        case_year: ''
    };
    const [form, setForm] = useState(initialState);
    const [proceeding, setProceeding] = useState({})
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false); // State to control dropdown visibility

    const currentYear = new Date().getFullYear(); // Get the current year

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

    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string().required(),
        case_year: Yup.number()
            .required('Year is required')
            .max(currentYear, `Year cannot be greater than ${currentYear}`)  // Ensure year is not in the future
            .min(1900, 'Year must be greater than or equal to 1900') // You can change this range if necessary
            .test('len', 'Year must be 4 digits', (val) => val && val.toString().length === 4)
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

            // Check if the year entered is a future year and display an error message
            if (value && parseInt(value) > currentYear) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    case_year: `Year cannot be greater than ${currentYear}`  // Error message for future year
                }));
            } else {
                setErrors((prevErrors) => {
                    const { case_year, ...rest } = prevErrors;  // Remove the error if year is valid
                    return rest;
                });
            }

            setShowYearDropdown(true); // Show the dropdown while typing
        }
    };

    // Function to handle selecting a year from the dropdown
    const handleYearSelect = (year) => {
        setForm({ ...form, case_year: year });
        setShowYearDropdown(false); // Hide the dropdown after selection
    };

    // Filter the years based on the input value
    const filteredYears = [];
    for (let year = currentYear; year >= 1900; year--) {
        filteredYears.push(year);
    }


    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await validationSchema.validate(form, { abortEarly: false });
            const response = await api.post(`court/proceeding/modify/`, form);
            if(response.status === 200){
                setProceeding(response.data)
            }
            }catch (error) {
                console.log(error)
                if (error.inner) {
                    const newErrors = {};
                    error.inner.forEach((err) => {
                        newErrors[err.path] = err.message;
                    });
                    setErrors(newErrors);
                }
                if(error.response?.status === 404){
                    toast.error("Case not found", {theme:"colored"})
                }
            } finally {
                setLoading(false);
            }
        };


    return (
        <div className="card card-outline card-primary" style={{height:'600px'}}>
            <ToastContainer />
            {loading && <Loading />}
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Modify Business</strong></h3>
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
                                            <option key={index} value={t.id}>{language === 'ta' ? t.type_lfull_form : t.type_full_form}</option>
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
                                        onChange={handleCaseNumberChange}  
                                    />
                                    <div className="invalid-feedback">
                                        {errors.case_number}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="" >Year</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.case_year ? 'is-invalid' : ''}`}
                                        name="case_year"
                                        value={form.case_year}
                                        onChange={handleYearChange} 
                                        placeholder="Enter Year"
                                    />
                                    <div className="invalid-feedback">
                                        {errors.case_year}
                                    </div>
                                    {showYearDropdown && form.case_year && (
                                        <ul className="list-group mt-2" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc' }}>
                                            {filteredYears.map((year) => (
                                                <li
                                                    key={year}
                                                    className="list-group-item"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleYearSelect(year)} // Select year
                                                >
                                                    {year}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-2 pt-4 mt-2">
                                <div className="form-group">
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        type="submit"
                                        onClick={handleSearch}
                                    >{t('submit')}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyBusiness;
