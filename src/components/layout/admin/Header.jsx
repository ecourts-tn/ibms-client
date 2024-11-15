import React, { useContext } from 'react'
import DateChange from './DateChange'
import { LanguageContext } from 'contexts/LanguageContex'

const Header = () => {
  const {language, toggleLanguage} = useContext(LanguageContext)
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <DateChange />
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-sm btn-warning mt-1 ml-2 px-3" onClick={toggleLanguage}>
              <strong>{language === 'en' ? 'Tamil' : 'ஆங்கிலம்'}</strong>
            </button>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-widget="fullscreen" href="javascript:void(0);" role="button">
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