import React, {useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { RequiredField } from 'utils';
import api from 'api';
import * as Yup from 'yup'
import { BaseContext } from 'contexts/BaseContext';
import { useTranslation } from 'react-i18next';
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import { MasterContext } from 'contexts/MasterContext';
import { LanguageContext } from 'contexts/LanguageContex';


const Petitioner = () => {
    const {efileNumber} = useContext(BaseContext)
    const [petitioners, setPetitioners] = useState([])
    const [selectedPetitioner, setSelectedPetitioner] = useState(null)
    const {t} = useTranslation()  
    
    useEffect(() => {
        const fetchPetitioners = async() => {
            try{
                const response = await api.get("litigant/list/", {params:{efile_no:efileNumber}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((petitioner)=> {
                        return petitioner.litigant_type === 1
                    })
                    setPetitioners(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efileNumber){
            fetchPetitioners()
        }
    },[])

    const addPetitioner = async(litigant) => {
        if(efileNumber){
            try{
                litigant.efile_no = efileNumber;
                const response = await api.post(`litigant/create/`, litigant, {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                })
                if(response.status === 201){
                    setPetitioners(petitioners => [...petitioners, litigant])
                    toast.success(t('alerts.petitioner_added').replace('{petitioner}', response.data.litigant_id), {
                    theme:"colored"
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
    }

    const editPetitioner = async(litigant_id) => {
        try{
            const response = await api.get(`litigant/${litigant_id}/read/`)
            setSelectedPetitioner(response.data)
        }catch(error){
            console.log(error)
        }

    }

    const deletePetitioner =async(petitioner) => {
        const newPetitioners = petitioners.filter((p) => {
            return p.litigant_id !== petitioner.litigant_id
        })
        try{
            if(window.confirm("Are you sure want to delete the litigant")){
                const response = await api.delete(`litigant/${petitioner.litigant_id}/delete/`)
                // if(response.status === 204){
                    setPetitioners(newPetitioners)
                    toast.error(t('alerts.petitioner_deleted').replace('{petitioner}', petitioner.litigant_id), {
                        theme: "colored"
                    }) 
                // }
            }
        }catch(error){
            console.log(error)
        }
    }
     
    return (
        <div className="container-fluid">
            <PetitionerList 
                petitioners={petitioners} 
                deletePetitioner={deletePetitioner} 
                editPetitioner={editPetitioner}
            />
            <PetitionerForm 
                addPetitioner={addPetitioner} 
                selectedPetitioner={selectedPetitioner}
            />
        </div>
    )
}

export default Petitioner


const PetitionerForm = ({addPetitioner, selectedPetitioner}) => {

  const {efileNumber} = useContext(BaseContext)
  const {masters: {
    states, 
    districts, 
    proofs, 
    taluks, 
    countries, 
    relations, 
    genders,
    nationalities
  }} = useContext(MasterContext)
  const {t} = useTranslation()
  const {language} = useContext(LanguageContext)
  const[alternateAddress, setAlternateAddress] = useState(false)
  const initialState = {
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
      post_office:'',
      pincode:'',
      nationality: 1,
      mobile_number:'',
      identify_proof:'',
      proof_number:'',
      email_address:'',
      identification_marks:'',
    }

  const[litigant, setLitigant] = useState(initialState)
  const[errors, setErrors] = useState({})
  
  useEffect(() => {
    if(selectedPetitioner){
      setLitigant(selectedPetitioner)
    }
  }, [selectedPetitioner])

  const validationSchema = Yup.object({
    litigant_name: Yup.string().required(),
    relation: Yup.string().required(),
    relation_name: Yup.string().required(),
    age: Yup.number().required(),
    gender: Yup.string().required(),
    mobile_number: Yup.number().required("The mobile number is required"),
    proof_number: Yup.string().required("Identify proof number is required"),

  })


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setLitigant((prevForm) => ({
        ...prevForm,
        [name]: value,  // Dynamically update the field
    }));

    // Validate the field and update errors
    const errorMessage = validateEmail(name, value);  // Validate the email field
    setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,  // Set the error message for the specific field
    }));
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    try{ 
      
      await validationSchema.validate(litigant, { abortEarly:false})
      addPetitioner(litigant);
    }catch(error){
      if(error.inner){
        const newErrors = {};
        error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }finally{
      setLitigant(initialState)
    }
  }

  return (
      <React.Fragment>
        <div className="row mt-2">  
          <ToastContainer />
          <div className="col-md-4">
            <Form.Group className="mb-3">
              <Form.Label>{t('petitioner_name')}<RequiredField /></Form.Label>
              <Form.Control
                type="text"
                name="litigant_name" 
                className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                value={litigant.litigant_name} 
                onChange={(e) => handleNameChange(e, setLitigant, litigant, 'litigant_name')}
              ></Form.Control>
              <div className="invalid-feedback">{ errors.litigant_name }</div>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group className="mb-3">
              <Form.Label>{t('gender')}<RequiredField /></Form.Label>
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
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group className="mb-3">
              <Form.Label>{t('age')}<RequiredField /></Form.Label>
              <Form.Control
                type="text"
                name="age"
                value={litigant.age}
                className={`${errors.age ? 'is-invalid' : ''}`}
                onChange={(e) => handleAgeChange(e, setLitigant, litigant)}
              ></Form.Control>
              <div className="invalid-feedback">{ errors.age }</div>
            </Form.Group>
          </div>
          <div className="col-md-4">
              <div className="form-group mb-3">
                <label htmlFor="relation">{t('relationship_type')}<RequiredField /></label><br />
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
              </div>
          </div>
          <div className="col-md-4">
            <Form.Group className="mb-3">
              <Form.Label>{t('relationship_name')}<RequiredField /></Form.Label>
              <Form.Control
                type="text"
                name="relation_name"
                value={litigant.relation_name}
                className={`${errors.relation_name ? 'is-invalid' : ''}`}
                onChange={(e) => handleNameChange(e, setLitigant, litigant, 'relation_name')}
              ></Form.Control>
              <div className="invalid-feedback">{ errors.relation_name }</div>
            </Form.Group>
          </div>
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
          <div className="col-md-9">
            <Form.Group className="mb-3">
              <Form.Label>{t('address')}</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={litigant.address}
                onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
              >
              </Form.Control>
            </Form.Group>
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
            <div className="form-group">
              <label htmlFor="">{t('identity_proof')}<RequiredField/></label>
              <select 
                name="identity_proof" 
                className="form-control"
                onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
              >
                <option value="">{t('alerts.select_proof')}</option>
                { proofs.map((p, index) => (
                  <option key={index} value={p.id}>{ language === 'ta' ? p.proof_lname : p.proof_name}</option>
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
              <select name="country" className="form-control">
                <option value="">Select country</option>
                {countries.map((c, index) => (
                  <option key={index} value={c.id}>{`+(${c.iso})`} {c.country_name}</option>
                ))}
              </select>
              <div className="invalid-feedback">
                { errors.mobile_number}
              </div>
            </Form.Group>
          </div>
          <div className="col-md-3">
            <Form.Group>
              <Form.Label>{t('mobile_number')}<RequiredField /></Form.Label>
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
        </div>
        <div className="row">
            <div className="col-md-3 mt-4">
              <div className="form-group">
                <Button 
                  variant="secondary"
                  onClick={handleSubmit}
                >
                  <i className="fa fa-plus mr-2"></i>{t('add_petitioner')}
                </Button>

              </div>
            </div>
        </div>
      </React.Fragment>
  )
}


const PetitionerList = ({petitioners, deletePetitioner, editPetitioner}) => {
  const {t} = useTranslation()
  return (
    <table className="table table-bordered table-striped table-sm">
      <thead className="bg-info">
        <tr>
          <th>{t('sl_no')}</th>
          <th>{t('petitioner')}</th>
          <th>{t('father_husband_guardian')}</th>
          <th>{t('age')}</th>
          <th>{t('address')}</th>
          <th>{t('action')}</th>
        </tr>
      </thead>
        <tbody>
          { petitioners.map((petitioner, index) => (
            <tr key={index}>
                <td>{index+1}</td>
                <td>{ petitioner.litigant_name }</td>
                <td>{ petitioner.relation_name }</td>
                <td>{ petitioner.age }</td>
                <td>{petitioner.address}</td>
                <td>
                  <Button 
                      variant="primary" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => editPetitioner(petitioner.litigant_id)}
                    >
                      <i className="fa fa-pencil-alt mr-2"></i>
                    {t('edit')}</Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => deletePetitioner(petitioner)}
                    >
                      <i className="fa fa-trash mr-2"></i>
                    {t('delete')}</Button>
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

