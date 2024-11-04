import React, {useState, useEffect, useContext} from 'react'
import api from 'api'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'

const JudgePeriodForm = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {courts} = useContext(CourtContext)
    const initialState = {
        state: '',
        district: '',
        establishment: '',
        court: '',
        judge_name: '',
        judge_lname: '',
        jocode: ''
    }
    const [form, setForm] = useState(initialState)

    return (
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('state')}</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="state" 
                                                className="form-control"
                                                value={form.state}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_state')}</option>
                                                {states.map((s, index) => (
                                                <option key={index} value={s.state_code}>{ language === 'ta' ? s.state_lname : s.state_name }</option>    
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('district')}</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="district" 
                                                className="form-control"
                                                value={form.district}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_district')}</option>
                                                {districts.filter(d => parseInt(d.state) === parseInt(form.state)).map((d, index) => (
                                                <option key={index} value={d.district_code}>{ language === 'ta' ? d.district_lname : d.district_name }</option>    
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('est_name')}</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="establishment" 
                                                className="form-control"
                                                value={form.establishment}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_establishment')}</option>
                                                {establishments.filter(e => parseInt(e.district) === parseInt(form.district)).map((e, index) => (
                                                <option key={index} value={e.establishment_code}>{ language === 'ta' ? e.establishment_lname : e.establishment_name }</option>    
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('court')}</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="court" 
                                                className="form-control"
                                                value={form.court}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_court')}</option>
                                                {courts.filter(c => parseInt(c.establishment) === parseInt(form.establishment)).map((c, index) => (
                                                <option key={index} value={c.court_code}>{ language === 'ta' ? c.court_lname : c.court_name }</option>    
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_name')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="judge_name"
                                                value={form.judge_name}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_lname')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="judge_lname"
                                                value={form.judge_lname}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('jocode')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="jocode"
                                                value={form.jocode}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <Button
                                            variant='contained'
                                            color='success'
                                        >{t('submit')}</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JudgePeriodForm