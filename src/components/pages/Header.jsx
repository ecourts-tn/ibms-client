import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import { REFRESH_TOKEN } from "../../constants";
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

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
          <a className="navbar-brand" href="#">Integrated Bail Management System</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-md-5">
              <li className="nav-item active">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              {isAuth && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Filing
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <Link to="/petition/bail" className="nav-link">Bail Petition</Link>
                      <Link to="/petition/anticipatory/bail" className="nav-link">Anticipatory Bail Petition</Link>
                      <Link to="/petition/relaxation" className="nav-link">Condition Relaxation</Link>
                      <Link to="/petition/intervene" className="nav-link">Intervene Petition</Link>
                      <Link to="/petition/modification" className="nav-link">Modification Petition</Link>
                      <Link to="/petition/surety" className="nav-link">Surety Petition</Link>
                      <Link to="/petition/surety-discharge" className="nav-link">Discharge of Surety</Link>
                      <Link to="/petition/extension-time" className="nav-link">Extension of Time</Link>
                      <Link to="/petition/return-passport" className="nav-link">Return of Passport</Link>
                      <Link to="/petition/return-property" className="nav-link">Return of Property</Link>
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link to="pleadings" className="nav-link">Pleadings</Link>
                  </li>
                </>
              )}
              <li className="nav-item dropdown">
                <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Case Status
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link to="/status/filing-number" className="nav-link">Filing Number</Link>
                  <Link to="/status/registration-number" className="nav-link">Registration Number</Link>
                  <Link to="/status/cnr-number" className="nav-link">CNR Number</Link>
                  <Link to="/status/fir-number" className="nav-link">FIR Number</Link>
                  <Link to="/status/party-name" className="nav-link">Party Name</Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="#features" className="nav-link">User Guide</Link>
              </li>
              <li className="nav-item">
                <Link to="#contact" className="nav-link">Contact</Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link nav-link-order">Verify Order</Link>
              </li>
              <li className="nav-item">
                {isAuth && (
                  <li className="nav-item dropdown">
                    <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <AccountCircleIcon /> {user.user.userlogin || 'User'}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <Link to="/auth/profile" className="nav-link">Profile</Link>
                      <Link to="/auth/change-password" className="nav-link">Change Password</Link>
                      <Link onClick={handleLogout} className="nav-link">Logout</Link>
                    </div>
                  </li>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
