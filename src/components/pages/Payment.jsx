import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import Modal from 'react-bootstrap/Modal'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from '../../api'
import PaymentHistory from './PaymentHistory';

const Payment = () => {

    const[cases, setCases] = useState([])

    const initialState = {
        petition: '',
        petitioner_name: '',
        mobile_number:'',
        amount: ''
    }

    const[payment, setPayment] = useState(initialState)
    const[paymentHistory, setPaymentHistory] = useState([])
    const[petitioner, setPetitioner] = useState([])
    const[show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const[otp, setOtp] = useState('')

    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)

    const sendMobileOTP = () => {
        // if(otp === ''){
        //     toast.error("Please enter valid mobile number",{
        //         theme:"colored"
        //     })
        // }else{
            // setMobileLoading(true)
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
        // }
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
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/draft/list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/filing/${payment.petition}/petitioner/list/`)
                setPetitioner(response.data)
            }catch(error){
                console.log(error)
            }
        }
        fetchData()
    },[payment.petition])

    useEffect(() => {
        if(payment.petition !== ''){
            async function fetchData(){
                try{
                    const response = await api.get(`api/bail/filing/${payment.petition}/payment/list/`)
                    setPaymentHistory(response.data)
                }catch(error){
                    console.log(error)
                }
            }
            fetchData()
        }
    },[payment.petition])

    useEffect(() => {
        async function fetchData(id){
            try{
                const response = await api.get(`api/bail/petitioner/${id}/details/`)
                setPetitioner(response.data)
            }catch(error){
                console.log(error)
            }
        }
        fetchData()
    },[payment.petitioner_name])

    const handleSubmit = async () => {
        try{
            const response = await api.post(`api/bail/filing/${payment.petition}/payment/create/`, payment)
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
                                {/* <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label htmlFor="">Select Petition</label>
                                        <select 
                                            name="petition" 
                                            className="form-control"
                                            value={payment.petition}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select</option>
                                            { cases.map((item, index) => (
                                                <option key={index} value={item.petition.cino}>
                                                    {item.petition.cino} - { item.petitioner.map((p, index) => (
                                                        <span>{index+1}.&nbsp;{p.petitioner_name}&nbsp;</span>
                                                    ))}
                                                    <span>&nbsp;Vs&nbsp;</span>
                                                    { item.respondent.map((res, index) => (
                                                        <span>{res.respondent_name} rep by {res.designation}</span>
                                                    ))} 
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div> */}
                                <div className="col-md-12">
                                    { paymentHistory.length > 0 && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleShow}
                                        >View Transactions</Button>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="">Payer Name</label>
                                        <select 
                                            name="petitioner_name" 
                                            className="form-control"
                                            value={payment.petitioner_name}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select Petitioner</option>
                                            { petitioner.map((item, index) => (
                                            <option key={index} value={item.petitioner_name}>{ item.petitioner_name }</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label htmlFor="">Mobile Number</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="mobile_number"
                                            value={payment.mobile_number}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group mb-3">
                                        <label htmlFor="">Amount</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="amount"
                                            value={payment.amount}
                                            onChange={(e) => setPayment({...payment, [e.target.name]: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                { !mobileVerified && (
                                <div className="col-md-2">
                                    <div className="form-group mb-3">
                                        <button 
                                            className="btn btn-primary btn-block"
                                            onClick={sendMobileOTP}
                                        >Get OTP</button>
                                    </div>
                                </div>
                                )}
                                { mobileOtp && !mobileVerified && (
                                <>
                                    <div className="col-md-2">
                                        <div className="form-group mb-3">
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group mb-3">
                                            <button 
                                                className="btn btn-success btn-block"
                                                onClick={() => verifyMobile(otp)}
                                            >Verify</button>
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
                {/* </form> */}
            </div>
        </>
    )
}

export default Payment
