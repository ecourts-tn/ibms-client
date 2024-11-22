import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Stepper from 'components/filing/bail/BailStepper';

const PublicLayout = () => {
  return (
    <>
        <Header></Header>
          <Outlet />
        <Footer></Footer>
    </>
  )
}

export default PublicLayout
