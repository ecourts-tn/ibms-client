import React from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const Stepper = () => {
    const {t} = useTranslation()
    const location = useLocation()
    const steps = [
        { path: '/filing/anticipatory-bail/initial-input', label: 'Initial Input' },
        { path: '/filing/anticipatory-bail/litigant', label: 'Litigants' },
        { path: '/filing/anticipatory-bail/ground', label: 'Grounds' },
        { path: '/filing/anticipatory-bail/previous-history', label: 'Previous Case History' },
        { path: '/filing/anticipatory-bail/advocate', label: 'Advocate Details' },
        { path: '/filing/anticipatory-bail/document', label: 'Upload Documents' },
        { path: '/filing/anticipatory-bail/payment', label: 'eCourt Fee' },
        { path: '/filing/anticipatory-bail/efile', label: 'eFile' },
      ];

      
    return (
        <div id="stepper1" className="bs-stepper">
            <div className="bs-stepper-header mb-3">
                {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div
                    className={`step ${location.pathname.includes(step.path) ? "active" : ""}`}
                    data-target={`#${step.path}`}
                    >
                    <NavLink
                        to={`/filing/bail/${step.path}`}
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
    )
}

export default Stepper