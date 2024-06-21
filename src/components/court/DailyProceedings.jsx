import React, { useState } from 'react'
import '../../layout/admin/Header.css'

const DailyProceedings = () => {

    const[proceeding, setProceeding] = useState('')
    const[isAppear, setIsAppear] = useState('')
    const[appearLocation, setAppearLocation] = useState('')


    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Daily Proceedings</strong></h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 offset-4">
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-3">Case Number</label>
                                        <div className="col-sm-6">
                                            <select name="case" id="" className="form-control">
                                                <option>Select case</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8 h-100">
                                    <div className="card h-100">
                                        <div className="card-header bg-info">
                                            <strong>Case History</strong>
                                        </div>
                                        <div className="card-body" style={{ height:'600px', overflowY:"scroll"}}>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div class="list-group">
                                                        <a href="#" class="list-group-item list-group-item-action">Basic Details</a>
                                                        <a href="#" class="list-group-item list-group-item-action">Petitioners</a>
                                                        <a href="#" class="list-group-item list-group-item-action">Respondents</a>
                                                        <a href="#" class="list-group-item list-group-item-action">Grounds</a>
                                                        <a href="#" class="list-group-item list-group-item-action">Previous History</a>
                                                        <a href="#" class="list-group-item list-group-item-action">Advocates</a>
                                                        <a href="#" class="list-group-item list-group-item-action">Police Response</a>
                                                        <a href="#" class="list-group-item list-group-item-action">PP / APP Remarks</a>
                                                    </div>
                                                </div>
                                                <div className="col-md-9">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header bg-info">
                                            <strong>Case Proceedings</strong>
                                        </div>
                                        <div className="card-body" style={{ height:'600px', overflowY:"scroll"}}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="proceeding">Proceeding</label>
                                                        <select 
                                                            name="proceeding" 
                                                            value={proceeding} 
                                                            className="form-control" 
                                                            onChange={(e) => setProceeding(e.target.value)}
                                                        >
                                                            <option value="">Select Proceeding</option>
                                                            <option value="1">Allowed</option>
                                                            <option value="2">Dismissed</option>
                                                            <option value="3">Interim Order</option>
                                                            <option value="4">Adjournment</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group row">
                                                        <label className="col-sm-5">Condition to Appear</label>
                                                        <div className="col-sm-5">
                                                            <input type="radio" name="is_appear" onChange={(e) => setIsAppear(1)} checked={isAppear==1 ? true : false}/> Yes 
                                                            <input type="radio" name="is_appear" className="ml-2" onChange={(e) => setIsAppear(2)} checked={isAppear==2 ? true : false}/> No
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group row">
                                                        <label className="col-sm-4">Condition Place</label>
                                                        <div className="col-sm-8">
                                                            <input type="radio" name="appear" onChange={(e) => setAppearLocation(1)} checked={appearLocation==1 ? true : false}/> Court
                                                            <input type="radio" className="ml-2" name="appear" onChange={(e) => setAppearLocation(2)} checked={appearLocation==2 ? true : false}/> Police Station
                                                        </div>
                                                    </div>
                                                </div>
                                                { isAppear == 1 && (
                                                <>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label htmlFor="">District</label>
                                                            <select name="district" id="" className="form-control">
                                                                <option value="">Select District</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                { appearLocation == 1 && (
                                                <>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label htmlFor="">Establishment</label>
                                                            <select name="establishment" id="" className="form-control">
                                                                <option value="">Select establishment</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label htmlFor="">Court</label>
                                                            <select name="court" id="" className="form-control">
                                                                <option value="">Select court</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                                )}
                                                { appearLocation == 2 && (
                                                <>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label htmlFor="">Police Station</label>
                                                            <select name="police_station" id="" className="form-control">
                                                                <option value="">Select station</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>    
                                                )}
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="">Condition Time</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="">Condition Duration</label>
                                                            <select name="police_station" id="" className="form-control">
                                                                <option value="">Select station</option>
                                                                <option value="1">Until Further Order</option>
                                                                <option value="2">Whenever Need</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                                )}
                                                <div className="col-md-12">
                                                    <div className="form-group row">
                                                        <label className="col-sm-2">Bond</label>
                                                        <div className="col-sm-4">
                                                            <input type="radio" /> Yes 
                                                            <input type="radio" className="ml-2"/> No
                                                        </div>
                                                        <label className="col-sm-2">Surety</label>
                                                        <div className="col-sm-4">
                                                            <input type="radio" /> Yes 
                                                            <input type="radio" className="ml-2"/> No
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="">Other Condition (if any)</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                { (proceeding == 3 || proceeding == 4) && (
                                                <>
                                                    <div className="col-md-12">
                                                        <div className="form-group row">
                                                            <label htmlFor="" className="col-sm-3 mt-2">Next Date</label>
                                                            <div className="col-sm-6">
                                                                <input type="date" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>    
                                                )}
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="">Remarks</label>
                                                        <textarea name="remarks" cols="30" rows="5" className="form-control"></textarea>                
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group text-center">
                                                        <button className="btn btn-success px-3">Submit</button>
                                                        <button className="btn btn-secondary px-3 ml-1">Reset</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DailyProceedings