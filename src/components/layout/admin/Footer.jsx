import React from 'react'

function Footer() {
    return (
        <React.Fragment>
            <footer className="main-footer">
                <strong>Copyright © 2024 <a href="https://hcmadras.tn.gov.in">High Court, Madras</a>.</strong>
                All rights reserved.
                <div className="float-right d-none d-sm-inline-block">
                    <b>Version</b> 1.0
                </div>
            </footer>
            <aside className="control-sidebar control-sidebar-dark">
            </aside>
        </React.Fragment>
    );
}

export default Footer;