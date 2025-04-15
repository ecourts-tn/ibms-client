import React, {useState, useEffect, useContext} from 'react'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { BaseContext } from 'contexts/BaseContext'
import { useLocalizedNames } from 'hooks/useLocalizedNames'


const PreviousCaseForm = () => {

    const initialState = {
        prev_case_number: null,
        prev_case_year: null,
        prev_case_status: '',
        prev_disposal_date: null,
        prev_proceedings: '',
        prev_is_correct: 2,
        prev_remarks: '',
        prev_is_pending: 2,
        prev_disposal_date: ''
    }
    const {efileNumber} = useContext(BaseContext)
    
    const currentYear = new Date().getFullYear(); // Get the current year

    // Generate an array of years from 1900 to the current year
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => 1900 + index);
  
    // State for the input field and validation
    const [yearInput, setYearInput] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const[petition, setPetition] = useState(initialState)

    const[history, setHistory] = useState([])
    const {t} = useTranslation()

    const { 
        getStateName, 
        getDistrictName,
        getEstablishmentName,
        getCourttName,
        getSeatName,
        getFilingNumber,
        getRegistrationNumber 
    } = useLocalizedNames()

    useEffect(() => {
        async function fetchPreviousHistory(){
            try{
                const response = await api.post('case/crime/history/',{efile_no: efileNumber})
                if(response.status === 200){
                    setHistory(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        if(efileNumber){
            fetchPreviousHistory();
        }
    },[efileNumber])

    useEffect(() => {
        const datePicker = flatpickr(".date-picker", {
            dateFormat: "m/d/Y", // Date format after selection (mm/dd/yyyy)
            onChange: (selectedDates) => {
                // Format the selected date to mm/dd/yyyy before updating the state
                const formattedDate = selectedDates[0] ? formatDate(selectedDates[0]) : '';
                setPetition({
                    ...petition,
                    prev_disposal_date: formattedDate // Set the formatted date
                });
            }
        });

        return () => {
            if (datePicker && typeof datePicker.destroy === "function") {
                datePicker.destroy();
            }
        };
    })

    const formatDate = (date) => {
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Get month and format to 2 digits
        const day = ("0" + date.getDate()).slice(-2); // Get day and format to 2 digits
        const year = date.getFullYear(); // Get the full year
        return `${day}/${month}/${year}`; // Return in mm/dd/yyyy format
    };

    const handleYearChange = (e) => {
        const input = e.target.value;
    
        // Allow only numeric characters (0-9) and restrict length to 4 digits
        const filteredInput = input.replace(/[^0-9]/g, '').slice(0, 4);
    
        // Update the input field with the filtered value (only numbers, length capped at 4)
        setYearInput(filteredInput);
    
        // Validate if the input is a valid year (4-digit number within the range)
        if (filteredInput.length === 4 && !isNaN(filteredInput) && filteredInput >= 1900 && filteredInput <= currentYear) {
            setIsValid(true);
            setShowDropdown(false); // Hide dropdown when valid year is entered
          } else {
            setIsValid(false);
            setShowDropdown(filteredInput.length >= 1); // Show dropdown if at least 1 digit is typed
          }
      };
    
      // Handle dropdown selection
      const handleDropdownSelect = (e) => {
        const selectedYear = e.target.value;
        setYearInput(selectedYear); // Set the selected year in the input field
        setIsValid(true);
        setShowDropdown(false); // Hide the dropdown after selection
      };

    const filteredYears = years.filter(year => year.toString().startsWith(yearInput));

    const handleSubmit = async (e) => {
        try{
            petition.efile_no = efileNumber
            const response = await api.put(`case/filing/update/`, petition)
            if(response.status === 200){
                toast.success("Previous case details updated successfully", {
                    theme:"colored"
                })
            }
            setPetition(initialState)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                { history.map((h, index) => (
                    <table className="table table-bordered table-sm">
                        <tbody>
                            <tr className="bg-info">
                                <td colSpan={4} className="text-white"><strong>{index+1}. {h.petition.efile_number}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={4}><strong className='text-danger'>FIR Details</strong></td>
                            </tr>
                            <tr>
                                <td><strong>{t('crime_number')}</strong></td>
                                <td>{`${h.petition.fir_number}/${h.petition.fir_year}`}</td>
                                <td> <strong>{t('police_station')}</strong></td>
                                <td>{h.petition.police_station?.station_name}, { getDistrictName(h.petition.district)}</td>
                            </tr>
                            <tr>
                                <td colSpan={4}><strong className='text-danger'>Filing Details</strong></td>
                            </tr>
                            <tr>
                                <td><strong>{t('efile_number')}</strong></td>
                                <td>{h.petition.efile_number}</td>
                                <td><strong>{t('efile_date')}</strong></td> 
                                <td>{h.petition.efile_date}</td>
                            </tr>
                            <tr>
                                <td><strong>{t('filing_number')}</strong></td>
                                <td>{ getFilingNumber(h.petition.filing_number,h.petition.filing_year)}</td>
                                <td><strong>{t('registration_number')}</strong></td>
                                <td>{ getRegistrationNumber(h.petition.reg_type, h.petition.reg_number, h.petition.reg_year)}</td>
                            </tr>
                            <tr>
                                <td><strong>{t('jurisdiction_court')}</strong></td>
                                { h.petition.judiciary?.id === 1 ? (
                                    <td colSpan={3}>{ getSeatName(h.petition.seat)}</td>
                                ) : (
                                    <td colSpan={3}>{ getCourttName(h.petition.court)}, { getEstablishmentName(h.petition.establishment)}, {getDistrictName(h.petition.district)}, {getStateName(h.petition.state)}</td>
                                )}
                            </tr>
                            <tr>
                                <td colSpan={4}><strong className="text-danger">Business/Order&nbsp;Details</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Status</strong></td>
                                <td>Pending</td>
                                <td><strong>Business&nbsp;/&nbsp;Order&nbsp;Date</strong></td>    
                                <td>-</td>
                            </tr>        
                            <tr>
                                <td><strong>Proceeding</strong></td>
                                <td colSpan={3}>---</td>
                            </tr>
                        </tbody>
                    </table>
                ))}
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">{t('case_number')}</label>
                        <input 
                            type="text" 
                            name="prev_case_number" 
                            className="form-control"
                            value={petition.prev_case_number}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                {/* <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="">{t('case_year')}</label>
                        <input 
                            type="text" 
                            name="prev_case_year" 
                            className="form-control"
                            value={petition.prev_case_year}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div> */}
                <div className="col-md-2">
                <div className="form-group">
                    <label htmlFor="prev_case_year">Case Year</label>

                    {/* Input field */}
                    <input
                    type="text"
                    name="prev_case_year"
                    className={`form-control ${yearInput.length === 4 && !isValid ? 'is-invalid' : ''}`}
                    value={yearInput}
                    onChange={handleYearChange}
                    />

                    {/* Show dropdown if input is invalid */}
                    {!isValid && showDropdown && filteredYears.length > 0 && (
                    <select
                        className="form-control"
                        value={yearInput}
                        onChange={handleDropdownSelect}
                        size="5" // Show more options
                    >
                        <option value="">Select Year</option>
                        {filteredYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                        ))}
                    </select>
                    )}

                    {/* Error message */}
                    {!isValid && yearInput.length === 4 && <div className="invalid-feedback">Please enter a valid year</div>}
                </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">{t('status')}</label>
                        <input 
                            type="text" 
                            name="prev_case_status" 
                            className="form-control"
                            value={petition.prev_case_status}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="">{t('disp_next_date')}</label>
                        <input 
                            type="text" 
                            name="prev_disposal_date" 
                            className="form-control date-picker"
                            value={petition.prev_disposal_date}
                            placeholder="dd/mm/yyyy"
                            readOnly
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="">{t('proceedings')}</label>
                        <textarea 
                            name="prev_proceedings" 
                            className="form-control" 
                            rows="3"
                            value={petition.prev_proceedings}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></textarea>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="remarks">{t('remarks')}</label>
                        <textarea 
                            name="prev_remarks" 
                            className="form-control" 
                            rows="3"
                            value={petition.prev_remarks}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></textarea>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <div className="form-group">
                        <label>{t('accept_case_detail')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_correct" 
                            id="details_correct_yes" 
                            value="yes" 
                            className="ml-3"
                            checked={petition.prev_is_correct === 1}
                            onChange={(e) => setPetition({ ...petition, prev_is_correct: 1 })}
                        />
                        <label htmlFor="details_correct_yes" className="ml-1">{t('yes')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_correct" 
                            id="details_correct_no" 
                            value="no" 
                            className="ml-3"
                            checked={petition.prev_is_correct === 2}
                            onChange={(e) => setPetition({ ...petition, prev_is_correct: 2 })} 
                        />
                        <label htmlFor="details_correct_no" className="ml-1">{t('no')}</label>
                    </div>
                </div>
               
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="previous_bail_application">{t('previous_pending')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_pending" 
                            id="previous_bail_yes" 
                            value="yes" 
                            className="ml-3"
                            checked={petition.prev_is_pending === 1}
                            onChange={(e) => setPetition({ ...petition, prev_is_pending:1})} 
                        />
                        <label htmlFor="previous_bail_yes" className="ml-1">{t('yes')}</label>
                        <input 
                            type="radio" 
                            name="prev_is_pending" 
                            id="previous_bail_no" 
                            value="no" 
                            className="ml-3" 
                            checked={petition.prev_is_pending  === 2 }
                            onChange={(e) => setPetition({...petition, prev_is_pending:2})} 
                        />
                        <label htmlFor="previous_bail_no" className="ml-1">{t('no')}</label>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                        >{t('submit')}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviousCaseForm

