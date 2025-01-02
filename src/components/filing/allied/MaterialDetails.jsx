import React from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

const MaterialDetails = ({material, setMaterial, addMaterial}) => {
    const {t} = useTranslation()

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>{t('name_of_material')}</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name"
                            value={material.name}
                            onChange={(e) => setMaterial({...material, name: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>{t('quantity_of_material')}</label>
                    <div className="col-sm-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="quantity"
                            value={material.quantity}
                            onChange={(e) => setMaterial({...material, quantity: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">{t('nature_of_quantity')}</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="nature"
                            value={material.nature}
                            onChange={(e) => setMaterial({...material, nature: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">{t('remarks')}</label>
                    <div className="col-sm-6">
                        <textarea 
                            name="remarks" 
                            className="form-control"
                            value={material.remarks}
                            onChange={(e) => setMaterial({...material, remarks : e.target.value})}
                        ></textarea>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        {t('save')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MaterialDetails