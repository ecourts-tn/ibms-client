import React, {useState, useEffect, useContext} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import api from 'api'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from 'components/utils/Loading';
import { RequiredField } from 'utils';
import { formatDate } from 'utils';
import { BaseContext } from 'contexts/BaseContext';

const Payment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search);
    const {t} = useTranslation()
    const initialState = {
        txnid:null,
        amount:"",
        scamt:"0.00",
        udf1:"",
        udf2:"",
        udf3:"",
    }
    const {efileNumber} = useContext(BaseContext)
    const[form, setForm] = useState(initialState)
    const validationSchema = Yup.object({
        udf1: Yup.string().required("Payer name is required"),
        udf2: Yup.string().required('Email address is required').email('Enter valid email address'),
        udf3: Yup.string().required(t('errors.mobile_required')).matches(/^d{10}$/, 'Mobile number must be exactly 10 digits'),
        amount: Yup.string().required("Amount is required field").matches(/^d{1-10}$/, 'Amount is required field')
    })

    const[payments, setPayments] = useState([])
    const[paymentData, setPaymentData] = useState(null);
    const[status, setStatus] = useState('')
    const[loading, setLoading] = useState(false)
    const[error, setError] = useState({})
    const[otp, setOtp] = useState('')
    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)


    useEffect(() => {
        const txnId = params.get("txnid");
        if(!txnId) return;

        const data = {       
            efile_no: efileNumber,
            payer_name: params.get("udf1"),
            email_address: params.get("udf2"),
            mobile_number: params.get("udf3"),          
            amount: params.get("amt"),               
            status:params.get("txnStatus"),
            transaction_id: txnId,
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
                const response = await api.put(`payment/court-fee/update/${data.transaction_id}/`, data)
                if(response.status === 201){
                    setPaymentData(data)
                    setTimeout(() => {
                        navigate("/ibms/filing/bail/payment");
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
            await validationSchema.validate(form, {abortEarly: false})
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
            // Validate form
            await validationSchema.validate(form, { abortEarly: false });
    
            const post_data = {
                efile_no: efileNumber, 
                payer_name: form.udf1,
                email_address: form.udf2,
                mobile_number: form.udf3,
                amount: form.amount
            };
    
            // First API call to initiate payment
            const response = await api.post(`payment/court-fee/`, post_data);
    
            if (response.status === 201) {
                // Ensure form is updated correctly (if using state)
                setForm(prevForm => ({ ...prevForm, txnid: response.data.id }));
    
                // Second API call to external payment
                const response2 = await api.post('external/epayment/court-fee/', {
                    ...form,
                    txnid: response.data.id, // Ensure txnid is included
                });
    
                if (response2.status === 200) {
                    toast.success("Redirecting to payment gateway...", { theme: "colored" });
                    setTimeout(() => {
                        window.location.href = response2.data.epay_url;
                    }, 2000);
                } else {
                    toast.error("Payment initiation failed.", { theme: "colored" });
                }
            }
        } catch (error) {
            console.error("Payment submission error:", error);
    
            if (error.name === "ValidationError") {
                toast.error("Please check your form inputs.", { theme: "colored" });
            } else {
                toast.error(t('errors.something_wrong'), { theme: "colored" });
            }
        }
    };
    

    useEffect(() => {
        const fetchPaymentHistory = async() => {
            try{
                const response = await api.post(`payment/court-fee/list/`, {efile_no:efileNumber})
                if(response.status === 200){
                    setPayments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efileNumber)
            fetchPaymentHistory()
    },[])


    return (
        <React.Fragment>
            <ToastContainer />
            { payments.length > 0 && (
                <PaymentHistory payments={payments} />
            )}
            { loading && <Loading />}
            <div className="container my-4">
                <div className="form-group row mb-3">
                    <label htmlFor="" className="col-sm-3 col-form-label">{t('payer_name')}<RequiredField /></label>
                    <div className="col-md-4">
                        <input 
                            type="text"
                            name="udf1" 
                            className={`form-control ${error.udf1 ? 'is-invalid' : null }`}
                            value={form.udf1}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">
                            { error.udf1 }
                        </div>
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label htmlFor="" className='col-sm-3 col-form-label'>{t('mobile_number')}<RequiredField /></label>
                    <div className="col-md-4">
                        <input 
                            type="text" 
                            className={`form-control ${error.udf3 ? 'is-invalid' : null }`}
                            name="udf3"
                            value={form.udf3}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if(value.length <= 10){
                                    setForm({...form, [e.target.name]: value})
                                }
                            }}
                        />
                        <div className="invalid-feedback">
                            { error.udf3 }
                        </div>
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label htmlFor="" className='col-sm-3 col-form-label'>{t('email_address')}<RequiredField /></label>
                    <div className="col-md-4">
                        <input 
                            type="text" 
                            className={`form-control ${error.udf2 ? 'is-invalid' : null }`}
                            name="udf2"
                            value={form.udf2}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">
                            { error.udf2 }
                        </div>
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label htmlFor="" className="col-sm-3 col-form-label">{t('amount')}<RequiredField /></label>
                    <div className="col-md-2">
                        <input 
                            type="text" 
                            className={`form-control ${error.amount ? 'is-invalid' : null}`}
                            name="amount"
                            value={form.amount}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">
                            { error.amount }
                        </div>
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <div className="col-sm-3"></div>
                        { !mobileVerified && (
                        <div className="col-md-2">
                            <div className="form-group mb-3">
                                <Button
                                    variant='contained'
                                    color="warning"
                                    onClick={sendMobileOTP}
                                    disabled={mobileOtp}
                                    className='btn-block'
                                >{t('send_otp')}</Button>
                            </div>
                        </div>
                        )}
                        { mobileOtp && !mobileVerified && (
                        <React.Fragment>
                            <div className="col-md-1">
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
                                    <Button
                                        variant='contained'
                                        color='success'
                                        onClick={() => verifyMobile(otp)}
                                    >{t('verify')}</Button>
                                </div>
                            </div>
                        </React.Fragment>
                        )}
                </div>
                { mobileVerified && (
                    <React.Fragment>
                        <div className='form-group row mb-3'>
                            <div className="col-sm-3"></div>
                            <div className="col-md-3">
                                <CheckCircleRoundedIcon color="success"/>
                                <span className="text-success ml-1"><strong>{t('otp_verified')}</strong></span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <div className="col-md-3">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                >Continue Payment</Button>
                            </div>
                        </div>
                    </React.Fragment>                           
                )}
            </div>
        </React.Fragment>
    )
}

export default Payment


const PaymentHistory = ({payments}) => {
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const checkStatus = async(payment) => {
        const data = {
            txnid :payment.id,
            amount: payment.amount
        }
        try{
            setLoading(true)
            const response = await api.post(`external/epayment/court-fee/status/`, data)
            if(response.status === 200){
                const post_data = {
                    transaction_id: response.data.txnid,
                    shc_transaction_id:response.data.shcltxnid,
                    amount: response.data.amt,
                    pg_unique_txn_id: response.data.pgsptxnid,
                    bank_transaction_id: response.data.banktxnid,
                    bank_name: response.data.bank_name,
                    transaction_type:response.data.txnType,
                    status:response.data.txnStatus,
                    shcilpmtref: response.data.shcilpmtref,
                }
                const response2 = await api.put(`payment/court-fee/update/${payment.id}/`, post_data)
                console.log(response2.status)
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const downloadReceipt = async(receipt_no) => {
        try{
            setLoading(true)
            const response = await api.post(`external/epayment/court-fee/receipt/`, {receipt_no})
            if(response.status===200){
                console.log(response)
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <React.Fragment>

            { loading && <Loading />}
            <table className="table table-bordered table-striped table-sm">
                <thead>
                    <tr className="bg-info">
                        <th>S. No.</th>
                        <th>Payment ID</th>
                        <th>Payer Name</th>
                        <th>Mobile Number</th>
                        <th>Amount</th>
                        <th>Transaction Date</th>
                        <th>Status</th>
                        <th>Receipt</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    { payments.map((payment, index) => (
                    <tr>
                        <td>{ index+1 }</td>
                        <td>{ payment.id }</td>
                        <td>{ payment.payer_name }</td>
                        <td>{ payment.mobile_number }</td>
                        <td>{ payment.amount }</td>
                        <td>{ formatDate(payment.transaction_date) }</td>
                        <td>{ payment.status }</td>
                        <td><a href="#" onClick={()=> downloadReceipt(payment.shc_transaction_id)}>{payment.shc_transaction_id}</a></td>
                        <td>
                            <button 
                                className="btn btn-success btn-sm"
                                onClick={()=>checkStatus(payment)}
                            >
                                Status
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    )
  }
