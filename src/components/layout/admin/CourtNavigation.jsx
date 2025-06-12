import React from 'react'
import { Link } from 'react-router-dom'
import NavDropdown from './NavDropdown'
import { useTranslation } from 'react-i18next'
import { useRoles } from 'hooks/useRoles'

const CourtNavigation = () => {
    const {t} = useTranslation()
    const { isFORA, isCourt, isJudge, isSteno } = useRoles()

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
                    <NavDropdown title="Admin Menu" icon="fas fa-table" items={[
                        { to: "/court/admin/judge/list", label: "Judge" },
                        { to: "/court/admin/judge/period/list", label: "Judge Period" },
                        { to: "/court/admin/bench/list", label: "Bench" },
                        { to: "#", label: "Bench Period" },
                    ]} /> 
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