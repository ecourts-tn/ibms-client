import api from 'api';
import * as Yup from 'yup'
import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from '@mui/material/Button'
import Payment from 'components/payment/Payment';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import InitialInput from '../InitialInput';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { toast, ToastContainer } from 'react-toastify';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { SeatContext } from 'contexts/SeatContext';
import PetitionSearch from 'components/common/PetitionSearch';


const Extension = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {benchtypes} = useContext(SeatContext)
    const[bail, setBail] = useState({})
    const[eFileNumber, seteFileNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
    const[searchForm, setSearchForm] = useState({
        court_type:1,
        bench_type:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const[petition, setPetition] = useState({})
    const searchSchema = Yup.object({
        case_type: Yup.string().required("Please select the case type"),
        case_number: Yup.number().required("Please enter case number"),
        case_year: Yup.number().required("Please enter the case year")
    })

    const[searchErrors, setSearchErrors] = useState({})

    const isPetitionerSelected = (petitioners) => {
        return selectedPetitioner.includes(petitioners.litigant_id);
      };
    const isRespondentSelected = (respondent) => selectedRespondent.includes(respondent.litigant_id);

      const handlePetitionerCheckBoxChange = (petitioner) => {
        const isSelected = isPetitionerSelected(petitioner);
        if (isSelected) {
          // Remove from selected petitioners if unchecked
          setSelectedPetitioner(selectedPetitioner.filter(id => id !== petitioner.litigant_id));
        } else {
          // Add to selected petitioners if checked
          setSelectedPetitioner([...selectedPetitioner, petitioner.litigant_id]);
        }
      };

      const handleRespondentCheckBoxChange = (respondent) => {
        const isSelected = isRespondentSelected(respondent);
        if (isSelected) {
            // Remove from selected if already selected
            setSelectedRespondent(selectedRespondent.filter(r => r !== respondent.litigant_id));
        } else {
            // Add to selected if not already selected
            setSelectedRespondent([...selectedRespondent,respondent.litigant_id]);
        }
    };


    // const handlePetitionerCheckBoxChange = (petitioner) => {
    //     if (selectedPetitioner.includes(petitioner)) {
    //       // If already selected, remove the petitioner from the selected list
    //       setSelectedPetitioner(selectedPetitioner.filter(selected => selected.litigant_id !== petitioner.litigant_id));
    //     } else {
    //       // Otherwise, add the petitioner to the selected list
    //       setSelectedPetitioner([...selectedPetitioner, {
    //         litigant_name :petitioner.litigant_name,
    //         litigant_type :1, 
    //         rank: petitioner.rank,
    //         gender: petitioner.gender,
    //         act: petitioner.act,
    //         section: petitioner.section,
    //         relation: petitioner.relation,
    //         relation_name: petitioner.relation_name,
    //         age: petitioner.age,
    //         address: petitioner.address,
    //         mobile_number: petitioner.mobile_number,
    //         email_address: petitioner.email_address,
    //         nationality: petitioner.nationality,
    //       }]);
    //     }
    // };

    // const handleRespondentCheckBoxChange = (respondent) => {
    //     if (selectedRespondent.includes(respondent)) {
    //       // If already selected, remove the respondent from the selected list
    //       setSelectedRespondent(selectedRespondent.filter(selected => selected.litigant_id !== respondent.litigant_id));
    //     } else {
    //       // Otherwise, add the respondent to the selected list
    //       setSelectedRespondent([...selectedRespondent, {
    //         litigant_name: respondent.litigant_name,
    //         litigant_type: 2, 
    //         designation: respondent.designation,
    //         state: respondent.state.state_code,
    //         district: respondent.district.district_code,
    //         police_station: respondent.police_station.cctns_code,
    //         address: respondent.address,
    //       }]);
    //     }
    // };

    // const isPetitionerSelected = (petitioner) => selectedPetitioner.some(selected => selected.litigant_name === petitioner.litigant_name);
    // const isRespondentSelected = (respondent) => selectedRespondent.some(selected => selected.litigant_name === respondent.litigant_name);
    
    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/submitted/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])


    useEffect(() => {
        const fetchDetails = async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:eFileNumber}})
                if(response.status === 200){
                    const {petition:pet, litigants} = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetitioners(litigants.filter(l=>l.litigant_type===1))
                    setRespondents(litigants.filter(l=>l.litigant_type===2))
                    // setAdvocates(advocates)
                    setPetition({...petition,
                        court_type: pet.court_type.id,
                        bench_type: pet.bench_type ? pet.bench_type.bench_code : null,
                        state: pet.state ? pet.state.state_code : null,
                        district:pet.district ? pet.district.district_code : null,
                        establishment: pet.establishment ? pet.establishment.establishment_code : null,
                        court: pet.court ? pet.court.court_code : null,
                        case_type: 3,
                        bail_type: pet.bail_type ? pet.bail_type.type_code: null,
                        complaint_type: pet.complaint_type.id,
                        crime_registered: pet.crime_registered,
                    })
                }
            }catch(error){
                console.log(error)
            }
        }
        if(eFileNumber !== ''){
            fetchDetails()
        }else{
            resetPage()
        }
    },[eFileNumber])


    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("case/bail/approved/single/", { params: searchForm})
            console.log(response.data)
            if(response.status === 200){
                setIsPetition(true)
                setPetition(response.data.petition)
                setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                setAdvocates(response.data.advocate)
            }

        }catch(error){
            if(error.response){
                if(error.response.status === 404){
                    resetPage()
                    toast.error(error.response.data.message, {
                        theme:"colored"
                    })
                }
            }
            const newError = {}
            if(error.inner){
                error.inner.forEach((err) => {
                    newError[err.path] = err.message
                });
                setSearchErrors(newError)
            }
            if(error){
                toast.error(error.response.message,{
                    theme:"colored"
                })
            }
        }
    }

    // const handleInitialSubmit = async() => {
    //     const post_data = {
    //         petition: petition,
    //         petitioner:selectedPetitioner,
    //         respondent: selectedRespondent,
    //     }
    //     if (Object.keys(selectedPetitioner).length === 0){
    //         alert("Please select atleast one petitioner")
    //         return
    //     }
    //     const response = await api.post("case/filing/relaxation/", post_data)
    //     if(response.status === 201){
    //         resetPage()
    //         setSelectedPetitioner([])
    //         setSelectedRespondent([])
    //         sessionStorage.setItem("efile_no", response.data.efile_number)
    //         toast.success(`${response.data.efile_number} details submitted successfully`,{
    //             theme: "colored"
    //         })
    //     }
    // }

    const handleInitialSubmit = async () => {
        // Ensure that at least one petitioner is selected
        if (selectedPetitioner.length === 0) {
            alert("Please select at least one petitioner");
            return;
        }
        
        // Prepare the data to be sent to the backend
        const post_data = {
            petition: petition, // Petition data (you already set this state)
            // petitioner: selectedPetitioner, // Only the selected petitioners
            // respondent: selectedRespondent, // Only the selected respondents
            litigants: selectedPetitioner.concat(selectedRespondent)
        };

        try {
            // Make the API request to submit the data
            const response = await api.post("case/filing/allied/create/", post_data);

            if (response.status === 201) {
                // Reset the form and selected data on successful submission
                resetPage();
                setSelectedPetitioner([]);
                setSelectedRespondent([]);
                
                // Store efile number in sessionStorage
                sessionStorage.setItem("efile_no", response.data.efile_number);
                
                // Show success message
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme: "colored",
                });
            }
        } catch (error) {
            // Handle any errors during submission
            toast.error("Error submitting the data. Please try again.", {
                theme: "colored",
            });
            console.error(error);
        }
    };

    // const resetPage = () => {
    //     setSearchForm({...searchForm, reg_number: '', reg_year: ''})
    //     seteFileNumber('')
    //     setIsPetition(false)
    //     setPetition({})
    //     setPetitioners([])
    //     setRespondents([])
    //     setAdvocates([])
    // }

    const resetPage = () => {
        setSelectedPetitioner([]);
        setSelectedRespondent([]);
        setPetition({});
    };

    useEffect(() => {
        resetPage()
    },[searchForm.court_type, searchPetition])

    useEffect(()=> {
        sessionStorage.removeItem("efile_no")
    },[])

    return(
        <>
            <ToastContainer />
            <div className="container-fluid mt-3">
                <PetitionSearch 
                    cases={cases}
                    eFileNumber={eFileNumber}
                    seteFileNumber={seteFileNumber}
                />
                <div className="row">
                    <div className="col-md-12">
                        { isPetition && (
                            <>
                                <InitialInput petition={bail} />
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={7}><strong>Petitioner Details</strong></td>
                                        </tr>
                                        <tr>
                                            <th>Select</th>
                                            <th>Petitioner Name</th>
                                            <th>Father/Husband/Guardian Name</th>
                                            <th>Age</th>
                                            <th>Rank</th>
                                            <th>Act</th>
                                            <th>Section</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { petitioners.map((petitioner, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="icheck-success">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`checkboxSuccess${petitioner.litigant_id}`} 
                                                        checked={isPetitionerSelected(petitioner)}
                                                        onChange={() => handlePetitionerCheckBoxChange(petitioner)}
                                                    />
                                                    <label htmlFor={`checkboxSuccess${petitioner.litigant_id}`}></label>
                                                </div>                                                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.litigant_name}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.relation_name}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.age}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.rank}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={ petitioner.act}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={petitioner.section}
                                                    readOnly={true}
                                                />
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr className='bg-navy'>
                                            <td colSpan={4}><strong>Condition Details</strong></td>
                                        </tr>
                                        <tr>
                                            <th>Bail Order Date</th>
                                            <th>Released Date</th>
                                            <th>No. of Days Present</th>
                                            <th>No. of Days Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                            <td><input type="text" className='form-control' readOnly={true} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={6}><strong>Respondent Details</strong></td>
                                        </tr>
                                        <tr>
                                            <th>Select</th>
                                            <th>Respondent Name</th>
                                            <th>Designation</th>
                                            <th>Police Station</th>
                                            <th>District</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { respondents.map((res, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="icheck-success">
                                                        <input 
                                                            type="checkbox" 
                                                            id={`checkboxSuccess${res.litigant_id}`} 
                                                            checked={isRespondentSelected(res)}
                                                            onChange={() => handleRespondentCheckBoxChange(res)}
                                                        />
                                                        <label htmlFor={`checkboxSuccess${res.litigant_id}`}></label>
                                                    </div>                                                                            
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.litigant_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.designation?.designation_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.police_station?.station_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.address}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={res.district.district_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr className="bg-navy">
                                            <td colSpan={6}><strong>Advocate Details</strong>
                                                <div className="float-right">
                                                    <button className="btn btn-success btn-sm"><i className="fa fa-plus mr-2"></i>Add New</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Advocate Name</th>
                                            <th>Enrolment Number</th>
                                            <th>Mobile Number</th>
                                            <th>Email Address</th>
                                            <th width={120}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { advocates.map((advocate, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={advocate.advocate_name}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={advocate.enrolment_number}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={advocate.advocate_mobile}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={advocate.advocate_email}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td>
                                                    { !advocate.is_primary && (
                                                        <>
                                                            <IconButton aria-label="delete" disabled color="primary">
                                                                <EditIcon color='info'/>
                                                            </IconButton>
                                                            <IconButton aria-label="delete">
                                                                <DeleteIcon color='error' />
                                                            </IconButton>
                                                        
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                        { isPetition && (
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleInitialSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Extension;