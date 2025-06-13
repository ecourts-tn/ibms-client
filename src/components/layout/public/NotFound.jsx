import React from "react"
import { Link } from "react-router-dom"

function NotFound() {

    return (
        <div className="container-fluid">
            <section className="content" style={{marginTop:'18%'}}>
                <div className="error-page">
                    <h2 className="headline text-danger mr-3" style={{fontWeight:400}}><strong>404</strong></h2>
                    <div className="error-content">
                        <h3 className="text-danger"><i className="fas fa-exclamation-triangle text-danger" /><strong>Oops! Page not found.</strong></h3>
                        <p>
                            The page you are requesting could not be found.
                            Please check the URL or return to the <Link to="/">Homepage</Link>.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NotFound