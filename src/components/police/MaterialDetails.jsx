import React from 'react'

const MaterialDetails = ({material, setMaterial, addMaterial}) => {
    return (
        <div className="row">
            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="">Name of the material</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={material.name}
                        onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                    />
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-group">
                    <label htmlFor="">Quantity of the material</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="quantity"
                        value={material.quantity}
                        onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                    />
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="">Nature of Quantity(Small/Commercial)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="nature"
                        value={material.nature}
                        onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                    />
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="">Whether material produced before competent court</label>
                    <select 
                        name="is_produced" 
                        className="form-control"
                        value={material.is_produced}
                        onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="">Produced date</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        name="produced_date"
                        value={material.produced_date}
                        onChange={(e) => setMaterial({...material, [e.target.name]: e.target.value})}
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label htmlFor="">Reason</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="reason"
                        value={material.reason}
                        onChange={(e)=> setMaterial({...material, [e.target.name]: e.target.value})}
                    />
                </div>
            </div>
            <div className="col-md-1 mt-4 pt-2">
                <button 
                    className="btn btn-primary"
                    onClick={(e) =>addMaterial(e)}
                >Add</button>
            </div>
        </div>
    )
}

export default MaterialDetails