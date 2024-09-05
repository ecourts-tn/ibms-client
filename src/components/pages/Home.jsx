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
                            <p className="text-justify" style={{lineHeight: '1.5rem'}}>The <strong>Integrated Bail Management System (IBMS)</strong> is a comprehensive, end-to-end digital platform developed to facilitate the online filing and management of various bail related legal applications. 
                            This system supports the filing of <strong>Bail Applications</strong>, <strong>Anticipatory Bail Applications</strong>, <strong>Condition Relaxation Requests</strong>, <strong>Intervene Petitions</strong>, <strong>Modification Petitions</strong>, <strong>Discharge of Surety</strong>, <strong>Return of Passport Requests</strong>, <strong>Extension of Time Applications</strong>, and <strong>Cancellation of Bail</strong>. 
                            These applications can be submitted to the Madras High Court or any District Court in Tamil Nadu. The platform is bilingual, supporting both English and the local language, to cater to a wider audience, including advocates, litigants, and court officials.
                            </p><br/>
                            <strong>Key Benefits of IBMS:</strong> 
                            <ol style={{lineHeight: '1.5rem'}}>
                                <li><strong>Efficiency and Convenience</strong>
                                    <ul>
                                        <li><strong>Saves Time and Money: </strong>Reduces the need for physical presence in court, thereby saving time, travel expenses, and other associated costs for advocates, litigants, and government officials.</li>
                                        <li><strong>Online Accessibility</strong> Allows for the submission and tracking of applications from anywhere, making the legal process more accessible and less cumbersome.</li>
                                    </ul>
                                </li>
                                <li><strong>Enhanced Digital Workflow:</strong>
                                    <ul>
                                        <li><strong>Automated Digitization</strong>: Automatically converts case records into digital format, ensuring easy access, retrieval, and management of case-related documents.</li>
                                        <li><strong>Auto Scrutinization</strong>: Automatically checks applications for completeness and compliance with filing requirements, reducing errors and streamlining the review process.</li>
                                        <li><strong>Tracking</strong>: Provides real-time updates on the status of applications, allowing users to track their progress through the legal system, ensuring transparency and timely notifications.</li>
                                    </ul>
                                </li>
                                <li><strong>Environmentally Friendly</strong>
                                    <ul>
                                        <li><strong>Paperless Operations:</strong> By reducing the reliance on paper documents, the system contributes to environmental sustainability and promotes a greener way of handling legal procedures.</li>
                                    </ul>
                                </li>
                                {/* <li><strong>Improved Accessibility and Inclusivity:</strong>
                                    <ul>
                                        <li><strong>Bilingual Support:</strong>The platform's bilingual functionality ensures that it is accessible to a wider audience, including those who are more comfortable using the local language.</li>
                                    </ul>
                                </li>  */}
                            </ol>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
