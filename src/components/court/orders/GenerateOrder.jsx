import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import api from 'api';
import Loading from 'components/utils/Loading';
import { LanguageContext } from 'contexts/LanguageContex';
import { MasterContext } from 'contexts/MasterContext';
import { AuthContext } from 'contexts/AuthContext';


const GenerateOrder = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const {masters:{casetypes}} = useContext(MasterContext)
    const { user } = useContext(AuthContext)
    const initialState = {
        seat: '',
        bench: '',
        establishment: '',
        court: '',
        case_type: '',
        case_number: '',
        case_year: ''
    };
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string()
            .required('case number required')
            .matches(/^\d{1,6}$/, 'Case number must be up to 6 digits'),
        case_year: Yup.string()
            .required('Year is required')
            .matches(/^\d{4}$/, 'Year must be exactly 4 digits')
    });

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



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await validationSchema.validate(form, { abortEarly: false });
            try {
                const response = await api.post(`court/order/generate/`, form, {
                    responseType: "blob",  // This is necessary for binary files
                });
                const cino = response.headers["x-cino"];
                if (!response.data || response.data.size === 0) {
                    console.error("Downloaded file is empty.");
                    return;
                }
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement("a");
                a.href = url;
                a.download = `${cino}.odt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } catch (error) {
                if(error.response?.status === 404){
                    toast.error("Petition detail not found", { theme: "colored"})
                }
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
            if(error.response?.status === 404){
                toast.error(error.response?.data.message, { theme: "colored"})
            }
            if(error.response?.status === 500){
                toast.error("Something went wrong!", {theme:"colored"})
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="">
            <ToastContainer />  {loading && <Loading />}
            <div className="card card-outline card-primary" style={{minHeight:'600px'}}>
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('genrate_order')}</strong></h3>
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
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 6) {
                                                    setForm({...form, [e.target.name]: value})}
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
                                                    setForm({...form, [e.target.name]: value})} 
                                                }}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.case_year}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 pt-4 mt-2">
                                    <div className="form-group">
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            type="submit"
                                            onClick={handleSubmit}
                                        >{t('submit')}</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateOrder;
