import React from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

const VehicleDetails = ({vehicle, setVehicle}) => {
    const {t} = useTranslation()
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>{t('vehicle_name')}</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="vehicle_name"
                            value={vehicle.vehicle_name}
                            onChange={(e) => setVehicle({...vehicle, vehicle_name: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>{t('owner_name')}</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="owner_details"
                            value={vehicle.owner_details}
                            onChange={(e) => setVehicle({...vehicle, owner_details: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>{t('owner_address')}</label>
                    <div className="col-sm-6">
                        <textarea 
                            type="text" 
                            className="form-control" 
                            name="owner_details"
                            value={vehicle.owner_address}
                            onChange={(e) => setVehicle({...vehicle, owner_address: e.target.value})}
                        ></textarea>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">{t('vehicle_number')}</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="vehicle_number"
                            value={vehicle.vehicle_number}
                            onChange={(e) => setVehicle({...vehicle, vehicle_number: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className="col-sm-4">{t('fastag_details')}</label>
                    <div className="col-sm-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="fastag_details"
                            value={vehicle.fastag_details}
                            onChange={(e) => setVehicle({...vehicle, fastag_details: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="" className='col-sm-4'>{t('is_owner_accused')}</label>
                    <div className="col-sm-6">
                        <select 
                            name="is_owner_accused" 
                            className="form-control"
                            value={vehicle.is_owner_accused}
                            onChange={(e) => setVehicle({...vehicle, is_owner_accused: e.target.value})}
                        >
                            <option value="Yes">{t('yes')}</option>
                            <option value="No">{t('no')}</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        variant='contained'
                        color="primary"
                    >{t('save')}</Button>
                </div>
            </div>
        </div>
    )
}

export default VehicleDetails