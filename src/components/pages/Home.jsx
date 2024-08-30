import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import { ToastContainer } from 'react-toastify';
import './header.css'
import Login from './Login';
import Sidebar from './Sidebar';

const imgLink = "";


const Home = () => {

    const[isAuth, setIsAuth] = useState(false)
    const[user, setUser] = useState({})

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
                            <h2 className="section-heading">Integrated Bail Management System (IBMS)</h2>
                            <p className="text-justify" style={{lineHeight: '1.5rem'}}>Integrated Bail Management System is a complete end to end solution developed for online filing of various applications such as Bail Applications, Anticipatory Bail Applications, Condition Relaxation, Intervene Petition, Modification Petition, Discharge of Surety, Return of Passport, Extension of Time and Cancellation of Bail. All the applications can be filed before Madras High Court or District Courts of Tamil Nadu. It is designed in Bilingual (English and local language) to reach wider group covering advocates/litigants.<br /><br />
                            <strong>IBMS system provides several benefits;</strong> 
                            </p><ul style={{lineHeight: '1.5rem'}}>
                                <li>Save time, money, travel of advocates, litigants and government officials </li>
                                <li>Obviate the need to physically visit the court</li>
                                {/* <li>Reduce the need of meetings between clients and advocates</li> */}
                                <li>Automatic digitization of case records</li>
                                <li>Positive impact on environment by reducing paper footprint</li> 
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
