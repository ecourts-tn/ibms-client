import React from 'react'
import Header from './admin/Header'
import MenuBar from './admin/MenuBar'
import Footer from './admin/Footer'
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
