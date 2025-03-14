import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import MaterialDetails from './MaterialDetails';
import VehicleDetails from './VehicleDetails';

const PropertyDetail = () => {

    const {t} = useTranslation()
    const materialState = {
            name: '',
            quantity:'',
            nature:'',
            is_produced: '',
            produced_date: '',
            reason: ''
        }
    const[material, setMaterial] = useState(materialState)
    const[materialErrors, setMaterialErrors] = useState({})
    const[materials, setMaterials] = useState([])
    const vehicleState = {
        vehicle_name: '',
        owner_details: '',
        vehicle_number: '',
        fastag_details: '',
        is_owner_accused: ''
    }
    const[vehicle, setVehicle] = useState(vehicleState)
    const[vehicles, setVehicles] = useState([])
    const[propertyType, setPropertyType] = useState(1)

    const addMaterial = () => {}
    
    return (
        <React.Fragment>
            <div className="card card-navy">
                <div className="card-header">
                    <strong>{t('property_details')}</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label htmlFor="" className='col-sm-2 form-label'>{t('property_type')}</label>
                                <div className="col-sm-9">
                                    <div className="icheck-primary d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        name="property_type" 
                                        id="propertyTypeYes" 
                                        value={propertyType}
                                        checked={ parseInt(propertyType) === 1 ? true : false}
                                        onChange={(e) => setPropertyType(1)} 
                                    />
                                    <label htmlFor="propertyTypeYes">{t('material')}</label>
                                    </div>
                                    <div className="icheck-primary d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="propertyTypeNo" 
                                        name="property_type" 
                                        value={propertyType}
                                        checked={ parseInt(propertyType) === 2 ? true : false } 
                                        onChange={(e) => setPropertyType(2)}
                                    />
                                    <label htmlFor="propertyTypeNo">{t('vehicle')}</label>
                                    </div>
                                </div>
                            </div>
                            { parseInt(propertyType) === 1 && (
                                <MaterialDetails material={material} setMaterial={setMaterial} addMaterial={addMaterial}/>
                            )}
                            { parseInt(propertyType) === 2 && (
                                <VehicleDetails  vehicle={vehicle} setVehicle={setVehicle}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PropertyDetail