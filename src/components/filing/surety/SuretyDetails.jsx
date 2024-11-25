import api from 'api'
import config from 'config'
import React, {useState, useEffect} from 'react'
import {toast, ToastContainer} from 'react-toastify'
import ViewDocument from 'components/common/ViewDocument'
import { useTranslation } from 'react-i18next'

const SuretyDetails = () => {

    const [sureties, setSureties] = useState([])
    const[selectedSurety, setSelectedSurety] = useState([])
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        const fetchSureties = async() => {
            try{
                const response = await api.get("case/surety/list/", {params:{efile_no}})
                if(response.status === 200){
                    setSureties(response.data)
                }
              }catch(error){
                console.error(error)
                if(error.response){
                    toast.error(error.response.message, {
                        theme:"colored"
                    })
                }
            }

        }
        fetchSureties()
    }, [])

    const handleSuretyCheckBoxChange = (surety) => {
        if (selectedSurety.includes(surety)) {
          // If already selected, remove the surety from the selected list
          setSelectedSurety(selectedSurety.filter(selected => selected.litigant_id !== surety.litigant_id));
        } else {
          // Otherwise, add the surety to the selected list
          setSelectedSurety([...selectedSurety, {
            litigant_name :surety.litigant_name,
            litigant_type :1, 
            rank: surety.rank,
            gender: surety.gender,
            act: surety.act,
            section: surety.section,
            relation: surety.relation,
            relation_name: surety.relation_name,
            age: surety.age,
            address: surety.address,
            mobile_number: surety.mobile_number,
            email_address: surety.email_address,
            nationality: surety.nationality,
          }]);
        }
    };
    const isSuretySelected = (surety) => selectedSurety.some(selected => selected.surety_name === surety.surety_name);

    return (
        <div className="container">
            <ToastContainer /> 
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr className="bg-navy">
                            <td colSpan={9}><strong>{t('surety_details')}</strong></td>
                        </tr>
                        <tr>
                            <th>{t('select')}</th>
                            <th>{t('surety_name')}</th>
                            <th>{t('father_husband_guardian')}</th>
                            <th>{t('aadhar_number')}</th>
                            <th>{t('mobile_number')}</th>
                            <th>{t('photo')}</th>
                            <th>{t('signature')}</th>
                            <th>{t('aadhar_card')}</th>
                            <th>{t('identity_proof')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        { sureties.map((s, index) => (
                        <tr key={index}>
                            <td>
                                <div className="icheck-success">
                                    <input 
                                        type="checkbox" 
                                        id={`checkboxSuccess${s.surety_id}`} 
                                        checked={isSuretySelected(s)}
                                        onChange={() => handleSuretyCheckBoxChange(s)}
                                    />
                                    <label htmlFor={`checkboxSuccess${s.surety_id}`}></label>
                                </div>                                                                            
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={s.surety_name}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={s.relative_name}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={s.aadhar_number}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={s.mobile_number}
                                    readOnly={true}
                                />
                            </td>
                            <td>
                                <span className="badge badge-info badge-pill" onClick={handleShow}>View</span>
                                <ViewDocument 
                                    title="Photo"
                                    url={`${config.docUrl}${s.photo}`}
                                    show={show} 
                                    handleClose={handleClose} 
                                />
                            </td>
                            <td>
                                <a href={`${config.docUrl}${s.signature}`}><span className="badge badge-info badge-pill">View</span></a>
                            </td>
                            <td>
                                <a href={`${config.docUrl}${s.aadhar_card}`}><span className="badge badge-info badge-pill">View</span></a>
                            </td>
                            <td>
                                <a href={`${config.docUrl}${s.identity_proof}`}><span className="badge badge-info badge-pill">View</span></a>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
        </div> 
    )
}

export default SuretyDetails