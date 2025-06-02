import React from 'react'
import { Link } from 'react-router-dom'
import NavDropdown from './NavDropdown'
import { useTranslation } from 'react-i18next'

const PrisonNavigation = () => {
    const {t} = useTranslation()
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

export default PrisonNavigation