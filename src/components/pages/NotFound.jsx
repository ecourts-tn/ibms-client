import React from "react"
import { Link } from "react-router-dom"

function NotFound() {
    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid">
                    <section className="content" style={{ paddingTop: "150px", height:"400px"}}>
                        <div className="error-page">
                            <h3 className="headline text-warning"><strong>404</strong></h3>
                            <div className="error-content">
                            <h3><i className="fas fa-exclamation-triangle text-warning" /> Oops! Page not found.</h3>
                            <p>
                                We could not find the page you were looking for.
                                Meanwhile, you may <Link to="/">return to dashboard</Link> or try using the search form.
                            </p>
                            <form className="search-form">
                                <div className="input-group">
                                    <input type="text" name="search" className="form-control" placeholder="Search" />
                                    <div className="input-group-append">
                                        <button type="submit" name="submit" className="btn btn-warning"><i className="fas fa-search" /></button>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </>
    )
}

export default NotFound