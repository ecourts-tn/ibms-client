import React, {useContext, useState} from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from 'contexts/AuthContext'
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { REFRESH_TOKEN } from "constants";
import { toast, ToastContainer } from 'react-toastify';
import CourtNavigation from './CourtNavigation';
import PoliceNavigation from './PoliceNavigation';
import PrisonNavigation from './PrisonNavigation';
import { useRoles } from 'hooks/useRoles';


export default function MenuBar() {

    const {user, logout} = useContext(AuthContext)
    const { isAdmin } = useRoles()
    const {t} = useTranslation()
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

  
    const handleLogout = async () => {
        try {
            await logout(); // Use logout from AuthContext
            toast.success(t("alerts.logged_out"), { theme: "colored" });
            navigate("/");
        } catch (error) {
            toast.error(t("alerts.logout_failed"), { theme: "colored" });
        }
    };

    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href="#/" className="brand-link text-center">
                <span className="brand-text font-weight-bold">IBMS - MHC</span>
            </a>
            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src={`${process.env.PUBLIC_URL}/images/highcourtlogo.png`} className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">{ user.username }</a>
                    </div>
                </div>
                <div className="form-inline">
                    <div className="input-group" data-widget="sidebar-search">
                        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                        <div className="input-group-append">
                        <button className="btn btn-sidebar">
                            <i className="fas fa-search fa-fw" />
                        </button>
                        </div>
                    </div>
                </div>
                <nav className="mt-2">
                { user && (
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        { parseInt(user.department) === 1 && (
                            <CourtNavigation />
                        )}
                        { parseInt(user.department) === 2 && (
                            <PoliceNavigation />
                        )}
                        { parseInt(user.department) === 3 && (
                            <PrisonNavigation />
                        )}
                        { parseInt(user.department) === 4 && (
                        <>
                            <li className="nav-item menu-open">
                            <Link to="/prosecution/dashboard" className="nav-link active">
                                <i className="nav-icon fas fa-tachometer-alt" />
                                <p>Dashboard</p>
                            </Link>  
                            </li> <li className="nav-item">
                            <Link to="/prosecution/remark/pending" className="nav-link">
                                <i className="nav-icon far fa-circle text-info" />
                                <p>Pending Remarks</p>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <Link to="/prosecution/remark/submitted" className="nav-link">
                                <i className="nav-icon far fa-circle text-info" />
                                <p>Submitted Remarks</p>
                            </Link>
                            </li>       
                        </>
                        )}
                        { isAdmin && (
                        <li className="nav-item">
                            <Link to="/auth/user/registration/" className="nav-link">
                                <i className="nav-icon far fa-circle text-info" />
                                <p>User Registration</p>
                            </Link>
                        </li> 
                        )}
                        <li className="nav-item">
                            <Link onClick={handleLogout} className="nav-link">
                                <i className="nav-icon far fa-circle text-info" />
                                <p>Logout</p>
                            </Link>
                        </li>    
                    </ul>
                )}
                </nav>
            </div>
        </aside>
    );
}