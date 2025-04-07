import React from 'react'

const ListFilter = ({search, setSearch, pageSize, setPageSize}) => {
    return (
        <div className="row d-flex justify-content-between">
            <div className="col-md-3">
                <div class="input-group mb-3">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Search..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div class="input-group-append">
                        <button className="btn btn-primary">Search</button>
                    </div>
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-7">Items per page</label>
                    <div className="col-md-5">
                        <select 
                            value={pageSize} 
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className='form-control'
                        >
                            {[1, 2, 3, 4, 5].map(size => <option key={size} value={size}>{size}</option>)}
                        </select>
                    </div>
                </div>
            </div>

    
    
  </div>
    )
}

export default ListFilter