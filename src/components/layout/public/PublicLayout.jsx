import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <React.Fragment>
        <Header></Header>
          <Outlet />
        <Footer></Footer>
    </React.Fragment>
  )
}

export default PublicLayout
