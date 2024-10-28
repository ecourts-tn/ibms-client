import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth'
import { toast, ToastContainer } from 'react-toastify';
import { LanguageContext } from 'contexts/LanguageContex';

export default function MenuBar() {

  const {language, toggleLanguage} = useContext(LanguageContext)
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();


  useEffect(() => {
    if (sessionStorage.getItem("access") !== null) {
      setIsAuth(true);
      setUser(JSON.parse(sessionStorage.getItem("user"))); 
    }
  }, []);

  const handleLogout = async (e) => {
    const response = await api.post('auth/logout/', {
      refresh: sessionStorage.getItem(REFRESH_TOKEN),
    });
    if (response.status === 205) {
      sessionStorage.clear();
      setIsAuth(false)
      toast.success(t('alerts.logged_out'), { theme: "colored" });
      setTimeout(() => {
        navigate('/');
      },1000)
    }
  };

  if (!user) {
    return navigate('/')
  }

  return (
      <>
        <ToastContainer />
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
                <a href="#" className="d-block">{ user.user.username }</a>
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
                {/* Start - Court user menu */}
                { parseInt(user.user.user_type) === 8 && (
                <>
                  <li className="nav-item menu-open">
                    <Link to="/court/dashboard" className="nav-link active">
                      <i className="nav-icon fas fa-tachometer-alt" />
                      <p>Dashboard</p>
                    </Link> 
                  </li>
                  <li className="nav-item">
                    <a href="/#" className="nav-link">
                      <i className="nav-icon fas fa-table"></i>
                      <p>Registration <i className="fas fa-angle-left right"></i></p>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <Link to="/court/petition/scrutiny" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Case Scrutiny</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/court/petition/registration/list/" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Case Registration</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/court/petition/listed-today" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Post Cases to Causelist</p>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href={void(0)} className="nav-link">
                      <i className="nav-icon fas fa-table" />
                      <p> Court Proceedings <i className="fas fa-angle-left right" /></p>
                    </a>
                    <ul className="nav nav-treeview">
                      {/* <li className="nav-item">
                        <Link to="/court/today-cases" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Today's Cases</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Pending Cases</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Disposed Cases</p>
                        </Link>
                      </li> */}
                      <li className="nav-item">
                        <Link to="/court/petition/proceedings" className="nav-link">
                          <i className="far fa-circle nav-icon" />
                          <p>Daily Proceedings</p>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="nav-icon fas fa-table" />
                      <p> Orders <i className="fas fa-angle-left right" /></p>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <Link to="/court/orders/generate/" className="nav-link">
                          <i className="nav-icon far fa-circle text-info" />
                          <p>Generate Orders</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="police-response" className="nav-link">
                          <i className="nav-icon far fa-circle text-info" />
                          <p>Publish/Upload Orders</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="police-response" className="nav-link">
                          <i className="nav-icon far fa-circle text-info" />
                          <p>Order Status</p>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link to="police-response" className="nav-link">
                      <i className="nav-icon far fa-circle text-info" />
                      <p>Surender</p>
                    </Link>
                  </li>  
                  <li className="nav-item">
                    <Link to="/court/surety/pending/list/" className="nav-link">
                      <i className="nav-icon far fa-circle text-info" />
                      <p>Surety</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="police-response" className="nav-link">
                      <i className="nav-icon far fa-circle text-info" />
                      <p>Condition Complaince</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="police-response" className="nav-link">
                      <i className="nav-icon far fa-circle text-info" />
                      <p>Reports</p>
                    </Link>
                  </li>   
                </>
                )}
                { /* End - Court user menu */} 
                { /* Start - Police user menu */}
                { parseInt(user.user.user_type) === 5 && (
                <>
                  <li className="nav-item menu-open">
                    <Link to="/police/dashboard" className="nav-link active">
                      <i className="nav-icon fas fa-tachometer-alt" />
                      <p>Dashboard</p>
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
                      <p>Condition</p>
                    </Link>
                  </li>    
                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="nav-icon fas fa-file" />
                      <p>File Petition<i className="fas fa-angle-left right" /></p>
                    </a>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <Link to="/police/bail/cancellation" className="nav-link">
                          <i className="nav-icon far fa-circle text-info" />
                          <p>Bail Cancellation</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/police/request/custody" className="nav-link">
                          <i className="nav-icon far fa-circle text-info" />
                          <p>Request Custody</p>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link to="/police/profile" className="nav-link">
                      <i className="nav-icon far fa-circle text-info" />
                      <p>Profile</p>
                    </Link>
                  </li>         
                </>
                )}
                { /* End - Police user menu */}
                { /* Start - Prison user menu */}
                { parseInt(user.user.user_type) === 4 && (
                  <>
                    <li className="nav-item menu-open">
                      <Link to="/prison/dashboard" className="nav-link active">
                        <i className="nav-icon fas fa-tachometer-alt" />
                        <p>Dashboard</p>
                      </Link>  
                    </li> <li className="nav-item">
                      <Link to="/prison/response/pending" className="nav-link">
                        <i className="nav-icon far fa-circle text-info" />
                        <p>Pending Response</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/prison/response/submitted" className="nav-link">
                        <i className="nav-icon far fa-circle text-info" />
                        <p>Submitted Response</p>
                      </Link>
                    </li>        
                  </>
                )}
                {/** End - Prison user menu */}
                { parseInt(user.user.user_type) === 3 && (
                  <>
                    <li className="nav-item menu-open">
                      <Link to="/prosecution/dashboard" className="nav-link active">
                        <i className="nav-icon fas fa-tachometer-alt" />
                        <p>Dashboard</p>
                      </Link>  
                    </li> <li className="nav-item">
                      <Link to="/prosecution/response/pending" className="nav-link">
                        <i className="nav-icon far fa-circle text-info" />
                        <p>Pending Response</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/prosecution/response/submitted" className="nav-link">
                        <i className="nav-icon far fa-circle text-info" />
                        <p>Submitted Response</p>
                      </Link>
                    </li>       
                  </>
                )}
                <li className="nav-item">
                  <Link to="/auth/user/registration/" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>User Registration</p>
                  </Link>
                </li> 
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
      </>
  );
}