import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Footer() {
    return (
        <footer className="main-footer">
            <strong>Copyright © 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong>
            All rights reserved.
            <div className="float-right d-none d-sm-inline-block">
                <b>Version</b> 3.2.0
            </div>
        </footer>
    );
}

export default Footer;