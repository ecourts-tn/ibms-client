import React from 'react'
import { Link } from 'react-router-dom'

const NavDropdown = ({title, icon, items}) => {
    return (
        <li className="nav-item">
        <a href="#" className="nav-link">
            <i className={`nav-icon ${icon}`} />
            <p>{title} <i className="fas fa-angle-left right" /></p>
        </a>
        <ul className="nav nav-treeview">
            {items.map(({ to, label }, index) => (
            <li className="nav-item" key={index}>
                <Link to={to} className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>{label}</p>
                </Link>
            </li>
            ))}
        </ul>
        </li>
    )
}

export default NavDropdown
