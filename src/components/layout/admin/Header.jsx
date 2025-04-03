import React, { useContext } from 'react'
import DateChange from './DateChange'
import { LanguageContext } from 'contexts/LanguageContex'
import { JudgeContext } from 'contexts/JudgeContext'
import MenuBar from './MenuBar'

const Header = () => {
  const {language, toggleLanguage} = useContext(LanguageContext)
  const {judge} = useContext(JudgeContext)

  return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <div className="d-flex justify-content-center align-items-center w-100">
          {/* Date Change Component */}
          <div className="mx-3">
            <DateChange />
          </div>
          {/* Judge Info */}
          {Number(judge?.id) === 2 && (
            <div className="mx-5">
              <span className="text-primary font-weight-bold">
                {judge.judge?.judge_name} ({judge.judge?.jocode}) {judge.is_incharge ? '(Incharge)' : ''}
              </span>
              <span className="d-block text-muted font-weight-bold" style={{ marginTop: '-5px' }}>
                {`${judge.court?.designation_name}, ${judge.court?.court_name}`}
              </span>
            </div>
          )}
    
          {/* Navbar Icons */}
          <div className="ml-auto">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-indigo font-weight-bolder" href="javascript:void(0);" onClick={toggleLanguage}>
                  {language === 'en' ? 'தமிழ்' : 'English'}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-widget="fullscreen" href="javascript:void(0);" role="button">
                  <i className="fas fa-expand-arrows-alt" />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="javascript:void(0);" role="button">
                  <i className="fas fa-th-large" />
                </a>
              </li>
            </ul>
          </div>
      </div>
    </nav>
  )
}

export default Header