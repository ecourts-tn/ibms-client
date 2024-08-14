import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Header = () => {

  const[isAuth, setIsAuth] = useState(false)
  const[user, setUser] = useState({})

  useEffect(() => {
    if(localStorage.getItem("access") !== null){
      setIsAuth(true)
    }
  },[isAuth])

  useEffect(() => {
      setUser(localStorage.getItem("user"))
  },[])

  return (
      <>
        <nav className="navbar navbar-expand-lg public-navbar">
          <div className="container">
            <a className="navbar-brand" href="#">Integrated Bail Management System</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse  d-flex justify-content-end" id="navbarSupportedContent">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <Link to="/" className='nav-link'>Home</Link>
                </li>
                <li className="nav-item">
                  { isAuth ? <Link to="/dashboard" className="nav-link">Dashboard</Link> : null}
                </li>
                { isAuth ? (
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
                  ) : null}
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
                  <Link href="#features" className='nav-link'>User Guide</Link>
                </li>
                <li className="nav-item">
                  <Link href="#contact" className="nav-link">Contact</Link>
                </li>
                <li className="nav-item">
                  <Link href="#" className="nav-link nav-link-order">Verify Order</Link>
                </li>
                <li className="nav-item">
                  { isAuth ? 
                    <li className="nav-item dropdown">
                      <a href="#/" className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <AccountCircleIcon /> ATN20240000001
                      </a>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link to="/auth/profile" className="nav-link">Profile</Link>
                        <Link to="/auth/change-password" className="nav-link">Change Password</Link>
                        <Link to="/logout" className="nav-link">Logout</Link>
                      </div>
                    </li>
                    : 
                    <Link to="/" className="nav-link">Login</Link>
                  }
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    )
}

export default Header