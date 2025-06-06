import React, { useContext } from 'react'
import DateChange from './DateChange'
import { LanguageContext } from 'contexts/LanguageContex'
import { JudgeContext } from 'contexts/JudgeContext'


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
            { judge ? (
                <div className="mx-5">
                <span className="text-primary font-weight-bold">
                    {judge.judge?.judge_name} ({judge.judge?.jocode}) {judge.is_incharge ? '(Incharge)' : ''} - {judge.court?.designation_name}
                </span>
                <span className="d-block text-muted font-weight-bold" style={{ marginTop: '-5px' }}>
                    {`${judge.court?.court_name}`}
                </span>
                </div>
            ) : (
                <div className="mx-5">
                    
                </div>
            )}
        
            {/* Navbar Icons */}
            <div className="ml-auto">
                <ul className="navbar-nav">
                <li className="nav-item">
                    <select 
                    value={language}
                    onChange={(e) => toggleLanguage(e.target.value)}
                    className="mt-2"
                    >
                    <option value="">Select language</option>
                    <option value="en">English</option>
                    <option value="ta">Tamil</option>
                    </select>
                    {/* <a className="nav-link text-indigo font-weight-bolder" href="javascript:void(0);" onClick={toggleLanguage}>
                    {language === 'en' ? 'தமிழ்' : 'English'}
                    </a> */}
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