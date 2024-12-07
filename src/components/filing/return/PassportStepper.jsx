import React from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const Stepper = () => {
    const {t} = useTranslation()
    const location = useLocation()
    const steps = [
        { path: 'initial-input', label: t('basic_details') },
        // { path: 'litigant', label: t('litigants') },
        { path: 'ground', label: t('ground') },
        { path: 'advocate', label: t('advocate_details') },
        { path: 'document', label: t('upload_documents') },
        { path: 'payment', label: t('payment_details') },
        { path: 'efile', label: t('efile') },
      ];

      
    return (
        <div>
             <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                    <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('return_passport')}</li>
                </ol>
            </nav>
            <div id="stepper1" className="bs-stepper">
                <div className="bs-stepper-header mb-3">
                    {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                        className={`step ${location.pathname.includes(step.path) ? "active" : ""}`}
                        data-target={`#${step.path}`}
                        >
                        <NavLink
                            to={`/filing/return-passport/${step.path}`}
                            className="step-trigger"
                        >
                            <span className="bs-stepper-circle">{index + 1}</span>
                            <span className="bs-stepper-label">{t(step.label)}</span>
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