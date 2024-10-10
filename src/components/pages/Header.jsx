import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import { REFRESH_TOKEN } from "../../constants";
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const {language, toggleLanguage} = useContext(LanguageContext)
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };

  useEffect(() => {
    if (sessionStorage.getItem("access") !== null) {
      setIsAuth(true);
      setUser(JSON.parse(sessionStorage.getItem("user"))); // Assuming user is stored as a JSON object
    }
  }, []);

  const handleLogout = async (e) => {
    const response = await api.post('auth/logout/', {
      refresh: sessionStorage.getItem(REFRESH_TOKEN),
    });
    if (response.status === 205) {
      sessionStorage.clear();
      setIsAuth(false)
      toast.success("You are logged out successfully", { theme: "colored" });
      setTimeout(() => {
        navigate('/');
      },1000)
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg public-navbar">
        <div className="container">
          <a className="navbar-brand" href="#">{t('title')}</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-md-5">
              <li className="nav-item active">
                <Link to="/" className="nav-link">{t('home')}</Link>
              </li>
              {isAuth && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">{t('dashboard')}</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {t('filing')}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <Link to="/petition/bail" className="nav-link">{t('bail')}</Link>
                      <Link to="/petition/anticipatory/bail" className="nav-link">{t('abail')}</Link>
                      <Link to="/petition/relaxation" className="nav-link">{t('condition')}</Link>
                      <Link to="/petition/intervene" className="nav-link">{t('intervene')}</Link>
                      <Link to="/petition/modification" className="nav-link">{t('modification')}</Link>
                      <Link to="/petition/surety" className="nav-link">{t('surety')}</Link>
                      <Link to="/petition/surety-discharge" className="nav-link">{t('discharge_surety')}</Link>
                      <Link to="/petition/extension-time" className="nav-link">{t('extension')}</Link>
                      <Link to="/petition/return-passport" className="nav-link">{t('return_passport')}</Link>
                      <Link to="/petition/return-property" className="nav-link">{t('return_property')}</Link>
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link to="pleadings" className="nav-link">Pleadings</Link>
                  </li>
                </>
              )}
              <li className="nav-item dropdown">
                <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {t('case_status')}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link to="/status/filing-number" className="nav-link">{t('filing_number')}</Link>
                  <Link to="/status/registration-number" className="nav-link">{t('registration_number')}</Link>
                  <Link to="/status/cnr-number" className="nav-link">{t('cnr_number')}</Link>
                  <Link to="/status/fir-number" className="nav-link">{t('fir_number')}</Link>
                  {/* <Link to="/status/party-name" className="nav-link">Party Name</Link> */}
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
              { isAuth && (
                <li className="nav-item dropdown">
                  <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <AccountCircleIcon /> {user.user.userlogin || 'User'}
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link to="/auth/profile" className="nav-link">{t('profile')}</Link>
                    <Link to="/auth/change-password" className="nav-link">{t('change_password')}</Link>
                    <Link onClick={handleLogout} className="nav-link">{t('logout')}</Link>
                  </div>
                </li>
              )}
              <li className="nav-item">
                <a href="#/" className="btn btn-sm btn-warning mt-1 px-2 ml-2" onClick={toggleLanguage}><strong>{language === 'en' ? 'தமிழ்' : 'English'}</strong></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
