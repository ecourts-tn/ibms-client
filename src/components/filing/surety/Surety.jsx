import api from 'api';
import React, { useState, useEffect, useContext,} from 'react';
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import InitialInput from 'components/filing/common/InitialInput';
import PetitionSearch from 'components/utils/PetitionSearch';
import { LanguageContext } from 'contexts/LanguageContex';
import { BaseContext } from 'contexts/BaseContext';


const Surety = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {eFileNumber} = useContext(BaseContext)
    const[mainNumber, setMainNumber] = useState('')
    const[bail, setBail] = useState({})
    const[cases, setCases] = useState([])
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[petition, setPetition] = useState({
        judiciary: '',
        seat: '',
        state: '',
        district:'',
        establishment: '',
        court: '',
        case_type: 6,
        bail_type: '',
        complaint_type: 2,
        crime_registered: 2,
    })

    const [user, setUser] = useLocalStorage("user", null)

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
                const response = await api.get("case/filing/detail/", {params: {efile_no:mainNumber}})
                if(response.status === 200){
                    const {petition:main, litigants} = response.data
                    setIsPetition(true)
                    setBail(main)
                    setPetitioners(litigants.filter(l=>l.litigant_type===1))
                    setRespondents(litigants.filter(l=>l.litigant_type===2))
                    setPetition({...petition,
                        judiciary: main.judiciary?.id,
                        seat: main.seat ? main.seat?.seat_code : null,
                        state: main.state ? main.state.state_code : null,
                        district:main.district ? main.district.district_code : null,
                        establishment: main.establishment ? main.establishment.establishment_code : null,
                        court: main.court ? main.court.court_code : null,
                        case_type: 6,
                        reg_type: main.reg_type.id,
                        reg_number: main.reg_number,
                        reg_year: main.reg_year,
                        registration_date: main.registration_date
                    })
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchDetails();
    },[mainNumber])

    console.log(petition)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try{
            // await validationSchema.validate(petition, { abortEarly:false})
            const response = await api.post("case/filing/surety/create/", petition)
            if(response.status === 201){
                sessionStorage.setItem("efile_no", response.data.efile_number)
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme:"colored"
                }) 
            }
          }catch(error){
            if(error.response?.status ===500){
                toast.error("Internal Server Error, Please try later!!!", {theme:"colored"})
            }
            if(error?.response){
                toast.error(error.response?.data.message, {theme:"colored"})
            }
        }
    }

    return(
        <>
            <ToastContainer />
            <div className="container-fluid mt-3">
                <PetitionSearch 
                    cases={cases}
                    mainNumber={mainNumber}
                    setMainNumber={setMainNumber}
                />
                <div className="row">
                    <div className="col-md-12">
                        { isPetition && (
                        <React.Fragment>
                            <InitialInput petition={bail} />
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr className="bg-navy">
                                        <td colSpan={7}><strong>{t('petitioner_details')}</strong></td>
                                    </tr>
                                    <tr>
                                        <th className="text-center">#</th>
                                        <th>{t('petitioner_name')}</th>
                                        <th>{t('father_name')}</th>
                                        <th>{t('age')}</th>
                                        <th>{t('accused_rank')}</th>
                                        <th>{t('act')}</th>
                                        <th>{t('section')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { petitioners.map((petitioner, index) => (
                                    <tr key={index}>
                                        <td>{ index+1}</td>
                                        <td>{petitioner.litigant_name}</td>
                                        <td>{petitioner.relation_name}</td>
                                        <td>{petitioner.age}</td>
                                        <td>{petitioner.rank}</td>
                                        <td>{ petitioner.act}</td>
                                        <td>{petitioner.section}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr className="bg-navy">
                                        <td colSpan={6}><strong>{t('respondent_details')}</strong></td>
                                    </tr>
                                    <tr>
                                        <th className='text-center'>#</th>
                                        <th>{t('respondent_name')}</th>
                                        <th>{t('designation')}</th>
                                        <th>{t('police_station')}</th>
                                        <th>{t('address')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { respondents.map((res, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{res.litigant_name}</td>
                                            <td>{ language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }</td>
                                            <td>{ language === 'ta' ? res.police_station?.station_lname : res.police_station?.station_name }</td>
                                            <td>{res.address}, { language === 'ta' ? res.district.district_lname : res.district.district_name }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant='contained'
                                    color="success"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surety;