import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IconButton, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from 'yup';

// VehicleDetails Component
const VehicleDetails = ({ vehicles = [], setVehicles }) => {
  // Define vehicle state within the component (just one vehicle at a time)
  const [vehicle, setVehicle] = useState({
    vehicle_name: '',
    owner_details: '',
    vehicle_number: '',
    fastag_details: '',
    is_owner_accused: '', // Empty string as default
  });

  const initialState = {
    vehicle_name: "",
    owner_details: "",
    vehicle_number: "",
    fastag_details: "",
    is_owner_accused: "",
  };

  const validationSchema = Yup.object({
    vehicle_name: Yup.string().required("Vehicle Name is required"),
    owner_details: Yup.string().required("Owner Details are required"),
    vehicle_number: Yup.string().required("Vehicle Number is required"),
    fastag_details: Yup.string().required("Fastag Details are required"),
    is_owner_accused: Yup.string().required("Selection is required"),
  });

  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const vehicleNameRef = useRef(null);

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  // Handle add/update vehicle
  const handleAddVehicle = async () => {
    try {
      // Validate the form data using Yup
      await validationSchema.validate(vehicle, { abortEarly: false });

      // Add or update vehicle in the list
      if (editIndex !== null) {
        const updatedVehicles = [...vehicles];
        updatedVehicles[editIndex] = vehicle; // Update vehicle at the edit index
        setVehicles(updatedVehicles);
        setEditIndex(null);
        // toast.success("Vehicle updated successfully", { theme: "colored" });
      } else {
        setVehicles([...vehicles, vehicle]); // Add new vehicle to the list
        // toast.success("Vehicle added successfully", { theme: "colored" });
      }

      // Clear the form after submission
      setVehicle(initialState); // Reset the form
      setErrors({}); // Reset validation errors
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors); // Show validation errors
      }
    }
  };

  // Handle editing a vehicle
  const handleEdit = (index) => {
    setVehicle(vehicles[index]); // Set form data to the vehicle being edited
    setEditIndex(index); // Set the edit index
  };

  // Handle deleting a vehicle
  const handleDelete = (index) => {
    setVehicles(vehicles.filter((_, i) => i !== index)); // Remove vehicle at the given index
    // toast.error("Vehicle deleted successfully", { theme: "colored" });
  };

  // Focus on the vehicle name input field on component mount
  useEffect(() => {
    if (vehicleNameRef.current) {
      vehicleNameRef.current.focus();
    }
  }, []);

  return (
    <div className="container">
      {/* <ToastContainer /> */}
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">Vehicle Details</div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="bg-navy">
              <tr>
                <th>#</th>
                <th>Vehicle Name</th>
                <th>Vehicle Number</th>
                <th>Fastag Details</th>
                <th>Is Owner Accused?</th>
                <th>Owner Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((v, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{v.vehicle_name}</td>
                    <td>{v.vehicle_number}</td>
                    <td>{v.fastag_details}</td>
                    <td>{v.is_owner_accused}</td>
                    <td>{v.owner_details}</td>
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
                  <td colSpan="7" className="text-center">
                    No Vehicles Added
                  </td>
                </tr>
              )}
              <tr>
                <td></td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${errors.vehicle_name ? "is-invalid" : ""}`}
                    name="vehicle_name"
                    value={vehicle.vehicle_name}
                    onChange={handleInputChange}
                    ref={vehicleNameRef}
                  />
                  <div className="invalid-feedback">{errors.vehicle_name}</div>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${errors.vehicle_number ? "is-invalid" : ""}`}
                    name="vehicle_number"
                    value={vehicle.vehicle_number}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{errors.vehicle_number}</div>
                </td>
                <td>
                  <input
                    type="text"
                    className={`form-control ${errors.fastag_details ? "is-invalid" : ""}`}
                    name="fastag_details"
                    value={vehicle.fastag_details}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{errors.fastag_details}</div>
                </td>
                <td>
                  <select
                    name="is_owner_accused"
                    className={`form-control ${errors.is_owner_accused ? "is-invalid" : ""}`}
                    value={vehicle.is_owner_accused}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <div className="invalid-feedback">{errors.is_owner_accused}</div>
                </td>
                <td>
                  <textarea
                    className={`form-control ${errors.owner_details ? "is-invalid" : ""}`}
                    name="owner_details"
                    value={vehicle.owner_details}
                    onChange={handleInputChange}
                  ></textarea>
                  <div className="invalid-feedback">{errors.owner_details}</div>
                </td>
                <td>
                  <Button variant="contained" color="primary" onClick={handleAddVehicle}>
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

export default VehicleDetails;
