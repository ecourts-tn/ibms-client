import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { RequiredField } from 'utils';
import * as Yup from 'yup'
import api from 'api';
import { useTranslation } from 'react-i18next';
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import { MasterContext } from 'contexts/MasterContext';
import { LanguageContext } from 'contexts/LanguageContex';

const AccusedForm = ({addAccused, selectedAccused}) => {
    const { language } = useContext(LanguageContext)
    const[fir, setFir] = useState({})
    const[accused, setAccused] = useState([])
    const { masters: {
        states, 
        districts, 
        taluks, 
        countries, 
        relations,
        genders,
        nationalities
    }} = useContext(MasterContext)
    const {t} = useTranslation()

    const[alternateAddress, setAlternateAddress] = useState(false)
    const initialState = {
        litigant: 'o',
        litigant_name: '',
        litigant_type: 3, 
        relation: '',
        relation_name: '',
        age:'',
        gender:'',
        address:'',
        rank: '',
        state:'',
        district:'',
        taluk:'',
        address2: '',
        post_office:'',
        pincode:'',
        nationality: 1,
        country_code:'',
        mobile_number:'',
        proof_number:'',
        email_address:'',
        act: '',
        section: '',
        is_custody: false,
        prison: '',
        custody_days: null,
        is_surrendered: false,
        identification_marks:'',
    }
    const[litigant, setLitigant] = useState(initialState)
    const[errors, setErrors] = useState({})

    useEffect(() => {
        if(selectedAccused){
            setLitigant(selectedAccused)
        }
    }, [selectedAccused])

    const validationSchema = Yup.object({
        litigant_name: Yup.string().required(t('errors.litigant_name_required')),
        gender: Yup.string().required(t('errors.gender_required')),
        relation: Yup.string().required(t('errors.relation_required')),
        relation_name: Yup.string().required(t('errors.relation_name_required')),
        age: Yup.string()
            .required(t('errors.age_required'))
            .matches(/^\d{2}$/, 'Age must be exactly 2 digits'),
        rank: Yup.string().required(t('errors.rank_required')),
        address: Yup.string().required(t('errors.address_required')),
        country_code: Yup.string().required('Country code required'),
        mobile_number: Yup.string()
            .nullable()
            .notRequired()
            .transform(value => (value === '' ? null : value))  // Treat empty string as null
            .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
        email_address: Yup.string()
            .email(t('enter valid email address')) // You can also directly write the message like: 'Invalid email format'
            .nullable(), // If it's optional
        identity_proof: Yup.string().required(t('errors.identity_proof_required')),
        proof_number: Yup.string().required(t('errors.identity_proof_required')),
        act: Yup.string().required(t('errors.act_required')),
        section: Yup.string().required(t('errors.section_required')),
        state: Yup.string()
            .nullable()
            .when('$alternateAddress', {
            is: true,
            then: schema => schema.required(t('errors.state_required')),
            otherwise: schema => schema.notRequired(),
        }),
        district: Yup.string()
            .nullable()
            .when('$alternateAddress', {
            is: true,
            then: schema => schema.required(t('errors.district_required')),
            otherwise: schema => schema.notRequired(),
        }),
        taluk: Yup.string()
            .nullable()
            .when('$alternateAddress', {
            is: true,
            then: schema => schema.required(t('errors.taluk_required')),
            otherwise: schema => schema.notRequired(),
        }),
        post_office: Yup.string()
            .nullable()
            .when('$alternateAddress', {
            is: true,
            then: schema => schema.required(t('errors.post_office_required')),
            otherwise: schema => schema.notRequired(),
        }),
        address2: Yup.string()
            .nullable()
            .when('$alternateAddress', {
            is: true,
            then: schema => schema.required(t('errors.address_required')),
            otherwise: schema => schema.notRequired(),
        }),
        pincode: Yup.string()
            .nullable()
            .when('$alternateAddress', {
            is: true,
            then: schema => schema.required(t('errors.pincode_required')).matches(/^d{6}$/, 'Pincode must be exactly 6 digits'),
            otherwise: schema => schema.notRequired(),
        }),
    })


    useEffect(() => { 
        const fetchFIR = async () => {
            const api_id = sessionStorage.getItem("api_id")
            try {
                const response = await api.post("external/police/fir-detail/", { id: api_id });
                if (response.status === 200) {
                    const data = response.data
                    setFir({
                    ...fir,
                    act: data?.act || "",
                    section: data?.section.toString() || [],
                });
                setAccused(response.data?.accused || []);
                }
            } catch (error) {
                console.error("Error fetching FIR details:", error);
            }
        };
        fetchFIR();
    }, []);


    useEffect(() => {
        if(accused){
            const result = accused.find((a) => {
                return a.name_of_accused === litigant.litigant
            })
            if(litigant.litigant === 'o'){
                setLitigant(initialState)
            }
            else if(result){
                setLitigant({
                ...litigant,
                litigant_name :result.name_of_accused,
                rank: result.rank_of_accused,
                gender: result.gender,
                act: fir.act,
                section: fir.section.toString(),
                relation: result.accused_guardian,
                relation_name: result.accused_guardian_name,
                age: result.age,
                address: result.permanent_address === '' ? '-' :result.permanent_address,
                mobile_number: result.mobile_number,
                email_address: result.email_id,
                })
            }
        }
    },[litigant.litigant, accused])

    const handleSubmit = async() => {
        try{
            await validationSchema.validate(litigant, { context: {alternateAddress}, abortEarly: false });
            addAccused(litigant)
        }catch(error){
            // console.log(error.inner)
            if(error.inner){
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
            if (error.response) {
                toast.error(error.response.data?.message || "An error occurred", {
                theme: "colored",
                });
            }
        }
    }

    return (
        <div className="container-fluid">
        <ToastContainer />
            { accused.length > 0 && (
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="litigant">Select petitioner</label><br />
                        <select name="litigant" value={litigant.litigant} className="form-control" onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})} >
                        <option value="o">Select petitioner</option>
                        { accused.map((item, index) => (
                        <option key={index} value={item.name_of_accused}>{item.name_of_accused}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-8 pt-4">
                <p className="text-danger"><strong>*****  Fill the following details if the accused name is not listed  *****</strong></p>
                </div>
            </div>
            )}
            <div className="row">  
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('name_of_litigant')}<RequiredField /></label>
                        <input
                            type="text"
                            name="litigant_name" 
                            className={`form-control ${errors.litigant_name ? 'is-invalid' : ''}`}
                            value={litigant.litigant_name} 
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : false }
                            onChange={(e) => handleNameChange(e, setLitigant, litigant, 'litigant_name')}
                        />
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label>{t('gender')}<RequiredField /></label>
                        { litigant.litigant !== 'o' && (
                            <input 
                                readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                                value={litigant.gender}
                            />
                        )}
                        { litigant.litigant === 'o' && (
                            <React.Fragment>
                                <select 
                                    name="gender" 
                                    value={litigant.gender} 
                                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                                >
                                    <option value="">{t('alerts.select_gender')}</option>
                                    { genders.map((g, index) => (
                                        <option value={g.name} key={index}>{language === 'ta' ? g.gender_lname : g.gender_name }</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{ errors.gender }</div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label>{t('age')}<RequiredField /></label>
                        <input
                            type="text"
                            name="age"
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            value={litigant.age}
                            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if(value.length <= 2){
                                    setLitigant({...litigant, [e.target.name]: e.target.value})}
                                }
                            }
                        />
                        <div className="invalid-feedback">{ errors.age }</div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label>{t('accused_rank')}<RequiredField /></label>
                        <input
                            type="text"
                            name="rank"
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            value={litigant.rank}
                            className={`form-control ${errors.rank ? 'is-invalid': ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.rank }</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group form-group">
                        <label htmlFor="relation">{t('relationship_type')}<RequiredField /></label><br />
                        { litigant.litigant !== 'o' && (
                            <input 
                                value={litigant.relation}
                                readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            />
                        )}
                        { litigant.litigant === 'o' && (
                        <React.Fragment>
                            <select 
                                name="relation" 
                                id="relation" 
                                className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                                value={litigant.relation}
                                onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                                >
                                <option value="">{t('alerts.select_parantage')}</option>
                                { relations.map((item, index) => (
                                <option key={index} value={item.relation_name}>{ language === 'ta' ? item.relation_lname : item.relation_name }</option>
                                )) }
                            </select>
                            <div className="invalid-feedback">
                                { errors.relation }
                            </div>
                        </React.Fragment>  
                        )}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('relationship_name')}<RequiredField /></label>
                        <input
                            type="text"
                            name="relation_name"
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            value={litigant.relation_name}
                            className={`form-control ${errors.relation_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.relation_name }</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label>{t('act')}<RequiredField /></label>
                        <input
                            type="text"
                            name="act"
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            value={litigant.act}
                            className={`form-control ${errors.act ? 'is-invalid': ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.act }</div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="form-group">
                        <label>{t('section')}<RequiredField /></label>
                        <input
                            type="text"
                            name="section"
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            value={litigant.section.toString()}
                            className={`form-control ${errors.section ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value })}
                        />
                        <div className="invalid-feedback">{ errors.section }</div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="form-group">
                        <label>{t('address')}<RequiredField /></label>
                        <input
                            type="text"
                            name="address"
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                            value={litigant.address}
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.address }</div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="form-group">
                    <input type="checkbox" name={alternateAddress} onChange={(e) => setAlternateAddress(!alternateAddress)} className="mr-2"/><span className="text-primary"><strong>{t('alternate_address')}</strong></span>
                    </div>
                </div>
            </div>
            { alternateAddress && (
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="state">{t('state')}</label><br />
                        <select 
                            name="state" 
                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                            value={litigant.state}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_state')}</option>
                            { states.map((item, index) => (
                                <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.state }</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="district">{t('district')}</label><br />
                        <select 
                            name="district" 
                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                            value={litigant.district}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_district')}</option>
                            { districts.filter(district=>parseInt(district.state)===parseInt(litigant.state)).map((item, index) => (
                                <option value={item.district_code} key={index}>{language === 'ta' ? item.district_lname : item.district_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.district }</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="taluk">{t('taluk')}</label><br />
                        <select 
                            name="taluk" 
                            className={`form-control ${errors.taluk ? 'is-invalid' : ''}`}
                            value={litigant.taluk}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_taluk')}</option>
                            { taluks.filter(taluk=>parseInt(taluk.district)===parseInt(litigant.district)).map((item, index) => (
                                <option value={item.taluk_code} key={index}>{ language === 'ta' ? item.taluk_lname : item.taluk_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.taluk }</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('post_office')}</label>
                        <input
                            type="text"
                            name="post_office"
                            className={`form-control ${errors.post_office ? 'is-invalid' : ''}`}
                            value={litigant.post_office}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.post_office }</div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="form-group">
                        <label>{t('address')}</label>
                        <input
                            type="text"
                            name="address2"
                            className={`form-control ${errors.address2 ? 'is-invalid' : ''}`}
                            value={litigant.address2}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.address2 }</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('pincode')}</label>
                        <input
                            type="text"
                            name="pincode"
                            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                            value={litigant.pincode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if(value.length <= 6){
                                    setLitigant({...litigant, [e.target.name]:value})
                                }
                            }}
                        />
                        <div className="invalid-feedback">{ errors.pincode }</div>
                    </div>
                </div>
            </div>
            )}
            <div className="row">
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('nationality')}<RequiredField /></label>
                        <select 
                            name="nationality" 
                            className={`form-control ${errors.nationality ? 'is-invalid' : ''}`}
                            value={litigant.nationality}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_nationality')}</option>
                            { nationalities.map((n, index) => (
                            <option value={n.id} key={index}>{language === 'ta' ? n.nationality_lname : n.nationality_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.pincode }</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('country_code')}</label>
                        <select 
                            name="country_code"
                            value={litigant.country_code} 
                            className={`form-control ${errors.country_code ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_country')}</option>
                            {countries.map((c, index) => (
                            <option key={index} value={c.id}>{`+(${c.iso})`} {c.country_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.country_code}</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('mobile_number')}</label>
                        <input
                            type="text"
                            name="mobile_number"
                            className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}`}
                            value={litigant.mobile_number}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if(value.length <= 10){
                                    setLitigant({...litigant, [e.target.name]: value})
                                }
                            }}
                        />
                        <div className="invalid-feedback">{ errors.mobile_number}</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('email_address')}</label>
                        <input
                            type="text"
                            name="email_address"
                            value={litigant.email_address}
                            className={`form-control ${errors.email_address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.email_address }</div>
                    </div>
                </div>
                <div className="col-md-3 mt-4 pt-2">
                    <Button 
                        variant="secondary"
                        onClick={handleSubmit}
                    >
                        <i className="fa fa-plus mr-2"></i>{t('add_litigant')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AccusedForm