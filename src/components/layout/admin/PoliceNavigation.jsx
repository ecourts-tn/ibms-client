import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRoles } from 'hooks/useRoles'

const PoliceNavigation = () => {
    const {t} = useTranslation()
    const { isAdmin } = useRoles()
    if(!isAdmin){
        return (
            <React.Fragment>
                <li className="nav-item">
                    <Link to="/police/dashboard" className="nav-link">
                        <i className="nav-icon fas fa-tachometer-alt" />
                        <p>{t('dashboard')}</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/police/response/pending" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>Pending Response</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/police/response/submitted" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>Submitted Response</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/police/condition" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>Condition Complaince</p>
                    </Link>
                </li>    
                <li className="nav-item">
                    <Link to="/police/filing/petition" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>File Petition</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/police/profile" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>Profile</p>
                    </Link>
                </li>  
            </React.Fragment>
        )
    }
    return null
}

export default PoliceNavigation