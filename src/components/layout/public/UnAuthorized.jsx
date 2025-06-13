import React from "react"
import { Link } from "react-router-dom"

function UnAuthorized() {

    return (
        <div className="container-fluid">
            <section className="content" style={{marginTop:'18%'}}>
                <div className="error-page">
                    <h2 className="headline mr-3" style={{fontWeight:400, color:'#e67e22'}}><strong>403</strong></h2>
                    <div className="error-content">
                        <h3 style={{color:'#e67e22'}}><i className="fas fa-exclamation-triangle" /><strong>Oops! Access denied.</strong></h3>
                        <p>
                            You do not have permission to perform this action.
                            Meanwhile, you may return to the <Link to="/">Homepage</Link>.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UnAuthorized