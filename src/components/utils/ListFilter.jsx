import React, {useState} from 'react'

const ListFilter = ({setSearch, pageSize, setPageSize}) => {
    
    const [filterText, setFilterText] = useState('')

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(filterText)
    } 

    return (
        <div className="row d-flex justify-content-between">
            <div className="col-md-3">
                <div className="form-group row no-gutters">
                    <div className="col-md-3">
                        <select 
                            value={pageSize} 
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className='form-control'
                        >
                            {[10, 25, 50, 75, 100].map(size => <option key={size} value={size}>{size}</option>)}
                        </select>
                    </div>
                    <label htmlFor="" className="col-sm-8 m-1">entries per page</label>
                </div>
            </div>
            <div className="col-md-3">
                <div class="input-group mb-3">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Search..." 
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <div class="input-group-append">
                        <button 
                            className="btn btn-primary"
                            onClick={(e) => handleSearch(e)}
                        >Search</button>
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default ListFilter