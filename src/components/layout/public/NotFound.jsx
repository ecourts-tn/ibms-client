import React from "react"
import { Link } from "react-router-dom"

function NotFound() {

    const[search, setSearch] = React.useState('')
    const[searchError, setSearchError] = React.useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if(search === ''){
            setSearchError(true)
        }
    }

    return (
        <>
            <div className="container">
                <section className="content my-5 py-5">
                    <div className="error-page py-5">
                        <h2 className="headline text-danger mr-3" style={{fontWeight:400}}><strong>404</strong></h2>
                        <div className="error-content">
                            <h3 className="text-danger"><i className="fas fa-exclamation-triangle text-danger" /><strong>Oops! Page not found.</strong></h3>
                            <p>
                                We could not find the page you were looking for.
                                Meanwhile, you may <Link to="/">return to login page</Link> or try using the search form.
                            </p>
                            <form className="search-form" onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        name="search" 
                                        className={`form-control ${searchError ? 'is-invalid': null}`} 
                                        placeholder="Search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            type="submit" 
                                            name="submit" 
                                            className="btn btn-danger">
                                                <i className="fas fa-search mr-2" />Search
                                            </button>
                                    </div>
                                </div>
                                { searchError && (
                                <div className="text-danger">
                                    This field is required
                                </div>
                                )}
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default NotFound