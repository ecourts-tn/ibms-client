import React from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"

function VerifyOrder() {

    const {t} = useTranslation()

    const[orderNumber, setOrderNumber] = React.useState('')
    const[error, setError] = React.useState({})

    const validationSchema = Yup.object({
        orderNumber: Yup.string().required('Please enter the order number')
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(orderNumber, {abortEarly:false})

        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setError(newErrors)
            }
        }
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-2">
                    <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('verify_order')}</li>
                </ol>
            </nav>
            <div className="container-fluid" style={{minHeight:"500px"}}>
                <section className="content my-5">
                    <div className="error-page">
                        <form className="search-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    name="orderNumber" 
                                    className={`form-control ${error.orderNumber ? 'is-invalid': null}`} 
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
                            { error.orderNumber && (
                            <div className="text-danger">
                                {error.orderNumber}
                            </div>
                            )}
                        </form>
                    </div>
                </section>
            </div>
        </>
    )
}

export default VerifyOrder