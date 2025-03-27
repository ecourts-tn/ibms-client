import React from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const Stepper = () => {
    const {t} = useTranslation()
    const location = useLocation()
    const steps = [
        { path: '/filing/bail/initial-input', label: t('basic_details') },
        { path: '/filing/bail/litigant', label: t('litigant') },
        { path: '/filing/bail/ground', label: t('ground') },
        { path: '/filing/bail/previous-history', label: t('previous_case_details') },
        { path: '/filing/bail/advocate', label: t('advocate_details') },
        { path: '/filing/bail/document', label: t('upload_documents') },
        { path: '/filing/bail/payment', label: t('payment_details') },
        { path: '/filing/bail/efile', label: t('efile') },
      ];

      
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                    <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('bail')}</li>
                </ol>
            </nav>
            <div id="stepper1" className="bs-stepper">
                <div className="bs-stepper-header">
                    {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                        className={`step ${location.pathname.includes(step.path) ? "active" : ""}`}
                        data-target={`#${step.path}`}
                        >
                        <NavLink
                            to={`${step.path}`}
                            className="step-trigger"
                        >
                            <span className="bs-stepper-circle">{index + 1}</span>
                            <span className="bs-stepper-label">{step.label}</span>
                        </NavLink>
                        </div>
                        {index < steps.length - 1 && <div className="line"></div>}
                    </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Stepper