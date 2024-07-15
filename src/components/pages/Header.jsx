import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css'


const Home = () => {
  return (
      <>
        <Navbar className="public-navbar" style={{ backgroundColor:'#0c4b33'}}>
            <Container>
              <Navbar.Brand href="#home">Integrated Bail Management System</Navbar.Brand>
              <Nav className="d-flex justify-content-end">
                  <Nav.Link><Link to="/">Home</Link></Nav.Link>
                  <Nav.Link><Link to="/dashboard">Dashboard</Link></Nav.Link>
                  <NavDropdown title="Filing" id="basic-nav-dropdown">
                    <NavDropdown.Item><Link to="/petition/bail">Bail/AB Petition</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/relaxation">Condition Relaxation</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/intervene">Intervene Petition</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/modification">Modification Petition</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/surety">Surety Petition</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/surety-discharge">Discharge of Surity</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/extension-time">Extension of Time</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/petition/return-passport">Return of Passport</Link></NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Case Status" id="basic-nav-dropdown">
                    <NavDropdown.Item><Link to="/status/filing-number">Filing Number</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/status/registration-number">Registration Number</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/status/cnr-number">CNR Number</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/status/fir-number">FIR Number</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="/status/party-name">Party Name</Link></NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#features">Features</Nav.Link>
                  <Nav.Link href="#features">User Guide</Nav.Link>
                  {/* <Nav.Link href="#features">FAQ</Nav.Link> */}
                  <Nav.Link href="#contact">Contact</Nav.Link>
                  <Nav.Link href="#" className="nav-link-order">Verify Order</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
      </>
    )
}

export default Home