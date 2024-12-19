import React, {useContext, useState} from 'react'
import { CreateMarkup } from 'utils'
import Loading from 'components/Loading'
import api from 'api'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const CrimeDetails = ({crime}) => {
    const{t} = useTranslation()

    const[translatedText, setTranslatedText] = useState('')
    const[loading, setLoading] = useState(false)
    const {language} = useContext(LanguageContext)
    async function fetchCSRFToken() {
        const response = await api.get('csrf/');
        const csrfToken = response.headers['x-csrftoken'];
        return csrfToken;
    }

    async function translateText(text) {
        try{
            setLoading(true)
            const csrfToken = await fetchCSRFToken();
            const response = await api.post(
                'translate/',
                { text: text, source_language: 'en', target_language: 'ta' },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );
        
            setTranslatedText(response.data)
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    if(!crime){
        return (
            <div className="alert alert-warning">
                <strong>Crime details not found / not mapped</strong>
            </div>
        )
    }


    return (
        <table className="table table-bordered table-striped">
            <tbody>
                <tr>
                    <td colSpan={4} className="bg-secondary"><strong>{t('fir_details')}</strong></td>
                </tr>
                <tr>
                    <td>{t('date_of_occurence')}</td>
                    <td>{ crime.date_of_occurrence }</td>
                    <td>{t('fir_date_time')}</td>
                    <td>{ crime.fir_date_time }</td>
                </tr>
                <tr>
                    <td>{t('place_of_occurence')}</td>
                    <td colSpan={3}>{ crime.place_of_occurrence }</td>
                </tr>
                <tr>
                    <td>{t('investigation_officer')}</td>
                    <td>{ crime.investigation_officer }</td>
                    <td>{t('investigation_officer_rank')}</td>
                    <td>{ crime.investigation_officer_rank }</td>
                </tr>
                <tr>
                    <td>{t('complaintant_name')}</td>
                    <td>{ crime.complainant_name }</td>
                    <td>{t('complaintant_age')}</td>
                    <td>{ crime.complainant_age }</td>
                </tr>
                <tr>
                    <td>{t('complaintant_guardian')}</td>
                    <td>{ crime.complainant_guardian }</td>
                    <td>{t('complaintant_guardian_name')}</td>
                    <td>{ crime.complainant_guardian_name }</td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <p><strong>{t('gist_of_fir')}</strong></p>
                        <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir)}></span>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <p><strong>{t('gist_in_local')}</strong></p>
                        <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_in_local)}></span>
                        {/* <button className="btn btn-primary btn-sm" onClick={() => translateText(crime.gist_in_local)}>
                            {language === 'ta' ? 'ஆங்கிலத்திற்கு மொழிபெயர்க்க' : 'Translate to English'}
                        </button> */}
                        {loading && <Loading />}
                        { translatedText.translated_text && (
                            <div>
                                <div className="alert alert-danger mt-1">
                                    <em className="text-bold">Disclaimer:</em>
                                    <span className="ml-1">
                                        The translation provided by this application is generated automatically using machine translation services and may not be 100% accurate. 
                                    </span>
                                </div>
                                <p 
                                    className="text-muted" 
                                    style={{fontFamily:'sans-serif!important'}}
                                    dangerouslySetInnerHTML={CreateMarkup(translatedText.translated_text)}
                                ></p>
                            </div>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default CrimeDetails