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
        case_number: Yup.string()
            .required('Case number is required')
            .matches(/^\d{1,6}$/, 'Case number should be numeric'),
        case_year: Yup.string()
            .required('Year is required')
            .matches(/^\d{4}$/, 'Year should be exactly 4 digits')
    });


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
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '')
                                            if(value.length <= 6){
                                                setForm({ ...form, [e.target.name]: value })
                                            }
                                        }}  
                                    />
                                    <div className="invalid-feedback">{errors.case_number}</div>
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
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '')
                                            if(value.length <= 6){
                                                setForm({ ...form, [e.target.name]: value })
                                            }
                                        }}   
                                        placeholder="Enter Year"
                                    />
                                    <div className="invalid-feedback">{errors.case_year}</div>
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
