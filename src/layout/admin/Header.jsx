import React from 'react'
import Button from 'react-bootstrap/Button';
import MenuBar from './MenuBar';


const Header = () => {
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <div className="input-group">
            <input type="date" className="form-control" />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">Change</button>
            </div>
          </div>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" data-widget="fullscreen" href="#" role="button">
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="#" role="button">
              <i className="fas fa-th-large" />
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Header