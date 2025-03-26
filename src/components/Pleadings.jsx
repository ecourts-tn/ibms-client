import api from 'api';
import React, { useState, useEffect, useContext } from 'react';
import InitialInput from 'components/filing/common/InitialInput';
import { toast, ToastContainer } from 'react-toastify';
import PetitionSearch from 'components/utils/PetitionSearch';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import { MasterContext } from 'contexts/MasterContext';
import { BaseContext } from 'contexts/BaseContext';


const Pleadings = () => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {masters:{casetypes}} = useContext(MasterContext)
    const {setEfileNumber} = useContext(BaseContext)
    const[bail, setBail] = useState({})
    const[mainNumber, setMainNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)

    const[petition, setPetition] = useState({
        judiciary: '',
        bench_type: '',
        state: '',
        district:'',
        establishment: '',
        court: '',
        case_type: '',
        bail_type: '',
        complaint_type: '',
        crime_registered: '',
        main_petition: ''
    })

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
        const fetchPetitionDetail = async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:mainNumber}})
                if(response.status === 200){
                    const {petition:main, litigants} = response.data
                    console.log(response.data)
                    setIsPetition(true)
                    setBail(main)
                    setPetitioners(litigants.filter(l=>l.litigant_type===1))
                    setRespondents(litigants.filter(l=>l.litigant_type===2))
                    setPetition((prevPetition) => ({
                        ...prevPetition,
                        judiciary: main.judiciary?.id,
                        bench_type: main.bench_type ? main.bench_type.bench_code : null,
                        state: main.state ? main.state.state_code : null,
                        district: main.district ? main.district.district_code : null,
                        establishment: main.establishment ? main.establishment.establishment_code : null,
                        court: main.court ? main.court.court_code : null,
                        bail_type: main.bail_type ? main.bail_type.type_code : null,
                        complaint_type: main.complaint_type ? main.complaint_type.id : null,
                        crime_registered: main.crime_registered ? main.crime_registered.id : null,
                        main_petition: main.efile_number,
                    }));
                }
            }catch(error){
                console.log(error)
            }
        }
        if(mainNumber){
            setEfileNumber(mainNumber)
            fetchPetitionDetail();
        }
    },[mainNumber])


    return(
        <>
            <ToastContainer />
            { loading && <Loading />}
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
                                            <td>{index+1}</td>
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
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pleadings;