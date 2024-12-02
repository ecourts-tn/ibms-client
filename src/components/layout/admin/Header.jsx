import React, { useContext } from 'react'
import DateChange from './DateChange'
import { LanguageContext } from 'contexts/LanguageContex'
import { JudgeContext } from 'contexts/JudgeContext'

const Header = () => {
  const {language, toggleLanguage} = useContext(LanguageContext)
  const {judge} = useContext(JudgeContext)
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <DateChange />
        <span className='mx-5'>
          <span className="text-primary">
            <strong className="text-primary">{judge.judge?.judge_name} ({judge.judge?.jocode}) {judge.is_incharge ? '(Incharge)' : ''}</strong>
          </span>
          <span style={{display:'block', marginTop:'-5px'}} className="text-muted">
            <strong>
              {`${judge.court?.designation_name}, ${judge.court?.court_name}`}
            </strong>
          </span>
        </span>
        <span className="text-danger">

        </span>
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