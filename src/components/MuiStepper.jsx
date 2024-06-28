import * as React from 'react';
import '../components/stepper.css'

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function MuiStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
        <div className="container-fluid">
            <div className="row mt-5">
                <div className="col-md-12">
                    <div className="card card-default">
                        <div className="card-body p-0">
                            <div className="bs-stepper">
                                <div className="bs-stepper-header" role="tablist">
                                    <div className="step" data-target="#logins-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="logins-part" id="logins-part-trigger">
                                            <span className="bs-stepper-circle">1</span>
                                            <span className="bs-stepper-label">Initial Input</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#information-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="information-part" id="information-part-trigger">
                                            <span className="bs-stepper-circle">2</span>
                                            <span className="bs-stepper-label">Litigants</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#ground-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="ground-part" id="ground-part-trigger">
                                            <span className="bs-stepper-circle">3</span>
                                            <span className="bs-stepper-label">Grounds</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#previous-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="previous-part" id="previous-part-trigger">
                                            <span className="bs-stepper-circle">4</span>
                                            <span className="bs-stepper-label">Previous Case Details</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#advocate-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="advocate-part" id="advocate-part-trigger">
                                            <span className="bs-stepper-circle">5</span>
                                            <span className="bs-stepper-label">Advocate Details</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#advocate-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="advocate-part" id="advocate-part-trigger">
                                            <span className="bs-stepper-circle">6</span>
                                            <span className="bs-stepper-label">Documents</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#advocate-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="advocate-part" id="advocate-part-trigger">
                                            <span className="bs-stepper-circle">7</span>
                                            <span className="bs-stepper-label">Court Fee</span>
                                        </button>
                                    </div>
                                    <div className="line" />
                                    <div className="step" data-target="#advocate-part">
                                        <button type="button" className="step-trigger" role="tab" aria-controls="advocate-part" id="advocate-part-trigger">
                                            <span className="bs-stepper-circle">8</span>
                                            <span className="bs-stepper-label">E-File</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="bs-stepper-content">
                                    <div id="logins-part" className="content" role="tabpanel" aria-labelledby="logins-part-trigger">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Password</label>
                                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                                    </div>
                                    <button className="btn btn-primary" onclick="stepper.next()">Next</button>
                                    </div>
                                    <div id="information-part" className="content" role="tabpanel" aria-labelledby="information-part-trigger">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputFile">File input</label>
                                        <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                                        </div>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Upload</span>
                                        </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onclick="stepper.previous()">Previous</button>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}