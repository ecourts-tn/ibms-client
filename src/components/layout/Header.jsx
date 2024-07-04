import React from 'react'
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
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  <NavDropdown title="Filing" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/petition/new-filing">New Filing</NavDropdown.Item>
                    <NavDropdown.Item href="/petition/draft">Draft Petitions</NavDropdown.Item>
                    <NavDropdown.Item href="surety">Surety</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="/petition/payment">Payment</Nav.Link>
                  <Nav.Link href="#features">Features</Nav.Link>
                  <Nav.Link href="#features">User Guide</Nav.Link>
                  <Nav.Link href="#features">FAQ</Nav.Link>
                  <Nav.Link href="#contact">Contact</Nav.Link>
                  <Nav.Link href="#" className="nav-link-order">Verify Order</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
      </>
    )
}

export default Home