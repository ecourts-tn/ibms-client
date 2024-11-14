import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext } from 'react'
import Form from 'react-bootstrap/Form'
import { useTranslation } from 'react-i18next'

const InitialInput = ({petition}) => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    return (
        <div className="row mb-4">
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>{t('court_type')}</Form.Label>
                        <Form.Control
                        value={language === 'ta' ? petition.judiciary?.judiciary_lname : petition.judiciary?.judiciary_name}
                        readOnly={true}
                        ></Form.Control>                                                        
                </Form.Group>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <Form.Label>{t('hc_bench')}</Form.Label>
                    <Form.Control
                        value={language === 'ta' ? petition.seat?.seat_lname || '' : petition.seat?.seat_name || ''}
                        readOnly={true}
                    ></Form.Control>
                </div>
            </div>
            { petition.judiciary?.id === 2 && (
            <>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="state">{t('state')}</label>
                        <Form.Control
                            value={ language === 'ta' ? petition.state?.state_lname || '' : petition.state?.state_name || ''}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="district">{t('district')}</label>
                        <Form.Control
                            value={language === 'ta' ? petition.district?.district_lname || '' : petition.district?.district_name || ''}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="establishment">{t('est_name')}</label>
                        <Form.Control
                            value={ language === 'ta' ? petition.establishment?.establishment_lname || '' : petition.establishment?.establishment_name}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="court">{t('court')}</label>
                        <Form.Control
                            value={language === 'ta' ? petition.court?.court_lname || '' : petition.court?.court_name || ''}
                            readOnly={true}
                        ></Form.Control>
                    </div>
                </div>
            </>
            )}
        </div>
    )
}

export default InitialInput