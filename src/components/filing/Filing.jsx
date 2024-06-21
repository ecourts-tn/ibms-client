import React from 'react'
import { useState, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { getDistrictByStateCode, getDistrictsStatus } from '../../redux/features/DistrictSlice';
import Form from 'react-bootstrap/Form'
import { getStatesStatus, getStates } from '../../redux/features/StateSlice';
import { getTaluksStatus } from '../../redux/features/TalukSlice';
import { getCaseTypeStatus,getCaseTypes } from '../../redux/features/CaseTypeSlice';
import { getBailTypeByCaseType, getBailTypeStatus } from '../../redux/features/BailTypeSlice';
import { getCourtsStatus } from '../../redux/features/CourtSlice';
import { getRelations, getRelationStatus } from '../../redux/features/RelationSlice';
import { getEstablishmentByDistrict, getEstablishmentsStatus } from '../../redux/features/EstablishmentSlice';
import CaseDetails from './CaseDetails';
import PetitionerContainer from '../petitioner/PetitionerContainer';
import GroundsContainer from '../grounds/GroundsContainer';
import AdvocateContainer from '../advocate/AdvocateContainer';
import RespondentContainer from '../respondent/RespondentContainer';


const Filing = () => {
  
  const dispatch = useDispatch()
  const stateStatus = useSelector(getStatesStatus);
  const caseTypeStatus = useSelector(getCaseTypeStatus)
  const relationStatus = useSelector(getRelationStatus)


  const [casetype, setCasetype] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [establishment, setEstablishment] = useState('')
  const [courtType, setCourtType]  = useState(1)


  const states = useSelector((state) => state.states.states)
  const districts = useSelector((state) => state.districts.districts)
  const taluks = useSelector((state) => state.taluks.taluks)
  const casetypes = useSelector((state) => state.casetypes.casetypes)
  const bailtypes = useSelector((state) => state.bailtypes.bailtypes)
  const relations = useSelector(state => state.relations.relations)
  const establishments = useSelector(state => state.establishments.establishments)
  // const petitioners = useSelector(state => state.filing.petitioners)

  const prisons = [
    {
      prison_code:1,
      prison_name: "test prison"}
  ]

  // const initialPetitioner = {
  //   petitioner_name: '',
  //   rank: '',
  //   act: '',
  //   section: '',
  //   relation: '',
  //   relation_name: '',
  //   age:'',
  //   address:'',
  //   state:'',
  //   district:'',
  //   taluk:'',
  //   post_office:'',
  //   pincode:'',
  //   aadhar_number:'',
  //   mobile_number:'',
  //   email_address:'',
  //   is_custody:'',
  //   prision: '',
  //   days_in_custody:'',
  //   is_surrendered:'',
  //   identification_marks:'',
  //   identification_marks: ''
  // }

  const[petitioners, setPetitioners] = useState([])
  const[petitioner, setPetitioner] = useState({})
  const[grounds, setGrounds] = useState([])
  const[ground, setGround] = useState('')

  // const addPetitioner = () => {
  //   setPetitioners([...petitioners, petitioner])
  //   setPetitioner(initialPetitioner)
  // }

  // const editPetitioner = (id) => {

  // }

  // const deletePetitioner = (id) => {
  //   const newPetitioners = petitioners.filter(p => p.key !== id)
  //   setPetitioners(newPetitioners)
  // }




  useEffect(() => {
    if(relationStatus === 'idle'){
      dispatch(getRelations())
    }
  }, [relationStatus, dispatch])

  useEffect(() => {
    if(caseTypeStatus === 'idle'){
      dispatch(getCaseTypes())
    }
  }, [caseTypeStatus, dispatch])

  useEffect(() => {
    if(casetype !== ''){
      dispatch(getBailTypeByCaseType(casetype));
    }
  }, [casetype, dispatch]);

  useEffect(() => {
    if(stateStatus === 'idle'){
      dispatch(getStates())
    }
  }, [stateStatus, dispatch])

  // useEffect(() => {
  //   if(state !== ''){
  //     setLoading(true)
  //     dispatch(getDistrictByStateCode(state))
  //   }
  //   setLoading(false)
  // }, [state, dispatch])

  useEffect(() => {
    if(district !== ''){
      dispatch(getEstablishmentByDistrict(2))
    }
  },[district, dispatch])

  // useEffect(() => {
  //   if(talukStatus === 'idle'){
  //     dispatch(getTaluks())
  //   }
  // }, [talukStatus, dispatch])

  // useEffect(() => {
  //   if(bailTypeStatus === 'idle'){
  //     dispatch(getAllBailTypes())
  //   }
  // }, [bailTypeStatus, dispatch])

  // useEffect(() => {
  //   if(courtStatus === 'idle'){
  //     dispatch(getAllCourts)
  //   }
  // }, [getAllCourts, dispatch])

  return (
    <>
      <div className="content-wrapper">
      <div className="container-fluid mt-3">
        <div className="card card-outline card-primary">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Basic Details</strong></h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-center">
                <div className="btn-group btn-group-toggle mb-3" data-toggle="buttons">
                  <label className="btn bg-olive active">
                    <input type="radio" name="options" id="option_b1" autoComplete="off" defaultChecked onClick={(e) => setCourtType(1)}/> High Court
                  </label>
                  <label className="btn bg-olive">
                    <input type="radio" name="options" id="option_b2" autoComplete="off" onClick={(e) => setCourtType(2)} /> District Court
                  </label>
                </div>
              </div>
              { courtType == 1 && (
              <div className="col-md-6 offset-3">
                <div className="form-group">
                  <label htmlFor="bench_type">High Court Bench</label>
                  <select name="bench_type" id="bench_type" className="form-control">
                    <option value="">Select bench</option>
                    <option value="mas_bench">Principal Seat</option>
                    <option value="mdu_bench">Madurai Bench</option>
                  </select>
                </div>
              </div>
              )}
            </div>  
            { courtType == 2 && (
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <select name="state" id="state" className="form-control" value={state} onChange={(e) => setState(e.target.value)}>
                      <option value="">Select state</option>
                      { states.map( (item, index) => (
                          <option key={index} value={item.id}>{item.state_name}</option>)
                      )}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="district">District</label>
                  <select 
                    name="district" 
                    id="district" 
                    className="form-control"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                      <option value="">Select district</option>
                      { districts.map( (item, index) => (
                          <option key={index} value={item.district_code}>{item.district_name}</option>)
                      )}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="establishment">Establishment Name</label>
                  <select 
                    name="establishment" 
                    id="establishment" 
                    className="form-control"
                    value={establishment}
                    onChange={(e) => setEstablishment(e.target.value)}
                  >
                    <option value="">Select Establishment</option>
                    { establishments.map((item, index) => (
                      <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="court_name">Court Name</label>
                  <select name="court_name" id="court_name" className="form-control">
                    <option value="court1">Court 1</option>
                    <option value="court2">Court 2</option>
                  </select>
                </div>
              </div>
            </div>
            )}
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="case_type">Case Type</label>
                  <select name="case_type" id="case_type" className="form-control" value={casetype} onChange={(e) => setCasetype(e.target.value)}>
                    <option value="">Select type</option>
                    { casetypes.map( (item, index) => (
                      <option key={index} value={item.id}>{item.type_full_form}</option>)
                    )}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="bail_type">Bail Type</label>
                  <select name="bail_type" id="bail_type" className="form-control">
                    <option value="">Select type</option>
                    { bailtypes.map((item, index) => (
                      <option key={index} value={item.id}>{ item.type_name }</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Compliant Type</Form.Label>
                  <select 
                    name="compliant_type" 
                    id="compliant_type"
                    className="form-control"              
                  ></select>
                </Form.Group>
              </div>
              <div className="col-sm-3" style={{ marginTop:'40px'}}>
                {/* <div className="form-group clearfix">
                  <label htmlFor="" className="mr-2">Crime Registered?</label>
                  <div className="icheck-success d-inline mx-2">
                    <input type="radio" id="radioPrimary1" name="r1" onClick={(e) => setIsCrimeRegistered(true)} />
                    <label htmlFor="radioPrimary1">Yes</label>
                  </div>
                  <div className="icheck-danger d-inline mx-2">
                    <input type="radio" id="radioPrimary2" name="r1" onClick={(e) => setIsCrimeRegistered(false)}/>
                    <label htmlFor="radioPrimary2">No</label>
                  </div>
                  <div className="icheck-primary d-inline mx-2">
                    <input type="radio" id="radioPrimary3" name="r1" onClick={(e) => setIsCrimeRegistered(false)}/>
                    <label htmlFor="radioPrimary3">Not Known</label>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="card card-outline card-secondary">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-file mr-2"></i><strong>Case Details</strong></h3>
          </div>
          <div className="card-body">
            <CaseDetails />
          </div>
        </div>
        <PetitionerContainer />
        <RespondentContainer />
        <GroundsContainer />
        {/* <div className="card card-outline card-danger">
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>Petitioner Details</strong></h3>
              <Button variant="primary" onClick={handleShow}>
                Petitioners <Badge bg="warning" className="ml-2">{ petitioners.length }</Badge>
              </Button>
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
                <PetitionerList petitioners={petitioners}></PetitionerList>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="card-body">
            <PetitionerForm />
          </div>
        </div> */}
        {/* <div className="card card-outline card-info">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-file mr-2"></i><strong>Grounds</strong></h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                { grounds.map((item, index) => (
                    <div className="alert alert-light" style={{ minHeight:'60px'}}>{item}
                      <span className="float-right">
                        <button className="btn btn-danger btn-sm">Delete</button>
                        <button className="btn btn-info btn-sm ml-1">Edit</button>
                      </span>
                    </div>
                ))}
                <div className="form-group">
                  <textarea 
                    name="grounds" 
                    id="grounds" 
                    rows="4" 
                    className="form-control"
                    value={ground}
                    onChange={(e) => setGround(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button 
              type="button" 
              id="add_ground_button" 
              className="btn btn-info float-right"
              onClick={addGrounds}
            ><i className="fa fa-plus mr-2"></i>Add Ground</button>
          </div>
        </div> */}
        <div className="card card-outline card-secondary">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-download mr-2"></i><strong>Previous Case Details</strong></h3>
          </div>
          <div className="card-body">
          <div className="row mt-4">
              <div className="col-md-2">
                <label htmlFor="previous_application">Previous Application Filed:</label><br />
              </div>
              <div className="col-md-2">
                <input type="text" name="case_no" id="case_no" placeholder="Case No" className="form-control"/>
              </div>
              <div className="col-md-2">
                <input type="text" name="case_year" id="case_year" placeholder="Case Year" className="form-control"/>
              </div>
              <div className="col-md-2">
                <input type="text" name="status" id="status" placeholder="Status" className="form-control"/>
              </div>
              <div className="col-md-2">
                <input type="text" name="date_of_disposal" id="date_of_disposal" placeholder="Date of Disposal if Disposed" className="form-control"/>
              </div>
              <div className="col-md-2">
                <textarea name="proceeding" id="proceeding" placeholder="Proceeding" className="form-control" rows="1"></textarea>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-5">
                <div className="form-group">
                  <label>Are the above case details correct?</label>
                  <input type="radio" name="are_details_correct" id="details_correct_yes" value="yes" className="ml-3" />
                  <label htmlFor="details_correct_yes">Yes</label>
                  <input type="radio" name="are_details_correct" id="details_correct_no" value="no" className="ml-2"/>
                  <label htmlFor="details_correct_no">No</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="remarks">Remarks:</label><br />
                  <textarea name="remarks" id="remarks" className="form-control" rows="3"></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="previous_bail_application">Any Previous Bail Application Pending?</label>
                  <input type="radio" name="previous_bail_application" id="previous_bail_yes" value="yes" className="ml-3"/>
                  <label htmlFor="previous_bail_yes">Yes</label>
                  <input type="radio" name="previous_bail_application" id="previous_bail_no" value="no" className="ml-2" />
                  <label htmlFor="previous_bail_no">No</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card card-outline card-success">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-map-marker mr-2"></i><strong>Jurisdiction Court Details</strong></h3>
          </div>
          <div className="card-body">
          <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <select name="state" id="state" className="form-control" value={state} onChange={(e) => setState(e.target.value)}>
                      <option value="">Select state</option>
                      { states.map( (item, index) => (
                          <option key={index} value={item.id}>{item.state_name}</option>)
                      )}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="district">District</label>
                  <select 
                    name="district" 
                    id="district" 
                    className="form-control"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                      <option value="">Select district</option>
                      { districts.map( (item, index) => (
                          <option key={index} value={item.district_code}>{item.district_name}</option>)
                      )}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="establishment">Establishment Name</label>
                  <select 
                    name="establishment" 
                    id="establishment" 
                    className="form-control"
                    value={establishment}
                    onChange={(e) => setEstablishment(e.target.value)}
                  >
                    <option value="">Select Establishment</option>
                    { establishments.map((item, index) => (
                      <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="court_name">Court Name</label>
                  <select name="court_name" id="court_name" className="form-control">
                    <option value="court1">Court 1</option>
                    <option value="court2">Court 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdvocateContainer />
        {/* <div className="card card-outline card-info">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-graduation-cap mr-2"></i><strong>Advocate Details</strong></h3>
          </div>
          <div className="card-body">
            <div className="row">
            <div className="col-md-4">
                <label htmlFor="advocate_name">Name of Advocate:</label>
                <input type="text" name="advocate_name" id="advocate_name" className="form-control"/>
              </div>
              <div className="col-md-2">
                <label htmlFor="">Enrollment Number</label>
                <input type="text" name="enrollment_no" id="enrollment_no" placeholder="Enrollment No" className="form-control"/>
              </div>
              <div className="col-md-2">
                <label htmlFor="">Mobile Number</label>
                <input type="text" name="advocate_mobile_no" id="advocate_mobile_no" placeholder="Mobile No" className="form-control"/>
              </div>
              <div className="col-md-2">
                <label htmlFor="">Email Address</label>
                <input type="text" name="advocate_email" id="advocate_email" placeholder="Email ID" className="form-control"/>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end">
              <button type="button" id="add_another_advocate_button" className="btn btn-info"><i className="fa fa-plus mr-2"></i>Add Advocate</button>
          </div>
        </div> */}
        <div className="card card-outline card-success">
          <div className="card-body">
            <div className="row mt-3">
              <div className="col-md-12"> 
                <div className="form-group">
                  <label htmlFor="vakkalat_memo">Upload Vakkalat / Memo of Appearance:</label><br />
                  <input type="file" name="vakkalat_memo" id="vakkalat_memo" />
                </div>
              </div>
              <button type="button" id="generate_affidavit_button" className="btn btn-dark mt-2">Sworn Affidavit</button>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <input type="checkbox" name="declaration" id="declaration" /> I solemnly state that the contents provided by me are true to the best of my knowledge and belief. And that conceals nothing and that no part of it is false. 
              </div>
              <div className="col-md-12">
                <input type="checkbox" name="declaration" id="declaration" /> I have signed the form by means of an electronic signature. 
              </div>
            </div>
          </div>
          <div className="card-footer text-center">
            <button type="submit" className="btn btn-success"><i className="fa fa-paper-plane mr-2"></i>Final Submit</button>
          </div>
        </div>  
      </div>
      </div>
    </>
  )
}

export default Filing




