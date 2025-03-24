import React, {useState} from "react"
import { useTranslation } from "react-i18next"
import Loading from "components/common/Loading"
import * as Yup from "yup"
import { toast, ToastContainer } from "react-toastify"
import api from "api"

function VerifyOrder() {

    const {t} = useTranslation()

    const[orderNumber, setOrderNumber] = useState(null)
    const[error, setError] = useState('')
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        orderNumber: Yup.string().required('Please enter the order number')
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            if(!orderNumber){
                setError("Order number required")
                return
            }
            setLoading(true)
            const response = await api.post(`case/verify-order/`, {order_number:orderNumber})
            if(response.status === 200){

            }
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message, {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            <ToastContainer/>
            {loading && <Loading />}
            <div className="container" style={{minHeight:"500px"}}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-2">
                        <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('verify_order')}</li>
                    </ol>
                </nav>
                <section className="content my-5">
                    <div className="error-page">
                        <form className="search-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    name="orderNumber" 
                                    className={`form-control ${error ? 'is-invalid': null}`} 
                                    placeholder="Order Number"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button 
                                        type="submit" 
                                        name="submit" 
                                        className="btn btn-success">
                                            <i className="fas fa-check mr-2" />Verify
                                        </button>
                                </div>
                            </div>
                            <div className="text-danger">
                                {error}
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    )
}

export default VerifyOrder