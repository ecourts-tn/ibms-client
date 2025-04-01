import React, { useContext, useEffect, useState } from 'react'
import api from 'api'
import Loading from 'components/utils/Loading'
import Form from 'react-bootstrap/Form'
import { AuthContext } from 'contexts/AuthContext'
import { RequiredField } from 'utils'
import FIRDetails from 'components/police/FIRDetails'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'

const LinkFIR = ({setFirTagged, efileNumber}) => {
    const {t} = useTranslation()
    const [loading, setLoading] = useState(false)
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const {user} = useContext(AuthContext)
    const [form, setForm] = useState({
        state: '',
        district: '',
        pdistrict: '',
        police_station: '',
        fir_number: '',
        fir_year: ''
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setForm({...form, 
            state: user.police_station?.state,
            district: user.police_station?.revenue_district,
            pdistrict: user.police_station?.district_code,
            police_station: user.police_station?.cctns_code,
        })
    }, [])

    const validationSchema = {

    }

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            // await validationSchema.validate(searchForm, { abortEarly: false })
            setLoading(true)
            const response = await api.post("external/police/fir-search/", form)
            if (response.status === 200) {
                sessionStorage.setItem("api_id", response.data.api_id)
                setShowAdditionalFields(true)
                setNotFound(false)
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            if(error.response){
                if(error.response.status === 404){
                    setNotFound(true);
                }
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card card-outline card-info">
            { loading && <Loading />}
            <div className="card-header"><strong>Link FIR</strong></div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2">
                        <Form.Group className="mb-3">
                            <Form.Label>FIR Number<RequiredField /></Form.Label>
                            <Form.Control
                                type="text"
                                name="fir_number"
                                className={`${errors.fir_number ? 'is-invalid' : ''}`}
                                value={form.fir_number}
                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                            ></Form.Control>
                            <div className="invalid-feedback">{errors.fir_number}</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group>
                            <Form.Label>Year<RequiredField /></Form.Label>
                            <Form.Control
                                type="text"
                                name="fir_year"
                                className={`${errors.fir_year ? 'is-invalid' : ''}`}
                                value={form.fir_year}
                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                            ></Form.Control>
                            <div className="invalid-feedback">{errors.fir_year}</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-1 mt-4 pt-2">
                        <Form.Group>
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                            ><i className="fa fa-search mr-2"></i>Search</Button>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 mt-4 pt-2">
                        {showAdditionalFields && (
                            <FIRDetails 
                                setFirTagged={setFirTagged}
                                efile_no = {efileNumber}
                            />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        { notFound && (
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <span><strong>{t('errors.fir_not_found')}</strong> </span>
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkFIR