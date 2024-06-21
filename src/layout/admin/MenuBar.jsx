import React from 'react';
import { Link } from 'react-router-dom';


export default function MenuBar() {
  return (
      <>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          {/* <a href="index3.html" className="brand-link">
            <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
            <span className="brand-text font-weight-light">AdminLTE 3</span>
          </a> */}
          <div className="sidebar">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
              </div>
              <div className="info">
                <a href="#" className="d-block">Welcome</a>
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
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li className="nav-item menu-open">
                  <Link to="filing" className="nav-link active">
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>Dashboard</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-table"></i>
                    <p>Registration <i className="fas fa-angle-left right"></i></p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>Post Cases to Causelist</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        <i className="far fa-circle nav-icon" />
                        <p>Scrutiny Cases</p>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-table" />
                    <p> Court Proceedings <i className="fas fa-angle-left right" /></p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <Link to="/today-cases" className="nav-link">
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
                    </li>
                    <li className="nav-item">
                      <Link to="/daily-proceedings" className="nav-link">
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
                      <Link to="police-response" className="nav-link">
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
                  <Link to="police-response" className="nav-link">
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
              </ul>
            </nav>
          </div>
        </aside>
      </>
  );
}