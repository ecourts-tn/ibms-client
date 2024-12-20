import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { REFRESH_TOKEN } from "constants";
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { LanguageContext } from 'contexts/LanguageContex';
import { AuthContext } from 'contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import api from 'api';

const Header = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [isHomeDisabled, setIsHomeDisabled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false); // State for High Contrast Mode
  const navigate = useNavigate();
  const { t } = useTranslation();



  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionStorage.getItem("access")) {
      setIsAuth(true);
      setIsHomeDisabled(true)
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleHomeClick = (event) => {
    if (isHomeDisabled) {
      event.preventDefault(); // Prevent navigation
    }
  };

  const handleLogout = async () => {
    const response = await api.post("auth/logout/", {
      refresh: sessionStorage.getItem(REFRESH_TOKEN),
    });

    if (response.status === 205) {
      sessionStorage.clear();
      toast.success(t("alerts.logged_out"), { theme: "colored" });
      setIsAuth(false);
      setUser(null);
      navigate("/");
    }
  };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  // };
  // // Inline CSS for body
  // const bodyStyle = {
  //   backgroundColor: isDarkMode ? '#121212' : '', // Dark mode background vs light mode
  //   color: isDarkMode ? 'white' : 'black', // Yellow text color in dark mode, black in light mode
  // };


  const renderDropdownLinks = (links) => {
    return links.map((link) => (
      <Link to={link.path} key={link.path} className="nav-link">{link.label}</Link>
    ));
  };

  const filingLinks = [
    { path: "/filing/bail/initial-input", label: t('bail') },
    { path: "/filing/anticipatory-bail/initial-input", label: t('abail') },
    { path: "/filing/condition-relaxation/initial-input", label: t('condition_relaxation') },
    { path: "/filing/intervene-petition/initial-input", label: t('intervene') },
    { path: "/filing/modification-petition/initial-input", label: t('modification') },
    { path: "/filing/surety-petition/initial-input", label: t('surety') },
    { path: "/filing/surety-discharge/initial-input", label: t('discharge_surety') },
    { path: "/filing/time-extension/initial-input", label: t('extension') },
    { path: "/filing/return-passport/initial-input", label: t('return_passport') },
    { path: "/filing/return-property/initial-input", label: t('return_property') },
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
              <button type="button" class="btn btn-default"><i class="fa fa-sitemap"></i></button>
              <button type="button" class="btn btn-default" id="decreaseFont"><i class="fa fa-font"></i>-</button>
              <button type="button" class="btn btn-default" id="defaultFont"><i class="fa fa-font"></i></button>
              <button type="button" class="btn btn-default" id="increaseFont"><i class="fa fa-font"></i>+</button>
              <button type="button" class="btn btn-default" id="highContrast"><i class="fa fa-adjust"></i></button>
              {/* <button
                type="button" class="btn btn-default"
                onClick={toggleDarkMode}
              >
              <i className="fa fa-adjust"></i>
              </button> */}
            </div>
            <ul className="navbar-nav ml-md-5">
              {isAuth && (
                <li className="nav-item dropdown">
                  <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown">
                    <AccountCircleIcon /> {user?.userlogin}
                  </a>
                  <div className="dropdown-menu">
                    <Link to="/auth/profile" className="nav-link">{t('profile')}</Link>
                    <Link to="/auth/change-password" className="nav-link">{t('change_password')}</Link>
                    <button onClick={handleLogout} className="nav-link btn btn-link">{t('logout')}</button>
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
                <Link 
                  to={isHomeDisabled ? "#" : "/"}
                  className="nav-link" 
                  onClick={handleHomeClick}
                  style={{
                    pointerEvents: isHomeDisabled ? "none" : "auto",
                    color: isHomeDisabled ? "#797d7f" : "#074280",
                  }}
                  aria-disabled={isHomeDisabled}
                >{t('home')}</Link>
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
                    <Link to="/filing/pleadings" className="nav-link">{t('pleadings')}</Link>
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
                <Link to="/verify-order" className="nav-link">{t('verify_order')}</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
