import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import NavDropdown from './NavDropdown'
import { useTranslation } from 'react-i18next'
import { useRoles } from 'hooks/useRoles'
import { AuthContext } from 'contexts/AuthContext'

const CourtNavigation = () => {
    const {t} = useTranslation()
    const { user } = useContext(AuthContext)
    const { isFORA, isCourt, isJudge, isSteno } = useRoles()

    const adminMenuItems = [
        { to: "/court/admin/judge/list", label: "Judge" },
        { to: "/court/admin/judge/period/list", label: "Judge Period" },
        { to: "/court/admin/prosecutor/list", label: "Prosecutor Period" },
    ];

    if (user?.seat) {
    adminMenuItems.push({ to: "/court/admin/bench/list", label: "Bench" });
    adminMenuItems.push({ to: "#", label: "Bench Period" }); 
    }

    return (
        <React.Fragment>
            <li className="nav-item">
            <Link to="/court/dashboard" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>{t('dashboard')}</p>
            </Link>
            </li>
    
            {/* { isFORA && ( */}
                <NavDropdown title={t('case_management')} icon="fas fa-table" items={[
                    { to: "/court/case/scrutiny", label: t('case_scrutiny') },
                    { to: "/court/case/registration", label: t('registration') },
                    { to: "/court/case/allocation", label: t('case_allocation') },
                    { to: "/court/case/cause-list/post", label: "Post to Causelist" },
                    { to: "/court/case/cause-list/publish", label: "Publish Causelist" },
                ]} />
            {/* )}
        
            { (isCourt || isJudge) && ( */}

                <React.Fragment>
                    <NavDropdown title="Court Proceedings" icon="fas fa-table" items={[
                        { to: "/court/case/proceeding", label: "Daily Proceedings" },
                        { to: "/court/case/proceeding/modify", label: "Modify Business" },
                        { to: "/court/case/condition", label: "Condition Complaince" },
                    ]} />
                    <NavDropdown title="Orders / Judgements" icon="fas fa-table" items={[
                        { to: "/court/case/order/generate", label: "Generate Orders" },
                        { to: "/court/case/order/upload", label: "Publish/Upload Orders" },
                        { to: "#", label: "Order Status" },
                    ]} />
                    
                    <NavDropdown title="Admin Menu" icon="fas fa-table" items={adminMenuItems} /> 
                    
                    <li className="nav-item">
                        <Link to="#" className="nav-link">
                            <i className="nav-icon far fa-circle text-info" />
                            <p>Surender</p>
                        </Link>
                    </li>   
                </React.Fragment>
            {/* )}       */}
            <li className="nav-item">
                <Link to="#" className="nav-link">
                    <i className="nav-icon far fa-circle text-info" />
                    <p>Reports</p>
                </Link>
            </li>
        </React.Fragment>
    )
}

export default CourtNavigation