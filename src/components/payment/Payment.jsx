import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import Modal from 'react-bootstrap/Modal'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from 'api'
import PaymentHistory from './PaymentHistory';
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import RedirectForm from './RedirectForm';

const Payment = () => {
    const location = useLocation()
    const {t} = useTranslation()
    const initialState = {
        txnid:"PAY202409260000001",
        amount:"20",
        scamt:"0.00",
        return_url:`${window.location.protocol}//${window.location.hostname}:${window.location.port}${location.pathname}`,
        udf1:"",
        udf2:"deenadayalan17@gmail.com",
        udf3:"",
    }

    const validationSchema = Yup.object({
        udf1: Yup.string().required("Please selete the payer"),
        udf3: Yup.number("Enter valid number").required("Please enter the mobile number"),
        amount: Yup.number("Enter amount").required("Please enter amount")
    })

    const[payment, setPayment] = useState(initialState)

    const[error, setError] = useState({})
    const[paymentHistory, setPaymentHistory] = useState([])
    const[show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const[otp, setOtp] = useState('')

    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)

    const sendMobileOTP = async() => {
        try{
            await validationSchema.validate(payment, {abortEarly: false})
            if(mobileOtp){
                toast.success("OTP already verified successfully.", {
                    theme: "colored"
                })
                return
            }
            toast.success("OTP has been sent your mobile number",{
                theme:"colored"
            })
            setMobileOtp(true)
        }catch(error){
            const newError = {}
            error.inner.forEach((err)=> {
                newError[err.path] = err.message
            })
            setError(newError)
        }
    }

    const verifyMobile = (otp) => {
        if(parseInt(otp) === 123456){
            toast.success("Mobile otp verified successfully",{
                theme:"colored"
            })
            setMobileVerified(true)
        }else{
            toast.error("Invalid OTP. Please enter valid OTP",{
                theme:"colored"
            })
            setMobileVerified(false)
            setMobileOtp(true)
        }
    }


    const handleSubmit = async () => {
        try {
            await validationSchema.validate(payment, { abortEarly: false });
            const response = await api.post('external/epayment/court-fee/', payment);
    
            if (response.status === 200) {
                toast.success("Redirecting to payment gateway...", { theme: "colored" });
                setTimeout(() => {
                    window.location.href = response.data.epay_url;
                }, 2000);
            }
        } catch (error) {
            console.error("Payment submission error:", error);
            toast.error("Payment failed. Please try again.", { theme: "colored" });
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal 
                show={show} 
                onHide={handleClose} 
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title><strong>Payment History</strong></Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <PaymentHistory payments={paymentHistory} />
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: "end"}}>
                         <div>
                            <Button variant="contained" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </Modal.Footer>
            </Modal>
            <div className="container my-4">
                {/* <form method="post"> */}
                    <div className="row">
                        <div className="col-md-10 offset-md-1">
                            <div className="row">
                                <div className="col-md-12">
                                    { paymentHistory.length > 0 && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleShow}
                                        >View Transactions</Button>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <div className="form-group mb-3">
                                        <label htmlFor="">{t('payer_name')}</label>
                                        <input 
                                            type="text"
                                            name="udf1" 
                                            className={`form-control ${error.udf1 ? 'is-invalid' : null }`}
                                            value={payment.udf1}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                            // readOnly={true}
                                        />
                                        <div className="invalid-feedback">
                                            { error.petitioner_name }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="form-group mb-3">
                                                <label htmlFor="">{t('mobile_number')}</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${error.udf3 ? 'is-invalid' : null }`}
                                                    name="udf3"
                                                    value={payment.udf3}
                                                    onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { error.udf3 }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label htmlFor="">{t('amount')}</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${error.amount ? 'is-invalid' : null}`}
                                                    name="amount"
                                                    value={payment.amount}
                                                    onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { error.amount }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <div className="row mt-3">
                                        { !mobileVerified && (
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <Button
                                                    variant='contained'
                                                    color="warning"
                                                    onClick={sendMobileOTP}
                                                    disabled={mobileOtp}
                                                >{t('send_otp')}</Button>
                                            </div>
                                        </div>
                                        )}
                                        { mobileOtp && !mobileVerified && (
                                        <>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        onChange={(e) => setOtp(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <Button
                                                        variant='contained'
                                                        color='success'
                                                        onClick={() => verifyMobile(otp)}
                                                    >{t('verify')}</Button>
                                                </div>
                                            </div>
                                        </>
                                        )}
                                        { mobileVerified && (
                                        <>
                                            <div className="col-md-12 mb-3">
                                                <CheckCircleRoundedIcon color="success"/>
                                                <span className="text-success ml-1"><strong>{t('otp_verified')}</strong></span>
                                            </div>
                                            <div className="col-md-12">
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleSubmit}
                                                >Continue Payment</Button>
                                            </div>
                                        </>
                                        
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </form> */}
            </div>
        </>
    )
}

export default Payment
