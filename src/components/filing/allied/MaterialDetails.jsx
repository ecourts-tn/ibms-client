import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const MaterialDetails = ({ materials = [], setMaterials }) => {
    const { t } = useTranslation();

    const [material, setMaterial] = useState({ material_name: '', quantity: '', nature: '', remarks: '' });
    const [editIndex, setEditIndex] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: value,
        }));
    };

    // Add or update material
    const handleAddMaterial = () => {
        if (editIndex !== null) {
            const updatedMaterials = [...materials];
            updatedMaterials[editIndex] = material;
            setMaterials(updatedMaterials);
            setEditIndex(null);
        } else {
            setMaterials([...materials, material]);
        }
        setMaterial({ material_name: '', quantity: '', nature: '', remarks: '' }); // Clear inputs
    };

    // Edit material
    const handleEdit = (index) => {
        setMaterial(materials[index]);
        setEditIndex(index);
    };

    // Delete material
    const handleDelete = (index) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    return (
        <div className="">
            {/* Material Input Form */}
            <div className="mb-4">
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr className="bg-navy text-white">
                                <th colSpan={6}><strong>{t('material_details')}</strong></th>
                            </tr>
                        <tr className="bg-light">
                            <th>{t('S.No')}</th>
                            <th>{t('name_of_material')}</th>
                            <th>{t('quantity_of_material')}</th>
                            <th>{t('nature_of_quantity')}</th>
                            <th>{t('remarks')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {materials.map((mat, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{mat.material_name}</td>
                                    <td>{mat.quantity}</td>
                                    <td>{mat.nature}</td>
                                    <td>{mat.remarks}</td>
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
                                    name="material_name"
                                    className="form-control"
                                    value={material.material_name}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="quantity"
                                    className="form-control"
                                    value={material.quantity}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="nature"
                                    className="form-control"
                                    value={material.nature}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="remarks"
                                    className="form-control"
                                    value={material.remarks}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddMaterial}
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

export default MaterialDetails;
