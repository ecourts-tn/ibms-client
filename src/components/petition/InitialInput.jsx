import React from 'react'
import Form from 'react-bootstrap/Form'

const InitialInput = ({petition}) => {
    return (
        <div className="row mb-4">
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>Court Type</Form.Label>
                        <Form.Control
                        value={petition.court_type.court_type}
                        readOnly={true}
                        ></Form.Control>                                                        
                </Form.Group>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <Form.Label>Bench Type</Form.Label>
                    <Form.Control
                        value={petition.bench_type ? petition.bench_type.bench_type : null}
                        readOnly={true}
                    ></Form.Control>
                </div>
            </div>
            { petition.court_type.id === 2 && (
            <>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <Form.Control
                            value={petition.state.state_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="district">District</label>
                        <Form.Control
                            value={petition.district.district_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="establishment">Establishment Name</label>
                        <Form.Control
                            value={petition.establishment.establishment_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="court">Court Name</label>
                        <Form.Control
                            value={petition.court.court_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
            </>
            )}
            {/* <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="caseType">Case Type</label>
                    <Form.Control
                        value={petition.case_type.type_name}
                        readOnly={true}
                    ></Form.Control>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="bailType">Bail Type</label>
                    <Form.Control
                        value={petition.bail_type.type_name}
                        readOnly={true}
                    ></Form.Control>
                </div>
            </div>
            <div className="col-md-3">
                <Form.Group>
                    <Form.Label>Compliant Type</Form.Label>
                    <Form.Control
                        value={petition.complaint_type.type_name}
                        readOnly={true}
                    ></Form.Control>
                </Form.Group>
            </div>
            <div className="col-md-3">
                <div className="form-group clearfix">
                <label htmlFor="" className="mr-2">Crime Registered?</label><br></br>
                <div className="icheck-success d-inline mx-2">
                    <input type="radio" id="radioPrimary1" name="crime_registered" checked={petition.crime_registered === "1" ? true : false} />
                    <label htmlFor="radioPrimary1">Yes</label>
                </div>
                <div className="icheck-danger d-inline mx-2">
                    <input type="radio" id="radioPrimary2" name="crime_registered" checked={petition.crime_registered === "2" ? true : false} />
                    <label htmlFor="radioPrimary2">No</label>
                </div>
                <div className="icheck-primary d-inline mx-2">
                    <input type="radio" id="radioPrimary3" name="crime_registered" checked={petition.crime_registered === "3" ? true : false} />
                    <label htmlFor="radioPrimary3">Not Known</label>
                </div>
                </div>
            </div> */}
        </div>
    )
}

export default InitialInput