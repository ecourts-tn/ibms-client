import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const steps = ['Personal Information', 'Address Details', 'Confirmation'];

const validationSchemas = [
  Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
  Yup.object({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
  }),
  Yup.object({}),
];

const Step1 = () => (
  <>
    <Box>
      <Field name="firstName" placeholder="First Name" />
    </Box>
    <Box>
      <Field name="lastName" placeholder="Last Name" />
    </Box>
    <Box>
      <Field name="email" placeholder="Email" />
    </Box>
  </>
);

const Step2 = () => (
  <>
    <Box>
      <Field name="address" placeholder="Address" />
    </Box>
    <Box>
      <Field name="city" placeholder="City" />
    </Box>
    <Box>
      <Field name="state" placeholder="State" />
    </Box>
  </>
);

const Step3 = ({ values }) => (
  <>
    <h3>Confirm your details:</h3>
    <p>
      <strong>First Name:</strong> {values.firstName}
    </p>
    <p>
      <strong>Last Name:</strong> {values.lastName}
    </p>
    <p>
      <strong>Email:</strong> {values.email}
    </p>
    <p>
      <strong>Address:</strong> {values.address}
    </p>
    <p>
      <strong>City:</strong> {values.city}
    </p>
    <p>
      <strong>State:</strong> {values.state}
    </p>
  </>
);

const FormikStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const isLastStep = activeStep === steps.length - 1;

  const handleNext = (values) => {
    if (!isLastStep) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // Form Submission Logic
      console.log('Form Submitted:', values);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
      }}
      validationSchema={validationSchemas[activeStep]}
      onSubmit={(values) => {
        handleNext(values);
      }}
    >
      {({ values, errors, touched, isValid, dirty }) => (
        <Form>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && <Step1 />}
          {activeStep === 1 && <Step2 />}
          {activeStep === 2 && <Step3 values={values} />}

          <Box sx={{ mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="contained"
              color="secondary"
            >
              Back
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || !dirty}
              sx={{ ml: 2 }}
            >
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </Box>

          {/* Display validation errors */}
          <Box>
            {Object.keys(errors).map((key) => (
              <div key={key} style={{ color: 'red' }}>
                {errors[key]}
              </div>
            ))}
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FormikStepper;
