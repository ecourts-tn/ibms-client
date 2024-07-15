import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import BasicContainer from '../../basic/BasicContainer';
import CaseSearch from '../../search/CaseSearch';
import CaseDetails from '../../filing/CaseDetails';
import GroundsContainer from '../../grounds/GroundsContainer';
import PetitionerContainer from '../../petitioner/PetitionerContainer';
import RespondentContainer from '../../respondent/RespondentContainer';
import PreviousCaseContainer from '../../history/PreviousCaseContainer';
import AdvocateContainer from '../../advocate/AdvocateContainer';
import DocumentContainer from '../../documents/DocumentContainer';
import Payment from '../../pages/Payment';


// import './style.css';

const MuiStepper = () => {
  const [name, setName] = useState('React');
  const[petition, setPetition] = useState({})
  const[petitioners, setPetitioners] = useState([])
  const[respondents, setRespondents] = useState([])
  const[grounds, setGrounds] = useState([])
  const stepperRef = useRef(null);

  useEffect(() => {
    stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true,
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container-fluid px-md-5">
      <div className="row">
        <div className="col-md-12">
        <nav aria-label="breadcrumb" className="mt-2 mb-1">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item"><a href="#">Filing</a></li>
            <li className="breadcrumb-item active" aria-current="page">Bail Petition</li>
          </ol>
        </nav>
          <div className="card">
            <div className="card-body p-1">
              <div id="stepper1" className="bs-stepper">
                <div className="bs-stepper-header mb-3" style={{backgroundColor:'#ebf5fb'}}>
                  <div className="step" data-target="#initial-input">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">1</span>
                      <span className="bs-stepper-label">Initial Input</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#litigants">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">2</span>
                      <span className="bs-stepper-label">Litigants</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#ground">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">3</span>
                      <span className="bs-stepper-label">Ground</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#previous-details">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">4</span>
                      <span className="bs-stepper-label">Previous Case Details</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#advocate-details">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">5</span>
                      <span className="bs-stepper-label">Advocate Details</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#documents">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">6</span>
                      <span className="bs-stepper-label">Documents</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#payments">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">7</span>
                      <span className="bs-stepper-label">Payment</span>
                    </button>
                  </div>
                  <div className="line"></div>
                  <div className="step" data-target="#efile">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">8</span>
                      <span className="bs-stepper-label">E-File</span>
                    </button>
                  </div>
                </div>
                <div className="bs-stepper-content">
                  <form onSubmit={onSubmit}>
                    <div id="initial-input" className="content">
                      <BasicContainer />
                      <button 
                        className="btn btn-primary float-right" 
                        type="button" 
                        onClick={() => stepperRef.current.next()}>
                          <i className="fa fa-arrow-right mr-2"></i>Next
                      </button>
                    </div>
                    <div id="litigants" className="content">
                      <CaseDetails 
                        petition={petition}
                        setPetition={setPetition}
                      />
                      <PetitionerContainer petitioners={petitioners}/>
                      <RespondentContainer respondents={respondents}/>
                      <div className="d-flex justify-content-between mt-5">
                      <button 
                        className="btn btn-primary" 
                        type="button" 
                        onClick={() => stepperRef.current.next()}
                      >
                        <i className="fa fa-arrow-left mr-2"></i>Previous
                      </button>
                      <button 
                        className="btn btn-primary" 
                        type="button" 
                        onClick={() => stepperRef.current.next()}
                      >
                        <i className="fa fa-arrow-right mr-2"></i>Next
                      </button>
                      </div>
                    </div>
                    <div id="ground" className="content text-center">
                      <GroundsContainer grounds={grounds}/>
                      <div className="d-flex justify-content-between mt-5">
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Previous</button>
                      <button className="btn btn-success" type="button" onClick={() => stepperRef.current.next()}>Save</button>
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Next</button>
                      </div>
                    </div>
                    <div id="previous-details" className="content text-center">
                      <PreviousCaseContainer />
                      <div className="d-flex justify-content-between mt-5">
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Previous</button>
                      <button className="btn btn-success" type="button" onClick={() => stepperRef.current.next()}>Save</button>
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Next</button>
                      </div>
                    </div>
                    <div id="advocate-details" className="content text-center">
                      <AdvocateContainer />
                      <div className="d-flex justify-content-between mt-5">
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Previous</button>
                      <button className="btn btn-success" type="button" onClick={() => stepperRef.current.next()}>Save</button>
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Next</button>
                      </div>
                    </div>
                    <div id="documents" className="content text-center">
                      <DocumentContainer />
                      <div className="d-flex justify-content-between mt-5">
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Previous</button>
                      <button className="btn btn-success" type="button" onClick={() => stepperRef.current.next()}>Save</button>
                      <button className="btn btn-primary" type="button" onClick={() => stepperRef.current.next()}>Next</button>
                      </div>
                    </div>
                    <div id="payments" className="content text-center">
                      <Payment />
                    </div>
                    <div id="efile" className="content text-center">
                      <button type="submit" className="btn btn-primary mt-5">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuiStepper;
