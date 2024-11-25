import React, {useState, useEffect} from 'react'
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import Modal from 'react-bootstrap/Modal'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from '../../api'
import PaymentHistory from './PaymentHistory';
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';

const Payment = () => {
    const [hmac, setHmac] = useState('');
    const {t} = useTranslation()
    const generateHmac = () => {
        const login = "tnhgcourt";
        const pass = "ourttnh";
        const ttype = "NBFundTransfer";
        const prodid = "EPS-TN-102";
        const txnid = "PAY202409260000001";
        const amt = "30.00";
        const scamt = "0.00";
        const txnDate ="2024-09-26"
        const reqHashKey = "653861302req996313560";
    // Concatenating the required strings
    const sampleStr = login + pass + ttype + prodid + txnid + amt + scamt + txnDate;

    // Generating the HMAC using SHA-512
    const hmacGenerated = CryptoJS.HmacSHA512(sampleStr, reqHashKey).toString(CryptoJS.enc.Hex);
    return hmacGenerated
    // Setting the generated HMAC
    // setHmac(hmacGenerated);
    };

    //   https://dr.shcileservices.com/OnlineE-Payment/sEpsePmtTrans?
    //   login=phhgcourt&pass=Test@123&txnType=NA&
    //   prodid=PHCFEE&
    //   txnid=TS201822061010540&amt=505&scamt=0&txndate=22-JUN-2018%2014:25:56&
    //   ru=https://phhc.gov.in/payment_status/&signature=c9edd10e4675ccd2e4c377aa012b17301913ddf57ae6a5159f27ecfbc49dc27d09809d0a5f5f4ec7fa5b934f7417ef0295bb091905efdf5d9c6b8f64b22a27de&
    //   udf1=mohit&udf2=mohitattarde@gma.com&udf3=98215201250&udf4=DC&udf5=netbanking_payment&udf6=epayment_application&udf7=user_id

    const initialState = {
        login: "tnhgcourt",
        pass: "ourttnh",
        txnType: "NA",
        prodid:"EPS-TN-102",
        txnid:"PAY202409260000001",
        amt:"20",
        scamt:"0.00",
        txndate:"2024-09-26",
        ru:"https://ecourts-tn.github.io/ibms-client/",
        signature:generateHmac(), 
        udf1:"",
        udf2:"deenadayalan17@gmail.com",
        udf3:"",
    }

    const validationSchema = Yup.object({
        udf1: Yup.string().required("Please selete the payer"),
        udf3: Yup.number("Enter valid number").required("Please enter the mobile number"),
        amt: Yup.number("Enter amount").required("Please enter amount")
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

    // useEffect(() => {
    //     async function fetchData(){
    //         try{
    //             const efile_no = localStorage.getItem("efile_no")
    //             const response = await api.get(`api/case/filing/detail/`, {params:{efile_no}})
    //             const { petitioner} = response.data
    //             setPetitioner(petitioner)
    //         }catch(err){
    //             console.log(err)
    //         }
    //     }
    //     if(payment.cino !== ''){
    //         fetchData();
    //     }
    // }, [payment.cino])

    const handleSubmit = async () => {
        try{
            const data = {
                efile_no:sessionStorage.getItem("efile_no"),
                payer_name:payment.udf1,
                mobile_number: payment.udf3,
                amount:payment.amt
            }
            const response = await api.post(`payment/court-fee/`, data)
            if(response.status === 201){
                toast.success("Payment completed successfully", {
                    theme: "colored"
                })
                setPayment(initialState)
                setMobileOtp(false)
                setMobileVerified(false)
            }
            // const response = await api.post("https://dr.shcileservices.com/OnlineE-Payment/sEpsePmtTrans?", payment)
            // const response = await api.post("https://dr.shcileservices.com/OnlineE-Payment/sEpsePmtTrans?login=tnhgcourt&pass=ourttnh&txnType=NA&prodid=EPS-TN-102&txnid=TS201822061010540&amt=505&scamt=0&txndate=26-Sep-2018%2014:25:56&ru=https://phhc.gov.in/payment_status/&signature=c8d835547dab1d015560c40fa2be193737cfece204428e8f08e312f298af260121d5b943c6695ed1cd2ba8936612d095f7c518ce8cf5355956a24ec3ef4a44b7&udf1=deena&udf2=deenadayalan17@gmail.com&udf3=8344381139&udf4=DC&udf5=netbanking_payment&udf6=epayment_application&udf7=1")
            // if(response.status === 200){
            //     console.log("success")
            // }
            // https://dr.shcileservices.com/OnlineE-Payment/sEpsePmtTrans?login=phhgcourt&pass=Test@123&txnType=NA&prodid=PHCFEE&txnid=TS201822061010540&amt=505&scamt=0&txndate=22-JUN-2018%2014:25:56&ru=https://phhc.gov.in/payment_status/&signature=c9edd10e4675ccd2e4c377aa012b17301913ddf57ae6a5159f27ecfbc49dc27d09809d0a5f5f4ec7fa5b934f7417ef0295bb091905efdf5d9c6b8f64b22a27de&udf1=mohit&udf2=mohitattarde@gma.com&udf3=98215201250&udf4=DC&udf5=netbanking_payment&udf6=epayment_application&udf7=user_id
        }catch(error){
            console.log(error)
        }
    }

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
                                                    className={`form-control ${error.amt ? 'is-invalid' : null}`}
                                                    name="amt"
                                                    value={payment.amt}
                                                    onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { error.amt }
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
                                                >{t('submit')}</Button>
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
