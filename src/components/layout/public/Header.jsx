import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from 'api';
import { REFRESH_TOKEN } from "constants";
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next';
import './header.css';

const Header = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionStorage.getItem("access")) {
      setIsAuth(true);
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogout = async () => {
    const response = await api.post('auth/logout/', {
      refresh: sessionStorage.getItem(REFRESH_TOKEN),
    });
    if (response.status === 205) {
      sessionStorage.clear();
      setIsAuth(false);
      toast.success(t('alerts.logged_out'), { theme: "colored" });
      setTimeout(() => navigate('/'), 1000);
    }
  };

  const renderDropdownLinks = (links) => {
    return links.map((link) => (
      <Link to={link.path} key={link.path} className="nav-link">{link.label}</Link>
    ));
  };

  const filingLinks = [
    { path: "/filing/bail/initial-input", label: t('bail') },
    { path: "/filing/anticipatory/bail", label: t('abail') },
    { path: "/filing/condition-relaxation", label: t('condition_relaxation') },
    { path: "/filing/intervene-petition", label: t('intervene') },
    { path: "/filing/modification-petition", label: t('modification') },
    { path: "/filing/surety-petition", label: t('surety') },
    { path: "/filing/surety/discharge", label: t('discharge_surety') },
    { path: "/filing/extension-time", label: t('extension') },
    { path: "/filing/return-passport", label: t('return_passport') },
    { path: "/filing/return-property", label: t('return_property') },
  ];

  const caseStatusLinks = [
    { path: "/status/filing-number", label: t('filing_number') },
    { path: "/status/registration-number", label: t('registration_number') },
    { path: "/status/cnr-number", label: t('cnr_number') },
    { path: "/status/fir-number", label: t('fir_number') },
  ];

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg primary-navbar">
        <div className="container">
          <a className="navbar-brand" href="#"><strong>{t('title')}</strong></a>
          <div className="collapse navbar-collapse d-flex justify-content-end" id="primaryNavbarContent">
            <div className="resize-icons">
              <button type="button" className="btn btn-default">
                <i className="fa fa-sitemap"></i>
              </button>
              <button type="button" className="btn btn-default" id="decreaseFont">
                <i className="fa fa-font"></i>-
              </button>
              <button type="button" className="btn btn-default" id="defaultFont">
                <i className="fa fa-font"></i>
              </button>
              <button type="button" className="btn btn-default" id="increaseFont">
                <i className="fa fa-font"></i>+
              </button>
              <button type="button" className="btn btn-default" id="highContrast">
                <i className="fa fa-adjust"></i>
              </button>
              <button type="button" className="btn btn-default" id="normalMode">
                <i className="fa fa-adjust" style={{ color: '#ffb600' }}></i>
              </button>
              {/* <span className="ml-3 text-white">{t('screen_reader')}</span> */}
            </div>
            <ul className="navbar-nav ml-md-5">
              {isAuth && (
                <li className="nav-item dropdown">
                  <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown">
                    <AccountCircleIcon /> {user.userlogin}
                  </a>
                  <div className="dropdown-menu">
                    <Link to="/auth/profile" className="nav-link">{t('profile')}</Link>
                    <Link to="/auth/change-password" className="nav-link">{t('change_password')}</Link>
                    <Link onClick={handleLogout} className="nav-link">{t('logout')}</Link>
                  </div>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-sm btn-warning mt-1 ml-2 px-3" onClick={toggleLanguage}>
                  <strong>{language === 'en' ? 'Tamil' : 'ஆங்கிலம்'}</strong>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-expand-lg secondary-navbar">
        <div className="container">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText">
            <span className="navbar-toggler-icon"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav ml-md-5">
              <li className="nav-item">
                <Link to="/" className="nav-link">{t('home')}</Link>
              </li>
              {isAuth && (
                <>
                  <li className="nav-item">
                    <Link to="/filing/dashboard" className="nav-link">{t('dashboard')}</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#/" role="button" data-toggle="dropdown">
                      {t('filing')}
                    </a>
                    <div className="dropdown-menu">
                      {renderDropdownLinks(filingLinks)}
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link to="/pleadings" className="nav-link">{t('pleadings')}</Link>
                  </li>
                </>
              )}
              <li className="nav-item dropdown">
                <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown">
                  {t('case_status')}
                </a>
                <div className="dropdown-menu">
                  {renderDropdownLinks(caseStatusLinks)}
                </div>
              </li>
              <li className="nav-item">
                <Link to="#features" className="nav-link">{t('user_guide')}</Link>
              </li>
              <li className="nav-item">
                <Link to="#contact" className="nav-link">{t('contact')}</Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link nav-link-order">{t('verify_order')}</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
