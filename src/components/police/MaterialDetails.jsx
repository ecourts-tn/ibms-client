import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IconButton, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from 'yup'
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/validation/validations';


const MaterialDetails = ({ materials = [], setMaterials }) => {
  // Define material state within the component
  // const [material, setMaterial] = useState([]);

  const [material, setMaterial] = useState({ material_name: '', quantity: '', quantity_nature: '', is_produced: '', produced_date: '', reason: '' });

  const initialState = {
    material_name: "",
    quantity: "",
    quantity_nature: "",
    is_produced: false,
    produced_date: null, // Ensure initial value is null
    reason: "",
  };
  const validationSchema = Yup.object({
    material_name: Yup.string().required("Material Name is required"),
    quantity: Yup.number().required("Quantity is required").positive("Must be positive"),
    unit: Yup.string().required("Unit is required"),
    supplier_details: Yup.string().required("Supplier Details are required"),
});

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const materialNameRef = useRef(null);
  const quantityRef = useRef(null);
  const quantityNatureRef = useRef(null);


  // Handle input change
  // Handle input change
const handleInputChange = (event) => {
  const { name, value, type, checked } = event.target;

  if (type === "radio") {
    // If the input type is radio, only update the `is_produced` field
    setMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: checked ? value : false, // Set value if checked, otherwise false for "No"
    }));
  } else {
    // For other fields, update normally
    setMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  }
};


  const handleAddMaterial = async () => {
    try {
        // Validate the form data using Yup
        await validationSchema.validate(material, { abortEarly: false });

        // If validation succeeds, proceed with adding or updating material
        if (editIndex !== null) {
            // Update existing material
            const updatedMaterials = [...materials];
            updatedMaterials[editIndex] = material;
            setMaterials(updatedMaterials);
            setEditIndex(null);
        } else {
            // Add new material
            setMaterials([...materials, material]);
        }

        // Clear the form inputs
        setMaterial({ material_name: '', quantity: '', quantity_nature: '', is_produced: '', produced_date: '', reason: '' });
        // toast.success("Material details added successfully", { theme: "colored" });

    } catch (error) {
        if (error.inner) {
            // Handle validation errors
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors); // Set errors state to display them on the form
        }
        console.error("Validation failed:", error);
    }
};


  // Handle editing a material
  const handleEdit = (index) => {
    setMaterial(materials[index]);
    setEditIndex(index);
  };

  // Handle deleting a material
  const handleDelete = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (materialNameRef.current) {
      materialNameRef.current.focus(); // Focus on material_name input field
    }
  }, []);

  return (
    <div className="container-fluid p-0">
      <ToastContainer />
      <div className="card shadow-sm">
        {/* <div className="card-header bg-secondary text-white">Material Details</div> */}
        <div className="card-body p-1">
          {/* Input Table */}
          <table className="table table-bordered table-striped">
            <thead className="bg-navy">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Quantity</th>
                <th>Nature</th>
                <th>Material&nbsp;produced?</th>
                <th>Produced Date</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((mat, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{mat.material_name}</td>
                    <td>{mat.quantity}</td>
                    <td>{mat.quantity_nature}</td>
                    <td>{mat.is_produced ? "Yes" : "No"}</td>
                    <td>{mat.produced_date || ""}</td>
                    <td>{mat.reason}</td>
                    <td>
                      <IconButton color="primary" onClick={() => handleEdit(index)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(index)}>
                        <Delete />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Materials Added
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={2}>
                  <input
                    type="text"
                    className={`form-control ${errors.material_name ? "is-invalid" : ""}`}
                    name="material_name"
                    value={material.material_name}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{errors.material_name}</div>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                    name="quantity"
                    value={material.quantity}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{errors.quantity}</div>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${errors.quantity_nature ? "is-invalid" : ""}`}
                    name="quantity_nature"
                    value={material.quantity_nature}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{errors.quantity_nature}</div>
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="is_produced"
                      onChange={() => setMaterial({ ...material, is_produced: true })}
                      checked={material.is_produced === true}
                    />
                    Yes
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="is_produced"
                      onChange={() => setMaterial({ ...material, is_produced: false, produced_date: null })}
                      checked={material.is_produced === false}
                    />
                    No
                  </div>
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    name="produced_date"
                    value={material.produced_date || ""}
                    onChange={handleInputChange}
                    //disabled={!form.is_produced} // Disable if not produced
                  />
                </td>
                <td>
                  <textarea
                    className="form-control"
                    name="reason"
                    value={material.reason}
                    onChange={handleInputChange}
                    rows={1}
                  ></textarea>
                </td>
                <td>
                  <Button variant="contained" color="primary" onClick={handleAddMaterial}>
                    {editIndex !== null ? "Update" : "Add"}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;
