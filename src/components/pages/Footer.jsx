import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import './footer.css'


const Footer = () => {
  return (
        <>
            <Container fluid className="sub-footer">
                <Container className="">
                    <Row>
                    <Col>
                        <h6>IMPORTANT LINKS</h6>
                        <ul className="important-links">
                        <li><a href="#">Supreme Court of India</a></li>
                        <li><a href="#">High Court Madras</a></li>
                        <li><a href="#">e-Filing Portal</a></li>
                        <li><a href="#">High Court Services</a></li>
                        <li><a href="#">District Court Services</a></li>
                        </ul>
                    </Col>
                    <Col>
                        <h6>QUICK LINKS</h6>
                        <ul className="quick-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">User Guide</a></li>
                        <li><a href="#">FAQ</a></li>
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
                    <p className="pt-3"><strong> @ 2024 <a href="https://hcmadras.tn.gov.in" style={{ textDecoration: 'none', color:'orange'}}>High Court Madras</a>. All rights reserved</strong></p>
                    </div>
                </Col>
                </Row>
            </Container>
        </>
  )
}

export default Footer
