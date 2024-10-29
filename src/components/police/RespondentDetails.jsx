import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStates, getStatesStatus } from '../../redux/features/StateSlice'
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice'
import { getTalukByDistrictCode } from '../../redux/features/TalukSlice'
import { getPrisons } from '../../redux/features/PrisonSlice'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import { getRelations } from '../../redux/features/RelationSlice';
import * as Yup from 'yup'
import api from '../../api';



const RespondentDetails = ({respondent, addRespondent, respondents, setRespondent, deleteRespondent}) => {

    const dispatch = useDispatch()

    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const taluks = useSelector((state) => state.taluks.taluks)
    const relations = useSelector(state => state.relations.relations)
    const prisons = useSelector((state) => state.prisons.prisons)

    const stateStatus = useSelector(getStatesStatus)

    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        respondent_name: Yup.string().required(),
        relation: Yup.string().required(),
        relation_name: Yup.string().required(),
        age: Yup.number().required(),
        rank: Yup.string().required(),
        gender: Yup.string().required(),
        address: Yup.string().required(),
        act: Yup.string().required(),
        section: Yup.string().required(),
        address: Yup.string().required(),
        is_custody: Yup.boolean().required(),
    })


  useEffect(() => {
    if(stateStatus === 'idle'){
      dispatch(getStates())
    }
  },[stateStatus, dispatch])
  
  useEffect(() => {
    if(respondent.state !== ''){
      dispatch(getDistrictByStateCode(respondent.state))
    }
  },[respondent.state, dispatch])

  useEffect(() => {
    if(respondent.district !== ''){
      dispatch(getTalukByDistrictCode(respondent.district))
    }
  },[respondent.district, dispatch])

  useEffect(() => {
    if(respondent.is_custody){
      dispatch(getPrisons())
    }
  },[respondent.is_custody, dispatch])

  useEffect(() => {
    dispatch(getRelations())
  }, [dispatch])

  const handleSubmit = async() => {

    try{
        await validationSchema.validate(respondent, { abortEarly:false})
        addRespondent(respondent)
        setErrors({})

    }catch(error){
        if(error.inner){
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
        });
        console.log(error.inner)
        setErrors(newErrors);
      }
    }
  }

  return (
    <>
      <ToastContainer />
        <div className="row">
            <div className="col-md-12">
                { Object.keys(respondents).length > 0 && (
                    <table className="table table-bordered table-striped">
                        <thead className="bg-secondary">
                            <tr>
                                <th>S.No</th>
                                <th>Respondent Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Relation</th>
                                <th>Relation Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { respondents.map((res, index) => (
                            <tr key={index}>
                                <td>{ index+1 }</td>
                                <td>{ res.respondent_name }</td>
                                <td>{ res.age }</td>
                                <td>{ res.gender }</td>
                                <td>{ res.relation }</td>
                                <td>{ res.relation_name }</td>
                                <td>
                                    <EditIcon 
                                        color="primary"
                                        fontSize='medium'
                                        onClick={() => deleteRespondent(res)}
                                    />
                                    <DeleteIcon 
                                        variant='contained' 
                                        color='error' 
                                        className="ml-2"
                                        fontSize='medium'
                                        onClick={() => deleteRespondent(res)}
                                    >Delete</DeleteIcon>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>  
            <div className="col-md-3">
              <Form.Group className="mb-3">
                <Form.Label>Name of the Accused</Form.Label>
                <Form.Control
                  type="text"
                  name="respondent_name" 
                  className={`${errors.respondent_name ? 'is-invalid' : ''}`}
                  value={respondent.respondent_name}
                  onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                ></Form.Control>
                <div className="invalid-feedback">{ errors.respondent_name }</div>
              </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <select 
                        name="gender" 
                        value={respondent.gender} 
                        className={`form-control ${errors.gender ? 'is-invalid' : null}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    >   
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="invalid-feedback">
                        { errors.gender }
                    </div>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="text"
                        name="age"
                        value={respondent.age}
                        className={`${errors.age ? 'is-invalid' : ''}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                    <div className="invalid-feedback">{ errors.age }</div>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                    <Form.Label>Accused Rank</Form.Label>
                    <Form.Control
                        type="text"
                        name="rank"
                        value={respondent.rank}
                        className={`${errors.rank ? 'is-invalid': ''}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                    <div className="invalid-feedback">{ errors.rank }</div>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <div className="form-group mb-3">
                    <label htmlFor="relation">Relation</label><br />
                    <select 
                    name="relation" 
                    id="relation" 
                    className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                    value={respondent.relation}
                    onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    >
                    <option value="">Select relation</option>
                    { relations.map((item, index) => (
                        <option key={index} value={item.relation_name}>{ item.relation_name }</option>
                    )) }
                    </select>
                    <div className="invalid-feedback">{ errors.relation }</div>
                </div>
            </div>
            <div className="col-md-3">
                <Form.Group className="mb-3">
                    <Form.Label>Relation Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="relation_name"
                        value={respondent.relation_name}
                        className={`${errors.relation_name ? 'is-invalid' : ''}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                    <div className="invalid-feedback">{ errors.relation_name }</div>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <Form.Group className="mb-3">
                    <Form.Label>Act</Form.Label>
                    <Form.Control
                        type="text"
                        name="act"
                        value={respondent.act}
                        className={`${errors.act ? 'is-invalid': ''}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                    <div className="invalid-feedback">{ errors.act }</div>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Control
                        type="text"
                        name="section"
                        value={respondent.section.toString()}
                        className={`${errors.section ? 'is-invalid' : ''}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value })}
                    ></Form.Control>
                    <div className="invalid-feedback">{ errors.section }</div>
                </Form.Group>
            </div>
            <div className="col-md-4">
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={respondent.address}
                        className={`${errors.address ? 'is-invalid' : ''}`}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                    <div className="invalid-feedback">{ errors.address }</div>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="state">State</label><br />
                    <select 
                        name="state" 
                        id="state" 
                        className="form-control"
                        value={respondent.state}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
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
                        value={respondent.district}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    >
                        <option value="">Select District</option>
                        { districts.map((item, index) => (
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
                    value={respondent.taluk}
                    onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                >
                    <option value="">Select Taluk</option>
                    { taluks.map((item, index) => (
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
                        value={respondent.post_office}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <Form.Group className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                        type="text"
                        name="pincode"
                        value={respondent.pincode}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    ></Form.Control>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <Form.Group>
                    <Form.Label>Nationality</Form.Label>
                    <select 
                        name="nationality" 
                        className="form-control"
                        value={respondent.nationality}
                        onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                    >
                    <option value="1">Indian</option>
                    <option value="2">Others</option>
                    </select>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label>Whether Accused in Custody?</label><br />
                    <div>
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                name="is_custody" 
                                id="custodyYes" 
                                value={respondent.is_custody}
                                checked={ respondent.is_custody }
                                onChange={(e) => setRespondent({...respondent, is_custody: true})} 
                            />
                            <label htmlFor="custodyYes">Yes</label>
                        </div>
                        <div className="icheck-danger d-inline mx-2">
                            <input 
                                type="radio" 
                                id="custodyNo" 
                                name="is_custody" 
                                value={respondent.is_custody}
                                checked={ !respondent.is_custody } 
                                onChange={(e) => setRespondent({...respondent, is_custody: false})}
                            />
                            <label htmlFor="custodyNo">No</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-group">
                <label htmlFor="prison">Name of Prison / Jail / Sub Jail</label><br />
                <select 
                    name="prison" 
                    id="prison" 
                    className={`form-control ${errors.prison ? 'is-invalid' : ''}`}
                    disabled={ !respondent.is_custody } 
                    value={respondent.prison}
                    onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value })}
                >
                    <option value="">Select Prision</option>
                    { prisons.map((item, index) => (
                    <option value={item.prison_code} key={index}>{item.prison_name}</option>
                    ))}
                </select>
                <div className="invalid-feedback">{ errors.prison}</div>
                </div>
            </div>  
            <div className="col-md-2">
                <Form.Group>
                <Form.Label>No. of days in custody</Form.Label>
                <Form.Control
                    type="text"
                    name="custody_days"
                    disabled={ !respondent.is_custody }
                    value={respondent.custody_days}
                    onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value })}
                ></Form.Control>
                </Form.Group>
            </div>
            <div className="col-md-2">
                <div className="form-group">
                    <label>If accused Surrendered</label><br />
                    <div>
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                id="surrenderedYes" 
                                name="is_surrendered" 
                                value={respondent.is_surrendered}
                                checked={ respondent.is_surrendered }
                                onChange={(e) => setRespondent({...respondent, is_surrendered: true })}
                            />
                            <label htmlFor="surrenderedYes">Yes</label>
                        </div>
                        <div className="icheck-danger d-inline mx-2">
                            <input 
                                type="radio" 
                                id="surrenderedNo" 
                                name="is_surrendered" 
                                value={respondent.is_surrendered}
                                checked={ !respondent.is_surrendered }
                                onChange={(e) => setRespondent({...respondent, is_surrendered: false })}
                            />
                            <label htmlFor="surrenderedNo">No</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <Form.Group>
                <Form.Label>Identification marks of Accused</Form.Label>
                <Form.Control
                    type="text"
                    name="identification_marks"
                    value={respondent.identification_marks}
                    disabled={ !respondent.is_surrendered }
                    onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                ></Form.Control>
                </Form.Group>
            </div>
        </div>
        <div className="row">
            <div className="col-md-3 mt-4 pt-2">
            <Button 
                variant="contained"
                onClick={handleSubmit}
                ><i className="fa fa-plus mr-2"></i>Add respondent</Button>
            </div>
        </div>
    </>
  )
}

export default RespondentDetails