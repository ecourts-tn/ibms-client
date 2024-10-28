import React from 'react'

const DashboardCard = ({color, title, count, url, icon}) => {
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
                <a href={url} className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
            </div>
        </div>
    )
}

export default DashboardCard