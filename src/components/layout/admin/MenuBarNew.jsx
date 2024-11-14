import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next';
import api from 'api';
import { REFRESH_TOKEN } from 'constants';

export default function MenuBar() {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const access = sessionStorage.getItem("access");
    if (access) {
      setIsAuth(true);
      setUser(JSON.parse(sessionStorage.getItem("user")));
    }
  }, []);

  const handleLogout = async () => {
    const response = await api.post('auth/logout/', {
      refresh: sessionStorage.getItem(REFRESH_TOKEN),
    });
    if (response.status === 205) {
      sessionStorage.clear();
      setIsAuth(false);
      toast.success(t('alerts.logged_out'), { theme: "colored" });
      setTimeout(() => navigate('/'), 1000);
    }
  };

  if (!user) return null;

  const userMenus = {
    8: [
      { to: "/ibms/court/dashboard", label: t('dashboard'), icon: "fas fa-tachometer-alt" },
      { 
        label: t('registration'), 
        icon: "fas fa-table", 
        subMenu: [
          { to: "/ibms/court/petition/scrutiny", label: t('case_scrutiny') },
          { to: "/ibms/court/petition/registration/list/", label: t('registration') },
          { to: "/ibms/court/petition/listed-today", label: t('post_causelist') }
        ]
      },

      // Add more court-specific menus here
    ],
    5: [
      { to: "police/dashboard", label: 'Dashboard', icon: "fas fa-tachometer-alt" },
      { to: "police/response/pending", label: 'Pending Response', icon: "far fa-circle text-info" },
      { to: "police/response/submitted", label: 'Submitted Response', icon: "far fa-circle text-info" },
      { to: "police/condition", label:"Condition", icon:"far fa-circle text-info"},
      { 
        label: "Filing",
        icon: "fas fa-file",
        subMenu:[
          { to: "bail/cancellation", label: "Bail Cancellation", icon:"fas fa-circle text-info"}
        ]
      }
      // Add more police-specific menus here
    ],
    4: [
      { to: "/prison/dashboard", label: t('dashboard'), icon: "fas fa-tachometer-alt" },
      { to: "/prison/response/pending", label: t('pending_response'), icon: "far fa-circle text-info" },
      // Add more prison-specific menus here
    ],
    3: [
      { to: "/prosecution/dashboard", label: t('dashboard'), icon: "fas fa-tachometer-alt" },
      { to: "/prosecution/response/pending", label: t('pending_response'), icon: "far fa-circle text-info" },
      // Add more prosecution-specific menus here
    ],
  };

  const commonMenus = [
    { to: "/auth/user/registration/", label: t('user_registration'), icon: "far fa-circle text-info" },
    { label: t('logout'), icon: "far fa-circle text-info", onClick: handleLogout }
  ];

  const renderMenuItems = (menuItems) =>
    menuItems.map((item, index) => (
      <li key={index} className="nav-item">
        {item.subMenu ? (
          <>
            <a href="#/" className="nav-link">
              <i className={`nav-icon ${item.icon}`} />
              <p>{item.label} <i className="fas fa-angle-left right" /></p>
            </a>
            <ul className="nav nav-treeview">
              {item.subMenu.map((subItem, subIndex) => (
                <li key={subIndex} className="nav-item">
                  <Link to={subItem.to} className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>{subItem.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Link to={item.to} className="nav-link" onClick={item.onClick}>
            <i className={`nav-icon ${item.icon}`} />
            <p>{item.label}</p>
          </Link>
        )}
      </li>
    ));

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
              <img src={`${process.env.PUBLIC_URL}/images/highcourtlogo.png`} className="img-circle elevation-2" alt="User Icon" />
            </div>
            <div className="info">
              <a href="#/" className="d-block">{user.username}</a>
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
              {renderMenuItems(userMenus[user.user_type] || [])}
              {renderMenuItems(commonMenus)}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
