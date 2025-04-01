import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const VehicleDetails = ({ vehicles = [], setVehicles }) => {
    const { t } = useTranslation();

    const [vehicle, setVehicle] = useState({
        vehicle_name: '', 
        owner_details: '', 
        owner_address: '',
        vehicle_number: '', 
        fastag_details: '', 
        is_owner_accused: false
    });

    // const [vehicles, setVehicles] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedValue = name === 'is_owner_accused' ? value === 'true' : value;
        setVehicle((prev) => ({ ...prev, [name]: updatedValue }));
    };

    // Add or update vehicle
    const handleAddVehicle = () => {
        if (editIndex !== null) {
            // Update existing vehicle
            const updatedVehicles = [...vehicles];
            updatedVehicles[editIndex] = vehicle;
            setVehicles(updatedVehicles);
            setEditIndex(null);
        } else {
            // Add new vehicle
            setVehicles([...vehicles, vehicle]);
        }
        setVehicle({ vehicle_name: '', owner_details: '', owner_address: '', vehicle_number: '', fastag_details: '', is_owner_accused: 'No' }); // Clear input fields
    };

    // Edit vehicle
    const handleEdit = (index) => {
        setVehicle(vehicles[index]);
        setEditIndex(index);
    };

    // Delete vehicle
    const handleDelete = (index) => {
        setVehicles(vehicles.filter((_, i) => i !== index));
    };

    return (
        <div className="">
            {/* Vehicle Input Form */}
            <div className="mb-4">
                
                <table className="table table-bordered">
                    <thead>
                        <tr className="bg-navy text-white">
                            <th colSpan={8}><strong>{t('vehicle_details')}</strong></th>
                        </tr>
                        <tr className="bg-light">
                            <th>{t('S.No')}</th>
                            <th>{t('vehicle_name')}</th>
                            <th>{t('owner_name')}</th>
                            <th>{t('owner_address')}</th>
                            <th>{t('vehicle_number')}</th>
                            <th>{t('fastag_details')}</th>
                            <th>{t('is_owner_accused')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {vehicles.map((veh, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{veh.vehicle_name}</td>
                                    <td>{veh.owner_details}</td>
                                    <td>{veh.owner_address}</td>
                                    <td>{veh.vehicle_number}</td>
                                    <td>{veh.fastag_details}</td>
                                    <td>{veh.is_owner_accused}</td>
                                    <td className="text-center">
                                        <IconButton color="primary" onClick={() => handleEdit(index)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(index)}>
                                            <Delete />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        <tr>
                            <td></td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="vehicle_name"
                                    value={vehicle.vehicle_name}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="owner_details"
                                    value={vehicle.owner_details}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <textarea
                                    className="form-control"
                                    name="owner_address"
                                    value={vehicle.owner_address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                     name="vehicle_number"
                                    value={vehicle.vehicle_number}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                     name="fastag_details"
                                    value={vehicle.fastag_details}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <select
                                    className="form-control"
                                    name="is_owner_accused"
                                    value={vehicle.is_owner_accused}
                                    onChange={handleInputChange}
                                >
                                    <option value={true}>{t('yes')}</option>
                                    <option value={false}>{t('no')}</option>
                                </select>
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddVehicle}
                                >
                                    {editIndex !== null ? t('update') : t('add')}
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

           
        </div>
    );
};

export default VehicleDetails;