import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { LanguageContext } from 'contexts/LanguageContex';
import { AuthContext } from 'contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { isAuth, user, logout } = useContext(AuthContext); // Consume AuthContext
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleHomeClick = (event) => {
    if (isAuth) {
      event.preventDefault(); // Prevent navigation if authenticated
    }
  };

  console.log("User authenticated:", isAuth)

  const handleLogout = async () => {
    try {
      await logout(); // Use logout from AuthContext
      toast.success(t("alerts.logged_out"), { theme: "colored" });
      navigate("/");
    } catch (error) {
      toast.error(t("alerts.logout_failed"), { theme: "colored" });
    }

  };

  const renderDropdownLinks = (links) => {
    return links.map((link) => (
      <Link to={link.path} key={link.path} className="nav-link">{link.label}</Link>
    ));
  };

  const filingLinks = [
    { path: "/filing/bail/initial-input", label: t('bail') },
    { path: "/filing/intervene/initial-input", label: t('intervene') },
    { path: "/filing/surety/main-case-detail", label: t('surety') },
    { path: "/filing/surety-discharge/main-case-detail", label: t('discharge_surety') },
    { path: "filing/allied/main-case-detail", label: t('allied') }
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
              <button type="button" className="btn btn-default"><i className="fa fa-sitemap"></i></button>
              <button type="button" className="btn btn-default" id="decreaseFont"><i className="fa fa-font"></i>-</button>
              <button type="button" className="btn btn-default" id="defaultFont"><i className="fa fa-font"></i></button>
              <button type="button" className="btn btn-default" id="increaseFont"><i className="fa fa-font"></i>+</button>
              <button type="button" className="btn btn-default" id="highContrast"><i className="fa fa-adjust"></i></button>
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
                <select 
                  value={language}
                  onChange={(e) => toggleLanguage(e.target.value)}
                >
                  <option value="">Select language</option>
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                </select>
                {/* <a className="text-white" onClick={toggleLanguage}>
                  <strong>{language === 'en' ? 'Tamil' : 'ஆங்கிலம்'}</strong>
                </a> */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-expand-lg secondary-navbar">
        <div className="container-fluid px-5">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText">
            <span className="navbar-toggler-icon"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav ml-md-5">
              <li className="nav-item">
                <Link
                  to={isAuth ? "#" : "/"}
                  className="nav-link"
                  onClick={handleHomeClick}
                  style={{
                    pointerEvents: isAuth ? "none" : "auto",
                    color: isAuth ? "#797d7f" : "#074280",
                  }}
                  aria-disabled={isAuth}
                >
                  {t('home')}
                </Link>
              </li>
              { isAuth && (
              <li className="nav-item">
                <Link to="/filing/dashboard" className="nav-link">{t('dashboard')}</Link>
              </li>
              )}
              {isAuth && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#/" role="button" data-toggle="dropdown">
                  {t('filing')}
                </a>
                <div className="dropdown-menu">
                  {renderDropdownLinks(filingLinks)}
                </div>
              </li>
              )}
              {isAuth && (
              <li className="nav-item">
                <Link to="/filing/pleadings" className="nav-link">{t('pleadings')}</Link>
              </li>
              )}
              { parseInt(user?.department) === 4 && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#/" role="button" data-toggle="dropdown">
                    {t('PP Remarks')}
                  </a>
                  <div className="dropdown-menu">
                    <li className="nav-item">
                      <Link to="/pp-remarks/pending/" className="nav-link">Pending Remarks</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/pp-remarks/submitted" className="nav-link">Submitted Remarks</Link>
                    </li>   
                  </div>    
                </li>
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