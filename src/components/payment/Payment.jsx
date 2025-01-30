import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from 'api'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Loading from 'components/common/Loading';

const Payment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search);
    const {t} = useTranslation()
    const id = uuidv4()
    const initialState = {
        txnid:id,
        amount:"",
        scamt:"0.00",
        udf1:"",
        udf3:"",
    }
    const validationSchema = Yup.object({
        udf1: Yup.string().required("Please enter payer"),
        udf3: Yup.number("Enter valid number").required("Please enter the mobile number"),
        amount: Yup.number("Enter amount").required("Please enter amount")
    })

    const[payment, setPayment] = useState(initialState)
    const[payments, setPayments] = useState([])
    const[paymentData, setPaymentData] = useState(null);
    const[status, setStatus] = useState('')
    const[loading, setLoading] = useState(false)
    const[error, setError] = useState({})
    const[otp, setOtp] = useState('')
    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)
    const efile_no = sessionStorage.getItem("efile_no" || null)


    useEffect(() => {
        const data = {
            efile_no :efile_no,            
            payer_name: sessionStorage.getItem("payer"),        
            mobile_number:sessionStorage.getItem("mobile"),          
            amount: params.get("amt"),               
            status:params.get("txnStatus"),
            transaction_id: params.get("txnid"),
            transaction_date:params.get("txnDate"),
            transaction_type:params.get("txnType"),
            shc_transaction_id:params.get("shcltxnid"),
            shc_unique_payment_ref: params.get("shcltxnid"),
            pg_unique_txn_id: params.get("pgsptxnid"),
            bank_transaction_id: params.get("banktxnid"),
            status: params.get("txnStatus"),
            product_id: params.get("prodid"),
            amount: params.get("amt"),
            bank_name: params.get("bank_name"),
            shcilpmtref: params.get("shcilpmtref"),
        }

        const savePayment =  async() => {
            try{
                setLoading(true)
                const response = await api.post(`payment/court-fee/`, data)
                if(response.status === 201){
                    setPaymentData(data)
                    setTimeout(() => {
                        navigate("/ibms/filing/bail/payment", { replace: true });
                    }, 2000);
                    toast.success("Payment completed successfully", {theme:"colored"})
                }
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        savePayment();

    }, [location.search]);

    useEffect(() => {
        setStatus(params.get("txnStatus"))
    }, [location.search]);

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
            sessionStorage.setItem("payer", payment.udf1)
            sessionStorage.setItem("mobile", payment.udf3)
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

    useEffect(() => {
        const fetchPaymentHistory = async() => {
            try{
                const response = await api.post(`payment/court-fee/list/`, {efile_no})
                if(response.status === 200){
                    setPayments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efile_no)
            fetchPaymentHistory()
    },[])

    return (
        <>
            <ToastContainer />
            { payments.length > 0 && (
                <PaymentHistory payments={payments} />
            )}
            { loading && <Loading />}
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                        {status && (
                            status === "OK" ? (
                                <div className='alert alert-success'>
                                    <p>Payment Successful!</p>
                                    <p>Transaction ID: {paymentData.transaction_id}<br/>
                                    Amount: {paymentData.amount}</p>
                                </div>
                            ) : (
                                status === "failed" && (
                                    <div className='alert alert-danger'>Payment Failed. Please try again.</div>
                                )
                            )
                        )}
                    </div>
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
        </>
    )
}

export default Payment


const PaymentHistory = ({payments}) => {
    return (
          <>
              <table className="table table-bordered table-striped table-sm">
                  <thead>
                      <tr className="bg-info">
                          <th>S. No.</th>
                          <th>Payer Name</th>
                          <th>Mobile Number</th>
                          <th>Amount</th>
                          <th>Transaction Date</th>
                          <th>Status</th>
                          <th>Receipt</th>
                      </tr>
                  </thead>
                  <tbody>
                      { payments.map((payment, index) => (
                      <tr>
                          <td>{ index+1 }</td>
                          <td>{ payment.payer_name }</td>
                          <td>{ payment.mobile_number }</td>
                          <td>{ payment.amount }</td>
                          <td>{ payment.transaction_date }</td>
                          <td>{ payment.status }</td>
                          <td><a href="#">{payment.shc_unique_payment_ref}</a></td>
                      </tr>
                      ))}
                  </tbody>
              </table>
          </>
      )
  }
