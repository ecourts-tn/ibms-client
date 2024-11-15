import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';


const MuiStepper = () => {
  const stepperRef = useRef(null);

  useEffect(() => {
    stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true,
    });
  }, []);

  return (
    <div className="container-fluid px-md-5">
      <div className="row">
        <div className="col-md-12">
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
                </div>
                <div className="bs-stepper-content">
                    <div id="initial-input" className="content">
                        <form id="intial-input-form">
                            <div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                            </div>
                            </div>
                            <button 
                                className="btn btn-primary float-right" 
                                type="button" 
                                onClick={() => stepperRef.current.next()}>
                                <i className="fa fa-arrow-right mr-2"></i>Next
                            </button>
                        </form>    
                    </div>
                    <div id="litigants" className="content">
                        <form id="litigant-from">
                            <div>
                            <div className="form-group">
                                <label htmlFor="exampleInput">resname address</label>
                                <input type="resname" className="form-control" id="exampleInput" aria-describedby="resnameHelp" placeholder="Enter resname" />
                                <small id="resnameHelp" className="form-text text-muted">We'll never share your resname with anyone else.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputresaddress1">resaddress</label>
                                <input type="resaddress" className="form-control" id="exampleInputresaddress1" placeholder="resaddress" />
                            </div>
                            </div>
                            <button className="btn btn-primary float-left" type="button" onClick={() => stepperRef.current.previous()}>Previous</button>
                            <button 
                                className="btn btn-primary float-right" 
                                type="button" 
                                onClick={() => stepperRef.current.next()}>
                                <i className="fa fa-arrow-right mr-2"></i>Next
                            </button>
                        </form>    
                    </div>
                    <div id="ground" className="content text-center">
                        <form>
                            <div>
                            <div className="form-group">
                                <label htmlFor="exampleInput">litigant_name address</label>
                                <input type="litigant_name" className="form-control" id="exampleInputlitigant_name1" aria-describedby="litigant_nameHelp" placeholder="Enter litigant_name" />
                                <small id="litigant_nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputlitigant_address1">litigant_address</label>
                                <input type="litigant_address" className="form-control" id="exampleInputlitigant_address1" placeholder="litigant_address" />
                            </div>
                            </div>
                            <button className="btn btn-primary float-left" type="button" onClick={() => stepperRef.current.previous()}>Previous</button>
                            <button 
                                className="btn btn-primary float-right" 
                                type="button" 
                                onClick={() => stepperRef.current.next()}>
                                <i className="fa fa-arrow-right mr-2"></i>Next
                            </button>
                        </form>    
                    </div>
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
