import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import './footer.css'
import { useTranslation } from 'react-i18next';


const Footer = () => {

    const {t} = useTranslation()
    return (
        <>
            <Container fluid className="sub-footer">
                <Container className="">
                    <Row>
                    <Col>
                        <h6>{t('important_links')}</h6>
                        <ul className="important-links">
                        <li><a href="#">{t('supreme_court')}</a></li>
                        <li><a href="#">{t('mhc')}</a></li>
                        <li><a href="#">{t('efiling_portal')}</a></li>
                        <li><a href="#">{t('hc_services')}</a></li>
                        <li><a href="#">{t('dc_services')}</a></li>
                        </ul>
                    </Col>
                    <Col>
                        <h6>{t('quick_links')}</h6>
                        <ul className="quick-links">
                        <li><a href="#">{t('about')}</a></li>
                        <li><a href="#">{t('features')}</a></li>
                        <li><a href="#">{t('user_guide')}</a></li>
                        <li><a href="#">{t('faq')}</a></li>
                        </ul>
                    </Col>
                    <Col>
                        <h6>CONNECT US</h6>
                        <p>The Registrar (IT cum Statistics)<br/>
                            Madras High Court <br />Chennai - 600104.</p>
                        <p>E-Mail : cpctn[at]aij[dot]gov[dot]in</p>
                    </Col>
                    </Row>
                </Container>
            </Container>
            <Container fluid className='footer'>
                <Row>
                <Col>
                    <div className="d-flex justify-content-center">
                    <p className="pt-3"><strong> @ 2024 <a href="https://hcmadras.tn.gov.in" style={{ textDecoration: 'none', color:'orange'}}>{t('mhc')}</a>. {t('rights_reserved')}</strong></p>
                    </div>
                </Col>
                </Row>
            </Container>
        </>
  )
}

export default Footer
