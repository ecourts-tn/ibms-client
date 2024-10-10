import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { RequiredField } from '../../utils';
import * as Yup from 'yup'
import { BaseContext } from '../../contexts/BaseContext';
import { RelationContext } from 'contexts/RelationContext';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { TalukContext } from 'contexts/TalukContext';
import { PrisonContext } from 'contexts/PrisonContext';
import { ProofContext } from 'contexts/ProofContext';
import { CountryContext } from 'contexts/CountryContext';
import { useTranslation } from 'react-i18next';


const PetitionerForm = ({addPetitioner}) => {

  const {fir, accused} = useContext(BaseContext)
  const {states} = useContext(StateContext)
  const {districts} = useContext(DistrictContext)
  const {taluks} = useContext(TalukContext)
  const {relations} = useContext(RelationContext)
  const {prisons} = useContext(PrisonContext)
  const {proofs} = useContext(ProofContext)
  const {countries} = useContext(CountryContext)
  const {t} = useTranslation()

  const[alternateAddress, setAlternateAddress] = useState(false)
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
      mobile_number:'',
      identify_proof:'',
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

  
  const validationSchema = Yup.object({
    litigant_name: Yup.string().required('Litigant name is required'),
    relation: Yup.string().required('Relation is required'),
    relation_name: Yup.string().required('Relation name is required'),
    age: Yup.number()
      .required('Age is required')
      .typeError('Age must be a number'),
    rank: Yup.string().required('Rank is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    mobile_number: Yup.number()
      .required('Mobile number is required')
      .typeError('Mobile number must be numeric'),
    proof_number: Yup.string().required('Identify proof number is required'),
    act: Yup.string().required('Act is required'),
    section: Yup.string().required('Section is required'),
    is_custody: Yup.boolean().required('Custody status is required'),
  
    // prison: Yup.string()
    //   .when('is_custody', {
    //     is: true,
    //     then: Yup.string().required('Details are required when custody is true'),
    //     otherwise: Yup.string().notRequired(),
    //   })
    //   .nullable(),
  
    // custody_days: Yup.string()
    //   .when('is_custody', {
    //     is: true,
    //     then: Yup.string().required('Number of custody days is required'),
    //     otherwise: Yup.string().notRequired(),
    //   })
    //   .nullable(),
  });

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

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(litigant, { abortEarly: false });
      addPetitioner(litigant);
    } catch (error) {
      console.log(error);
      if (error.inner) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Unexpected validation error:", error);
        toast.error("Validation failed. Please check your input.", { theme: "colored" });
      }
      if (error.response) {
        toast.error(error.response, { theme: "colored" });
      }
    }
  };
  

  return (
    <>
      <ToastContainer />
        { accused.length > 0 && (
          <div className="row">
            <div className="col-md-4 mb-3">
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
              <Form.Group className="mb-3">
                <Form.Label>{t('name_of_litigant')}<RequiredField /></Form.Label>
                <Form.Control
                  type="text"
                  name="litigant_name" 
                  className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                  value={litigant.litigant_name} 
                  readOnly={litigant.litigant !== 'o' ? 'readOnly' : false }
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
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
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                      <option value="">Select parantage</option>
                      { relations.map((item, index) => (
                        <option key={index} value={item.relation_name}>{ item.relation_name }</option>
                      )) }
                    </select>
                    <div className="invalid-feedback">{ errors.relation }</div>
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
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                    <option value="">Select state</option>
                    { states.map((item, index) => (
                      <option value={item.state_code} key={index}>{item.state_name}</option>
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
                    <option value="">Select District</option>
                    { districts.filter(district=>parseInt(district.state)===parseInt(litigant.state)).map((item, index) => (
                      <option value={item.district_code} key={index}>{item.district_name}</option>
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
                    <option value="">Select Taluk</option>
                    { taluks.filter(taluk=>parseInt(taluk.district)===parseInt(litigant.district)).map((item, index) => (
                      <option value={item.taluk_code} key={index}>{ item.taluk_name }</option>
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
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                  <option value="1">Indian</option>
                  <option value="2">Others</option>
                </select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="">{t('identity_proof')}<RequiredField/></label>
                <select 
                  name="identity_proof" 
                  className="form-control"
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                >
                  <option value="">Select proof</option>
                  { proofs.map((p, index) => (
                    <option key={index} value={p.id}>{p.proof_name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>{t('identity_proof_number')}<RequiredField /></Form.Label>
                <Form.Control
                  type="text"
                  name="proof_number"
                  value={litigant.proof_number}
                  className={`${errors.proof_number ? 'is-invalid' : ''}`}
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.proof_number }</div>
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group>
                <Form.Label>{t('country_code')}<RequiredField /></Form.Label>
                <select 
                  name="country_code" 
                  className="form-control"
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                >
                  <option value="">Select country</option>
                  {countries.map((c, index) => (
                    <option key={index} value={c.iso}>{`+(${c.iso})`} {c.country_name}</option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  { errors.country_code}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>{t('mobile_number')} (for Communication)<RequiredField /></Form.Label>
                <Form.Control
                  type="text"
                  name="mobile_number"
                  className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                  value={litigant.mobile_number}
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                  onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.email_address }</div>
              </Form.Group>
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
                    <option value="">Select Prison</option>
                    { prisons.map((item, index) => (
                      <option value={item.prison_code} key={index}>{item.prison_name}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{ errors.prison}</div>
                </div>
              </div>  
              <div className="col-md-2 mt-2">
                <Form.Group>
                  <Form.Label>{t('custody_days')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="custody_days"
                    className={`${errors.custody_days ? 'is-invalid' : ''}`}
                    disabled={ !litigant.is_custody }
                    value={litigant.custody_days}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value })}
                  ></Form.Control>
                  <div className="invalid-feedback">
                    {errors.custody_days}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-2 mt-2">
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
              {/* <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Identification marks of Accused<RequiredField /></Form.Label>
                  <Form.Control
                    type="text"
                    name="identification_marks"
                    value={litigant.identification_marks}
                    onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                  ></Form.Control>
                </Form.Group>
              </div> */}
              <div className="col-md-3 mt-4 pt-2">
                <Button 
                  variant="secondary"
                  onClick={handleSubmit}
                  ><i className="fa fa-plus mr-2"></i>{t('add_petitioner')}</Button>
              </div>
          </div>
    </>
  )
}

export default PetitionerForm