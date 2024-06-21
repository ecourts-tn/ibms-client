import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './public/Header';
import Footer from './public/Footer';

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
