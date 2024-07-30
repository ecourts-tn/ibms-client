import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FormContext } from '../../../hooks/FormProvider';

const initialInputValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  check: Yup.boolean().oneOf([true], 'Must be checked'),
});

const litigantsValidationSchema = Yup.object().shape({
  resname: Yup.string().required('Required'),
  resaddress: Yup.string().required('Required'),
});

const groundValidationSchema = Yup.object().shape({
  litigant_name: Yup.string().required('Required'),
  litigant_address: Yup.string().required('Required'),
});

const Step1 = ({ nextStep }) => {
  const { formData, updateFormData } = useContext(FormContext);

  return (
    <Formik
      initialValues={formData}
      validationSchema={initialInputValidationSchema}
      onSubmit={(values) => {
        updateFormData(values);
        nextStep();
      }}
    >
      {() => (
            <div id="initial-input" className='content'>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage name="email" component="small" className="form-text text-danger" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field name="password" type="password" className="form-control" />
                    <ErrorMessage name="password" component="small" className="form-text text-danger" />
                </div>
                <div className="form-check">
                    <Field name="check" type="checkbox" className="form-check-input" />
                    <label className="form-check-label" htmlFor="check">Check me out</label>
                    <ErrorMessage name="check" component="small" className="form-text text-danger" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button className="btn btn-primary float-right" type="button" onClick={nextStep}>
                    <i className="fa fa-arrow-right mr-2"></i>Next
                </button>
            </div>
      )}
    </Formik>
  );
};

const Step2 = ({ nextStep, prevStep }) => {
  const { formData, updateFormData } = useContext(FormContext);

  return (
    <Formik
      initialValues={formData}
      validationSchema={litigantsValidationSchema}
      onSubmit={(values) => {
        updateFormData(values);
        nextStep();
      }}
    >
      {() => (
            <div id="litigants" className="content">
                <div className="form-group">
                    <label htmlFor="resname">Resname</label>
                    <Field name="resname" type="text" className="form-control" />
                    <ErrorMessage name="resname" component="small" className="form-text text-danger" />
                </div>
                <div className="form-group">
                    <label htmlFor="resaddress">Resaddress</label>
                    <Field name="resaddress" type="text" className="form-control" />
                    <ErrorMessage name="resaddress" component="small" className="form-text text-danger" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button className="btn btn-primary float-right" type="button" onClick={nextStep}>
                    <i className="fa fa-arrow-right mr-2"></i>Next
                </button>
                <button className="btn btn-secondary float-left" type="button" onClick={prevStep}>
                    Previous
                </button>
            </div>
      )}
    </Formik>
  );
};

const Step3 = ({ prevStep }) => {
  const { formData, updateFormData } = useContext(FormContext);

  return (
    <Formik
      initialValues={formData}
      validationSchema={groundValidationSchema}
      onSubmit={(values) => {
        updateFormData(values);
      }}
    >
      {() => (
            <div id="ground" className="content">
                <div className="form-group">
                    <label htmlFor="litigant_name">Litigant Name</label>
                    <Field name="litigant_name" type="text" className="form-control" />
                    <ErrorMessage name="litigant_name" component="small" className="form-text text-danger" />
                </div>
                <div className="form-group">
                    <label htmlFor="litigant_address">Litigant Address</label>
                    <Field name="litigant_address" type="text" className="form-control" />
                    <ErrorMessage name="litigant_address" component="small" className="form-text text-danger" />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
                <button className="btn btn-secondary float-left" type="button" onClick={prevStep}>
                    Previous
                </button>
            </div>
      )}
    </Formik>
  );
};

export { Step1, Step2, Step3 };
