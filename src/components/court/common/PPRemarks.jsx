import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Document from 'components/court/common/Document';
import Loading from 'components/Loading';
import api from 'api';
import { toast, ToastContainer } from 'react-toastify';

const PPRemarks = ({ efile_no }) => {
    const initialState = {
        discharged: false,
        remarks: '',
        accused_data: []
    };

    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false)
    const [remarks, setRemarks] = useState([])

    const handleAccusedTypeChange = (index, value) => {
        const updatedAccusedData = [...form.accused_data];
        updatedAccusedData[index].accused_type = value;
        setForm({ ...form, accused_data: updatedAccusedData });
    };

    useEffect(() => {
        const getAccused = async () => {
            try {
                const response = await api.get('litigant/list/', { params: { efile_no } });
                if (response.status === 200) {
                    setForm({
                        ...form,
                        accused_data: response.data
                            .filter(l => l.litigant_type === 1)  // Filter for litigants with litigant_type === 1
                            .map(l => ({
                                litigant_name: l.litigant_name,
                                accused_type: '',  // Empty initially for each accused
                            })),
                    });
                } else {
                    console.error("Error fetching litigants:", response.status);
                }
            } catch (error) {
                console.error("Error fetching litigants:", error);
            } finally {
            }
        };

        if (efile_no) {  // Only fetch if efile_no is provided
            getAccused();
        }
    }, [efile_no]);  // Runs again whenever efile_no changes

    useEffect(() => {
        const getRemarks = async () => {
            try {
                const response = await api.post('prosecution/remarks/list/', {efile_no});
                if (response.status === 200) {
                    setRemarks(response.data);
                } else {
                    console.error("Error fetching litigants:", response.status);
                }
            } catch (error) {
                console.error("Error fetching litigants:", error);
            } finally {
            }
        };
        if (efile_no) {  // Only fetch if efile_no is provided
            getRemarks();
        }
    }, [efile_no]);  // Runs again whenever efile_no changes


    const handleSubmit = async(e) => {
        e.preventDefault();
        try{   
            setLoading(true)
            form.efile_no = efile_no
            const response = await api.post("prosecution/remarks/create/", form)
            if(response.status === 201){
                toast.success("Remarks added successfully", {
                    theme: "colored"
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    };

    if (Object.keys(remarks).length > 0){
        return(
            <table className="table table-bordered table-striped">
                <thead className='bg-secondary'>
                    <tr>
                        <th>#</th>
                        <th>Accused Name</th>
                        <th>Accused Type</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {remarks.map((r, index) => (
                    <tr>
                        <td>{index+1}</td>
                        <td>{r.accused_name}</td>
                        <td>{r.accused_type}</td>
                        <td>{r.remarks}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <>
            { loading && <Loading />}
            <ToastContainer />
            <form method="POST" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-10">
                        <div className="form-group row">
                            <label className="col-sm-4"></label>
                            <div className="col-sm-4">
                                <label htmlFor="">Accused Name</label>
                                {form.accused_data.map((a, index) => (
                                    <input
                                        key={`name_${index}`}
                                        type="text"
                                        className="form-control mb-3"
                                        name={`accused_name_${index}`}
                                        value={a.litigant_name || ''}
                                        readOnly
                                    />
                                ))}
                            </div>
                            <div className="col-sm-4">
                                <label htmlFor="">Accused Type</label>
                                {form.accused_data.map((a, index) => (
                                    <select
                                        key={`type_${index}`}
                                        name={`accused_type_${index}`}
                                        className="form-control mb-3"
                                        value={a.accused_type || ''}
                                        onChange={(e) =>
                                            handleAccusedTypeChange(index, e.target.value)
                                        }
                                    >
                                        <option value="">Select type</option>
                                        <option value="First time offender">First time offender</option>
                                        <option value="Habitual offender">Habitual offender</option>
                                    </select>
                                ))}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4">Injured discharged</label>
                            <div className="col-sm-8">
                                <div className="icheck-success d-inline mx-2">
                                    <input
                                        type="radio"
                                        id="radioDischarged1"
                                        name="discharged"
                                        onChange={() => setForm({ ...form, discharged: 1 })}
                                        checked={form.discharged === 1}
                                    />
                                    <label htmlFor="radioDischarged1">Yes</label>
                                </div>
                                <div className="icheck-danger d-inline mx-2">
                                    <input
                                        type="radio"
                                        id="radioDischarged2"
                                        name="discharged"
                                        onChange={() => setForm({ ...form, discharged: 2 })}
                                        checked={form.discharged === 2}
                                    />
                                    <label htmlFor="radioDischarged2">No</label>
                                </div>
                                <div className="icheck-primary d-inline mx-2">
                                    <input
                                        type="radio"
                                        id="radioDischarged3"
                                        name="discharged"
                                        onChange={() => setForm({ ...form, discharged: 3 })}
                                        checked={form.discharged === 3}
                                    />
                                    <label htmlFor="radioDischarged3">Not Applicable</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Remarks</label>
                            <div className="col-sm-8">
                                <textarea
                                    name="remarks"
                                    rows="3"
                                    className="form-control"
                                    value={form.remarks || ''}
                                    onChange={(e) =>
                                        setForm({ ...form, remarks: e.target.value })
                                    }
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        {/* <Document /> */}
                        <div className="pb-2">
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default PPRemarks
