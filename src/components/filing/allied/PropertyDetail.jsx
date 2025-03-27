import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import MaterialDetails from './MaterialDetails';
import VehicleDetails from './VehicleDetails';

const PropertyDetail = ({ materials, setMaterials, vehicles, setVehicles }) => {
    const {t} = useTranslation();
    const [propertyType, setPropertyType] = useState(1);

    return (
        <div className="card card-navy">
            <div className="card-header">
                <strong>{t('property_details')}</strong>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="form-group row">
                            <label className='col-sm-3 form-label'>{t('property_type')}</label>
                            <div className="col-sm-7">
                                <div className="icheck-primary d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        name="property_type" 
                                        id="propertyTypeMaterial" 
                                        value="1"
                                        checked={propertyType === 1}
                                        onChange={() => setPropertyType(1)} 
                                    />
                                    <label htmlFor="propertyTypeMaterial">{t('material')}</label>
                                </div>
                                <div className="icheck-primary d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="propertyTypeVehicle" 
                                        name="property_type" 
                                        value="2"
                                        checked={propertyType === 2} 
                                        onChange={() => setPropertyType(2)}
                                    />
                                    <label htmlFor="propertyTypeVehicle">{t('vehicle')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-12'>
                        {propertyType === 1 && (
                            <MaterialDetails materials={materials} setMaterials={setMaterials} />
                        )}
                        {propertyType === 2 && (
                            <VehicleDetails vehicles={vehicles} setVehicles={setVehicles} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
