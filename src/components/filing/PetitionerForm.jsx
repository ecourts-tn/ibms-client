import React, {useContext} from 'react'
import api from 'api';
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import { RequiredField } from 'utils';
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { useLocation } from 'react-router-dom';
import { handleNameChange } from 'components/validation/validations';
import { MasterContext } from 'contexts/MasterContext';


const PetitionerForm = ({addPetitioner, selectedPetitioner}) => {

    const [petition, setPetition] = useState({})
    const {language} = useContext(LanguageContext)
    const { masters: { 
            states, districts, taluks, relations, prisons, proofs, 
            countries, genders, nationalities
        }} = useContext(MasterContext);
    const location = useLocation()
    const {t} = useTranslation()
    const[alternateAddress, setAlternateAddress] = useState(false)
    const [fir, setFir] = useState({})
    const[accused, setAccused] = useState([])
  
    const initialState = {
        litigant: 'o',
        litigant_name: '',
        litigant_type: 1, 
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
        country_code: '',
        mobile_number:'',
        identity_proof:'',
        proof_number:'',
        email_address:'',
        act: '',
        section: '',
        is_custody: false,
        accused_photo:'',
        is_auto_fetched:false,
        prison: '',
        custody_days: null,
        is_surrendered: false,
        identification_marks:'',
    }

    const[litigant, setLitigant] = useState(initialState)
    const[errors, setErrors] = useState(initialState)

    useEffect(() => {
        setLitigant(selectedPetitioner)
    }, [selectedPetitioner])

    useEffect(() => {
        setPetition(JSON.parse(sessionStorage.getItem("petition")))
    },[])
  
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
            .required(t('errors.mobile_required'))
            .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
        email_address: Yup.string()
            .email(t('enter valid email address')) // You can also directly write the message like: 'Invalid email format'
            .nullable(), // If it's optional
        identity_proof: Yup.string().required(t('errors.identity_proof_required')),
        proof_number: Yup.string().required(t('errors.identity_proof_required')),
        act: Yup.string().required(t('errors.act_required')),
        section: Yup.string().required(t('errors.section_required')),
        is_custody: Yup.boolean().required(t('errors.is_custody_required')),
        prison: Yup.string()
            .nullable()
            .when('is_custody', {
            is: true,
            then: schema => schema.required('Details are required when custody is true'),
            otherwise: schema => schema.notRequired(),
        }),

        custody_days: Yup.string()
            .nullable()
            .when('is_custody', {
            is: true,
            then: schema => schema.required('Custody days is required'),
            otherwise: schema => schema.notRequired(),
        }),
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
    });

    useEffect(() => { 
        const api_id = sessionStorage.getItem("api_id")
        const fetchFIR = async () => {
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
        if(api_id){
            fetchFIR();
        }
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
                accused_photo: result.accused_photo,
                is_auto_fetched:true
                })
            }
        }
    },[litigant.litigant, accused])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(litigant,  { context: { alternateAddress }, abortEarly: false });
            addPetitioner(litigant);
        } catch (error) {
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } 
        }
    };

    return (
        <form encType='multipart/form-data'>
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
                <p className="text-danger"><strong>*****  Fill the following details if the petitioner name is not listed  *****</strong></p>
                </div>
            </div>
            )}
            <div className="row mt-2">  
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('petitioner_name')}<RequiredField /></label>
                        <input
                            type="text"
                            name="litigant_name" 
                            className={`form-control ${errors.litigant_name ? 'is-invalid' : ''}`}
                            value={litigant.litigant_name} 
                            readOnly={litigant.litigant !== 'o' ? 'readOnly' : false }
                            onChange={(e) =>setLitigant({...litigant, [e.target.name]: e.target.value })}
                       />
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label>{t('gender')}<RequiredField /></label>
                        { litigant.litigant !== 'o' && (
                        <input
                            className='form-control'
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
                                    <option value={g.gender_name} key={index}>{language === 'ta' ? g.gender_lname : g.gender_name }</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                { errors.gender }
                            </div>
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
                                    setLitigant({...litigant, [e.target.name]: value})}
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
                    <div className="form-group">
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
                            <div className="invalid-feedback">{ errors.relation }</div>
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
                            onChange={(e) => handleNameChange(e, setLitigant, litigant, 'relation_name')}
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
                        <input 
                            type="checkbox" 
                            name={alternateAddress} 
                            onChange={(e) => setAlternateAddress(!alternateAddress)} 
                            className="mr-2"
                        />
                            <span className="text-primary"><strong>{t('alternate_address')}</strong></span>
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
                            id="state" 
                            className={`form-control ${errors.state ? 'is-invalid' : null}`}
                            value={litigant.state}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_state')}</option>
                            { states.map((item, index) => (
                                <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.state }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="district">{t('district')}</label><br />
                        <select 
                            name="district" 
                            id="district" 
                            className={`form-control ${errors.district ? 'is-invalid' : null}`}
                            value={litigant.district}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_district')}</option>
                            { districts.filter(district=>parseInt(district.state)===parseInt(litigant.state)).map((item, index) => (
                            <option value={item.district_code} key={index}>{language === 'ta' ? item.district_lname : item.district_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.district }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="taluk">{t('taluk')}</label><br />
                        <select 
                            name="taluk" 
                            id="taluk" 
                            className={`form-control ${errors.taluk ? 'is-invalid' : null}`}
                            value={litigant.taluk}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_taluk')}</option>
                            { taluks.filter(taluk=>parseInt(taluk.district)===parseInt(litigant.district)).map((item, index) => (
                            <option value={item.taluk_code} key={index}>{ language === 'ta' ? item.taluk_lname : item.taluk_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.taluk }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('post_office')}</label>
                        <text
                            type="text"
                            name="post_office"
                            className={`form-control ${errors.post_office ? 'is-invalid' : null}`}
                            value={litigant.post_office}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">
                            { errors.post_office }
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="form-group">
                        <label>{t('address')}</label>
                        <input
                            type="text"
                            name="address2"
                            value={litigant.address2}
                            className={`form-control ${errors.address2 ? 'is-invalid' : null}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">
                            { errors.address2 }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('pincode')}</label>
                        <input
                            type="text"
                            name="pincode"
                            value={litigant.pincode}
                            className={`form-control ${errors.pincode ? 'is-invalid' : null}`}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if(value.length <= 6){
                                    setLitigant({...litigant, [e.target.name]: value})
                                }
                            }}
                        />
                        <div className="invalid-feedback">
                            { errors.pincode }
                        </div>
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
                            className="form-control"
                            value={litigant.nationality}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                        <option value="">{t('alerts.select_nationality')}</option>
                            { nationalities.map((n, index) => (
                                <option value={n.id} key={index}>{language === 'ta' ? n.nationality_lname : n.nationality_name }</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">{t('identity_proof')}<RequiredField/></label>
                        <select 
                            name="identity_proof" 
                            className={`form-control ${errors.identity_proof ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                        <option value="">{t('alerts.select_proof')}</option>
                        { proofs.map((p, index) => (
                            <option key={index} value={p.id}>{ language === 'ta' ? p.proof_lname : p.proof_name}</option>
                        ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.identity_proof }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('identity_proof_number')}<RequiredField /></label>
                        <input
                            type="text"
                            name="proof_number"
                            value={litigant.proof_number}
                            className={`form-control ${errors.proof_number ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.proof_number }</div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className='form-group'>
                        <label>{t('country_code')}<RequiredField /></label>
                        <select 
                            name="country_code" 
                            className={`form-control ${errors.country_code ? 'is-invalid' : null}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_country')}</option>
                            {countries.map((c, index) => (
                                <option key={index} value={c.id}>{`+(${c.iso})`} {c.country_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.country_code}
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className='form-group'>
                        <label>{t('mobile_number')}<RequiredField /></label>
                        <input
                            type="text"
                            name="mobile_number"
                            className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}`}
                            value={litigant.mobile_number}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 10) {
                                    setLitigant({...litigant, [e.target.name]: value});
                                }
                            }}
                        />
                        <div className="invalid-feedback">
                            { errors.mobile_number}
                        </div>
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
                            onChange={(e) => setLitigant({
                                ...litigant, [e.target.name]: e.target.value
                            })}
                        />
                        <div className="invalid-feedback">{errors.email_address}</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label>{t('custody')}<RequiredField /></label><br />
                        <div>
                            <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                name="is_custody" 
                                id="custodyYes" 
                                value={litigant.is_custody}
                                checked={ litigant.is_custody }
                                onChange={(e) => setLitigant({...litigant, [e.target.name]: true})} 
                            />
                            <label htmlFor="custodyYes">{t('yes')}</label>
                            </div>
                            <div className="icheck-danger d-inline mx-2">
                            <input 
                                type="radio" 
                                id="custodyNo" 
                                name="is_custody" 
                                value={litigant.is_custody}
                                checked={ !litigant.is_custody } 
                                onChange={(e) => setLitigant({...litigant, [e.target.name]: false, prison:''})}
                            />
                            <label htmlFor="custodyNo">{t('no')}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mt-2">
                    <div className='form-group'>
                        <label>{t('custody_days')}</label>
                        <input
                            type="text"
                            name="custody_days"
                            className={`${errors.custody_days ? 'is-invalid' : ''}`}
                            disabled={ !litigant.is_custody }
                            value={litigant.custody_days}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            {errors.custody_days}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mt-2">
                    <div className="form-group">
                        <label htmlFor="prison">{t('prison_name')}</label><br />
                        <select 
                            name="prison" 
                            id="prison" 
                            className={`form-control ${errors.prison ? 'is-invalid' : ''}`}
                            disabled={ !litigant.is_custody } 
                            value={litigant.prison}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value })}
                        >
                            <option value="">{t('alerts.select_prison')}</option>
                            { prisons.map((item, index) => (
                            <option value={item.prison_code} key={index}>{language === 'ta' ? item.prison_lname : item.prison_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.prison}</div>
                    </div>
                </div>  
                <div className="col-md-4 mt-2">
                    <div className="form-group">
                        <label>{t('accused_surrender')}<RequiredField /></label><br />
                        <div>
                            <div className="icheck-success d-inline mx-2">
                                <input 
                                    type="radio" 
                                    id="surrenderedYes" 
                                    name="is_surrendered" 
                                    value={litigant.is_surrendered}
                                    checked={ litigant.is_surrendered }
                                    onChange={(e) => setLitigant({...litigant, is_surrendered: true })}
                                />
                                <label htmlFor="surrenderedYes">{t('yes')}</label>
                            </div>
                            <div className="icheck-danger d-inline mx-2">
                                <input 
                                    type="radio" 
                                    id="surrenderedNo" 
                                    name="is_surrendered" 
                                    value={litigant.is_surrendered}
                                    checked={ !litigant.is_surrendered }
                                    onChange={(e) => setLitigant({...litigant, is_surrendered: false })}
                                />
                                <label htmlFor="surrenderedNo">{t('no')}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 my-2">
                    <Button 
                    variant="secondary"
                    onClick={handleSubmit}
                    ><i className="fa fa-plus mr-2"></i>{t('add_petitioner')}</Button>
                </div>
            </div>
        </form>
  )
}

export default PetitionerForm