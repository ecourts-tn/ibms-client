import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRoles } from 'hooks/useRoles'

const PrisonNavigation = () => {
    const {t} = useTranslation()
    const { isAdmin } = useRoles()
    if(!isAdmin){
        return (
            <React.Fragment>
                <li className="nav-item menu-open">
                    <Link to="/prison/dashboard" className="nav-link active">
                        <i className="nav-icon fas fa-tachometer-alt" />
                        <p>Dashboard</p>
                    </Link>  
                </li> 
                <li className="nav-item">
                    <Link to="/prison/jail-remark/pending" className="nav-link">
                        <i className="nav-icon far fa-circle text-info" />
                        <p>Update Bail Details</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/prison/jail-remark/submitted" className="nav-link">
                        <i className="nav-icon far fa-circle text-info" />
                        <p>Released Report</p>
                    </Link>
                </li>
            </React.Fragment>
        )
    }
    return null;
}

export default PrisonNavigation