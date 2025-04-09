import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { RequiredField } from 'utils';
import * as Yup from 'yup'
import api from 'api';
import { BaseContext } from  'contexts/BaseContext';
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
        litigant_name: Yup.string().required(),
        relation: Yup.string().required(),
        relation_name: Yup.string().required(),
        age: Yup.number().required().typeError("This is field should be numeric"),
        rank: Yup.string().required(),
        gender: Yup.string().required(),
        address: Yup.string().required(),
        mobile_number: Yup.number().required("The mobile number is required").typeError("This is field should be numeric"),
        act: Yup.string().required(),
        section: Yup.string().required(),
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLitigant((prevForm) => ({
            ...prevForm,
            [name]: value,  // Dynamically update the field
        }));
        const errorMessage = validateEmail(name, value);  // Validate the email field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,  // Set the error message for the specific field
        }));
    };

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
            // await validationSchema.validate(litigant, { abortEarly:false})
            await validationSchema.validate(litigant, { abortEarly: false });
            console.log(litigant)
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
            } else {
                console.error("Error:", error);
                toast.error("An unexpected error occurred", { theme: "colored" });
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
                <Form.Group className="mb-3">
                <Form.Label>{t('name_of_litigant')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="litigant_name" 
                    className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                    value={litigant.litigant_name} 
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : false }
                    onChange={(e) => handleNameChange(e, setLitigant, litigant, 'litigant_name')}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.litigant_name }</div>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                <Form.Label>{t('gender')}<RequiredField /></Form.Label>
                { litigant.litigant !== 'o' && (
                    <Form.Control 
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.gender}
                    ></Form.Control>
                )}
                { litigant.litigant === 'o' && (
                    <select 
                    name="gender" 
                    value={litigant.gender} 
                    className="form-control"
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                    <option value="">{t('alerts.select_gender')}</option>
                    { genders.map((g, index) => (
                        <option value={g.name} key={index}>{language === 'ta' ? g.gender_lname : g.gender_name }</option>
                    ))}
                    </select>
                )}
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                <Form.Label>{t('age')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="age"
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.age}
                    className={`${errors.age ? 'is-invalid' : ''}`}
                    onChange={(e) => handleAgeChange(e, setLitigant, litigant)}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.age }</div>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                <Form.Label>{t('accused_rank')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="rank"
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.rank}
                    className={`${errors.rank ? 'is-invalid': ''}`}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.rank }</div>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <div className="form-group mb-3">
                    <label htmlFor="relation">{t('relationship_type')}<RequiredField /></label><br />
                    { litigant.litigant !== 'o' && (
                    <Form.Control 
                        value={litigant.relation}
                        readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                        ></Form.Control>
                    )}
                    { litigant.litigant === 'o' && (
                    <>
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
                    </>  
                    )}
                </div>
            </div>
            <div className="col-md-3">
                <Form.Group className="mb-3">
                <Form.Label>{t('relationship_name')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="relation_name"
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.relation_name}
                    className={`${errors.relation_name ? 'is-invalid' : ''}`}
                    onChange={(e) => handleNameChange(e, setLitigant, litigant, 'relation_name')}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.relation_name }</div>
                </Form.Group>
            </div>
            <div className="col-md-4">
                <Form.Group className="mb-3">
                <Form.Label>{t('act')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="act"
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.act}
                    className={`${errors.act ? 'is-invalid': ''}`}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.act }</div>
                </Form.Group>
            </div>
            <div className="col-md-5">
                <Form.Group className="mb-3">
                <Form.Label>{t('section')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="section"
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.section.toString()}
                    className={`${errors.section ? 'is-invalid' : ''}`}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value })}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.section }</div>
                </Form.Group>
            </div>
            <div className="col-md-12">
                <Form.Group className="mb-3">
                <Form.Label>{t('address')}<RequiredField /></Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    readOnly={litigant.litigant !== 'o' ? 'readOnly' : null }
                    value={litigant.address}
                    className={`${errors.address ? 'is-invalid' : ''}`}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.address }</div>
                </Form.Group>
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
                    id="state" 
                    className="form-control"
                    value={litigant.state}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                    <option value="">{t('alerts.select_state')}</option>
                    { states.map((item, index) => (
                        <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                    ))}
                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="district">{t('district')}</label><br />
                    <select 
                    name="district" 
                    id="district" 
                    className="form-control"
                    value={litigant.district}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                    <option value="">{t('alerts.select_district')}</option>
                    { districts.filter(district=>parseInt(district.state)===parseInt(litigant.state)).map((item, index) => (
                        <option value={item.district_code} key={index}>{language === 'ta' ? item.district_lname : item.district_name}</option>
                    ))}
                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="taluk">{t('taluk')}</label><br />
                    <select 
                    name="taluk" 
                    id="taluk" 
                    className="form-control"
                    value={litigant.taluk}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                    <option value="">{t('alerts.select_taluk')}</option>
                    { taluks.filter(taluk=>parseInt(taluk.district)===parseInt(litigant.district)).map((item, index) => (
                        <option value={item.taluk_code} key={index}>{ language === 'ta' ? item.taluk_lname : item.taluk_name }</option>
                    ))}
                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <Form.Group>
                <Form.Label>{t('post_office')}</Form.Label>
                <Form.Control
                    type="text"
                    name="post_office"
                    value={litigant.post_office}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                ></Form.Control>
                </Form.Group>
            </div>
            <div className="col-md-9">
                <Form.Group className="mb-3">
                <Form.Label>{t('address')}</Form.Label>
                <Form.Control
                    type="text"
                    name="address2"
                    value={litigant.address2}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                >
                </Form.Control>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <Form.Group className="mb-3">
                <Form.Label>{t('pincode')}</Form.Label>
                <Form.Control
                    type="text"
                    name="pincode"
                    value={litigant.pincode}
                    onChange={(e) => handlePincodeChange(e, setLitigant, litigant)}
                ></Form.Control>
                </Form.Group>
            </div>
            </div>
            )}
            <div className="row">
            <div className="col-md-3">
                <Form.Group>
                <Form.Label>{t('nationality')}<RequiredField /></Form.Label>
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
                </Form.Group>
            </div>
            <div className="col-md-3">
                <Form.Group>
                <Form.Label>{t('country_code')}</Form.Label>
                <select name="country" className="form-control">
                    <option value="">{t('alerts.select_country')}</option>
                    {countries.map((c, index) => (
                    <option key={index} value={c.iso}>{`+(${c.iso})`} {c.country_name}</option>
                    ))}
                </select>
                <div className="invalid-feedback">
                    { errors.mobile_number}
                </div>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <Form.Group>
                <Form.Label>{t('mobile_number')}</Form.Label>
                <Form.Control
                    type="text"
                    name="mobile_number"
                    className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                    value={litigant.mobile_number}
                    onChange={(e) => handleMobileChange(e, setLitigant, litigant, 'mobile_number')}
                ></Form.Control>
                <div className="invalid-feedback">
                    { errors.mobile_number}
                </div>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <Form.Group>
                <Form.Label>{t('email_address')}</Form.Label>
                <Form.Control
                    type="text"
                    name="email_address"
                    value={litigant.email_address}
                    className={`${errors.email_address ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    // onBlur={() => handleBlur(litigant, setErrors)}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.email_address }</div>
                </Form.Group>
            </div>
            <div className="col-md-3 mt-4 pt-2">
            <Button 
                variant="secondary"
                onClick={handleSubmit}
                ><i className="fa fa-plus mr-2"></i>{t('add_litigant')}</Button>
            </div>
        </div>
        </div>
    )
}

export default AccusedForm