import React from 'react'
import DateChange from './DateChange'

const Header = () => {
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <DateChange />
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