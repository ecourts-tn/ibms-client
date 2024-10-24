import React from 'react'
import Header from './Header'
import MenuBar from './MenuBar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <>
        <Header></Header>
        <MenuBar></MenuBar>
        <Outlet />
        <Footer></Footer>
    </>
  )
}

export default AdminLayout
