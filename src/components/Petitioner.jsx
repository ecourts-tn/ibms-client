import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import PetitionerForm from './PetitionerForm'
import PetitionerList from './PetitionerList'
import {toast, ToastContainer} from 'react-toastify'
import { BaseContext } from 'contexts/BaseContext'
import { StateContext } from 'contexts/StateContext'
import api from 'api'

const Petitioner = () => {

    const [show, setShow] = useState(false);
    const[petitioners, setPetitioners] = useState([])
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const efile_no = sessionStorage.getItem("efile_no")
    useEffect(() => {
        const fetchPetitioners = async() => {
            if(efile_no){
                const response = await api.get("litigant/list", {params:{efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((petitioner)=> {
                        return petitioner.litigant_type === 1
                    })
                    setPetitioners(filtered_data)
                }
            }
        }
        fetchPetitioners()
    },[])

    const addPetitioner = async(litigant) => {
        if(efile_no){
            try{
                const response = await api.post(`litigant/create/`, litigant, {
                    params: {
                    efile_no
                    }
                })
                if(response.status === 201){
                    setPetitioners(petitioners => [...petitioners, litigant])
                    toast.success(`Petitioner ${response.data.litigant_id} added successfully`, {
                    theme:"colored"
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
    }

    const deletePetitioner =async (petitioner) => {
        try{
            const newPetitioners = petitioners.filter((p) => {
                return p.litigant_id !== petitioner.litigant_id
            })
            setPetitioners(newPetitioners)
            toast.error(`Petitioner ${petitioner.litigant_id} deleted successfuly`, {
                theme: "colored"
            })

        }catch(error){
            console.error(error)
        }
    }
     
    return (
        <div className="container mt-4">
            <div className="card card-outline card-danger">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>Petitioner Details</strong></h3>
                        { petitioners.length > 0 && (
                            <Button variant="warning" onClick={handleShow}>
                                <i className="fas fa-users mr-2"></i>Petitioners <Badge bg="success" className="ml-2">{ petitioners.length }</Badge>
                            </Button>
                        )}
                    </div>
                    <Modal 
                        show={show} 
                        onHide={handleClose} 
                        backdrop="static"
                        keyboard={false}
                        size="xl"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title><strong>Petitioners</strong></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PetitionerList petitioners={petitioners} deletePetitioner={deletePetitioner}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="card-body">
                    <PetitionerForm addPetitioner={addPetitioner} petitioners={petitioners}/>
                </div>
            </div>
        </div>
    )
}

export default Petitioner

const PetitionerForm = ({addPetitioner}) => {
  const {fir, accused} = useContext(BaseContext)
  const {states} = useContext(StateContext)
  const {districts} = useContext(DistrictContext)
  const {taluks} = useContext(TalukContext)
  const {relations} = useContext(RelationContext)
  const {prisons} = useContext(PrisonContext)
  const {proofs} = useContext(ProofContext)
  const {countries} = useContext(CountryContext)

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
                <Form.Label>Name of the litigant<RequiredField /></Form.Label>
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
                <Form.Label>Gender<RequiredField /></Form.Label>
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
                <Form.Label>Age<RequiredField /></Form.Label>
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
                <Form.Label>Accused Rank<RequiredField /></Form.Label>
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
                  <label htmlFor="relation">Parentage<RequiredField /></label><br />
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
                <Form.Label>Parentage Name<RequiredField /></Form.Label>
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
                <Form.Label>Act<RequiredField /></Form.Label>
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
                <Form.Label>Section<RequiredField /></Form.Label>
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
                <Form.Label>Address<RequiredField /></Form.Label>
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
                <input type="checkbox" name={alternateAddress} onChange={(e) => setAlternateAddress(!alternateAddress)} className="mr-2"/><span className="text-primary"><strong>Add alternate address</strong></span>
              </div>
            </div>
          </div>
          { alternateAddress && (
          <div className="row">
            <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="state">State</label><br />
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
                  <label htmlFor="district">District</label><br />
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
                  <label htmlFor="taluk">Taluk</label><br />
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
                <Form.Label>Post Office</Form.Label>
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
                <Form.Label>Address</Form.Label>
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
                <Form.Label>Pincode</Form.Label>
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
                <Form.Label>Nationality<RequiredField /></Form.Label>
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
                <label htmlFor="">Identify Proof<RequiredField/></label>
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
                <Form.Label>Identity Proof Number<RequiredField /></Form.Label>
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
                <Form.Label>Country Code<RequiredField /></Form.Label>
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
                <Form.Label>Mobile Number (for Communication)<RequiredField /></Form.Label>
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
                <Form.Label>Email Address</Form.Label>
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
                  <label>Whether Accused in Custody?<RequiredField /></label><br />
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
                      <label htmlFor="custodyYes">Yes</label>
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
                      <label htmlFor="custodyNo">No</label>
                    </div>
                  </div>
                </div>
            </div>
            <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label htmlFor="prison">Name of Prison / Jail / Sub Jail</label><br />
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
                  <Form.Label>No. of days in custody</Form.Label>
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
                  <label>If accused Surrendered<RequiredField /></label><br />
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
                      <label htmlFor="surrenderedYes">Yes</label>
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
                      <label htmlFor="surrenderedNo">No</label>
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
                  ><i className="fa fa-plus mr-2"></i>Add Petitioner</Button>
              </div>
          </div>
    </>
  )
}


const PetitionerList = ({petitioners, deletePetitioner}) => {

  return (
    <>
      { petitioners.map((petitioner, index) => (
        <div className="card" key={index}>
          <div className="card-body">
            <table className="table no-border litigant-table">
              <tr>
                <td>Petitioner Name</td>
                <td>:</td>
                <td>{ petitioner.litigant_name }, {petitioner.age} , {petitioner.gender}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>:</td>
                <td>{petitioner.address}</td>
              </tr>
            </table>
            <div className="mt-2">
              <Button 
                variant="primary" 
                size="sm" 
                className="mr-2"
              >
                <i className="fa fa-pencil-alt mr-2"></i>
              Edit</Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => deletePetitioner(petitioner)}
              >
                <i className="fa fa-trash mr-2"></i>
              Delete</Button>
            </div>
          </div>
        </div>
        
      ))}
      { petitioners.length === 0 && (<span className="text-danger"><strong>No records found</strong></span>)}
    </>
  )
}

