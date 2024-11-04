import React from 'react'
import { useTranslation } from 'react-i18next'

const DashboardCard = ({color, title, count, url, icon}) => {
    const {t} = useTranslation()
    return (
        <div className="col-lg-3 col-6">
            <div className={`small-box ${color}`}>
                <div className="inner">
                    <h3>{ count }</h3>
                    <p>{title}</p>
                </div>
                <div className="icon">
                    <i className={`ion ${icon}`} />
                </div>
                <a href={url} className="small-box-footer">{t('more_info')} <i className="fas fa-arrow-circle-right" /></a>
            </div>
        </div>
    )
}

export default DashboardCard