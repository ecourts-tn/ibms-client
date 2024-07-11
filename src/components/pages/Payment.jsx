import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import Modal from 'react-bootstrap/Modal'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from '../../api'
import PaymentHistory from './PaymentHistory';
import * as Yup from 'yup'

const Payment = () => {

    const initialState = {
        payer_name: '***********',
        mobile_number:null,
        amount: null,
        cino:''
    }

    const validationSchema = Yup.object({
        payer_name: Yup.string().required("Please selete the payer"),
        mobile_number: Yup.number("Enter valid number").required("Please enter the mobile number"),
        amount: Yup.number("Enter amount").required("Please enter amount")
    })

    const[payment, setPayment] = useState(initialState)
    const[error, setError] = useState({})
    const[paymentHistory, setPaymentHistory] = useState([])
    const[petitioner, setPetitioner] = useState([])
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

    useEffect(() => {
        setPayment({
            ...payment,
            cino: localStorage.getItem("cino")
        })
    },[])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/detail/`, {params:{cino:payment.cino}})
                const { petitioner} = response.data
                setPetitioner(petitioner)
            }catch(err){
                console.log(err)
            }
        }
        if(payment.cino !== ''){
            fetchData();
        }
    }, [payment.cino])

    const handleSubmit = async () => {
        try{
            const response = await api.post(`api/bail/filing/payment/create/`, payment)
            if(response.status === 201){
                toast.success("Payment completed successfully", {
                    theme: "colored"
                })
                setPayment(initialState)
                setMobileOtp(false)
                setMobileVerified(false)
            }
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
            <div className="container my-4" style={{minHeight:'500px'}}>
                {/* <form method="post"> */}
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
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
                                        <label htmlFor="">Payer Name</label>
                                        <select 
                                            name="payer_name" 
                                            className="form-control"
                                            value={payment.payer_name}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select payer</option>
                                            { petitioner.map((p, index) => (
                                            <option value={p.petitioner_name} key={index}>{p.petitioner_name}</option>
                                            ))}
                                        </select>
                                        {/* <input 
                                            type="text"
                                            name="payer_name" 
                                            className={`form-control ${error.payer_name ? 'is-invalid' : null }`}
                                            value={payment.payer_name}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                            readOnly={true}
                                        /> */}
                                        <div className="invalid-feedback">
                                            { error.payer_name }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="form-group mb-3">
                                                <label htmlFor="">Mobile Number</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${error.mobile_number ? 'is-invalid' : null }`}
                                                    name="mobile_number"
                                                    value={payment.mobile_number}
                                                    onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { error.mobile_number }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label htmlFor="">Amount</label>
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
                                                >Send OTP</Button>
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
                                                    >Verify</Button>
                                                </div>
                                            </div>
                                        </>
                                        )}
                                        { mobileVerified && (
                                        <>
                                            <div className="col-md-12 mb-3">
                                                <CheckCircleRoundedIcon color="success"/>
                                                <span className="text-success ml-1"><strong>OTP Verified</strong></span>
                                            </div>
                                            <div className="col-md-12">
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleSubmit}
                                                >Submit</Button>
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
