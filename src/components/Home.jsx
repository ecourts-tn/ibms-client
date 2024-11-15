import './home.css'
import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Login from 'components/auth/Login';


const Home = () => {

    const[isAuth, setIsAuth] = useState(false)
    const[user, setUser] = useState({})
    const {t} = useTranslation()

    useEffect(() => {
        if(localStorage.getItem("access") !== null){
            setUser(localStorage.getItem("user"))
            setIsAuth(true)
        }
    },[isAuth])

    return (
        <>
            <Container fluid className="px-5" style={{minHeight:'600px'}}>
                <Row className='py-2 mt-5'>
                    <Col md={3} className="">
                        <ToastContainer />
                        { !isAuth ? <Login /> : <Login />}  
                    </Col>
                    {/* <Col md={6} className="mt-5">
                        <Feed />
                    </Col>
                    <Col md={3} className="mt-5">
                        <Notification />
                    </Col> */}
                    <Col md={8}>
                        <div className="ml-md-5">
                            <h2 className="section-heading">{t('title')}</h2>
                            <p className="text-justify">{t('description')}</p>
                            {/* <p className="text-justify" style={{lineHeight: '1.5rem'}}>The <strong>Integrated Bail Management System (IBMS)</strong> is a comprehensive, end-to-end digital platform developed to facilitate the online filing and management of various bail related legal applications. 
                            This system supports the filing of <strong>Bail Applications</strong>, <strong>Anticipatory Bail Applications</strong>, <strong>Condition Relaxation Requests</strong>, <strong>Intervene Petitions</strong>, <strong>Modification Petitions</strong>, <strong>Discharge of Surety</strong>, <strong>Return of Passport Requests</strong>, <strong>Extension of Time Applications</strong>, and <strong>Cancellation of Bail</strong>. 
                            These applications can be submitted to the Madras High Court or any District Court in Tamil Nadu. The platform is bilingual, supporting both English and the local language, to cater to a wider audience, including advocates, litigants, and court officials.
                            </p><br/> */}
                            <strong>{t('benefits')}</strong> 
                            <ol style={{lineHeight: '1.5rem'}}>
                                <li><strong>{t('benefit_1')}</strong>
                                    <ul>
                                        <li><strong>{t('benefit_1_sub_1')}</strong>{t('benefit_1_sub_1_desc')}</li>
                                        <li><strong>{t('benefit_1_sub_2')}</strong>{t('benefit_1_sub_2_desc')}</li>
                                    </ul>
                                </li>
                                <li><strong>{t('benefit_2')}</strong>
                                    <ul>
                                        <li><strong>{t('benefit_2_sub_1')}</strong>{t('benefit_2_sub_1_desc')}</li>
                                        <li><strong>{t('benefit_2_sub_2')}</strong>{t('benefit_2_sub_2_desc')}</li>
                                        <li><strong>{t('benefit_2_sub_3')}</strong>{t('benefit_2_sub_3_desc')}</li>
                                    </ul>
                                </li>
                                <li><strong>{t('benefit_3')}</strong>
                                    <ul>
                                        <li><strong>{t('benefit_3_sub_1')}</strong>{t('benefit_3_sub_1_desc')}</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
