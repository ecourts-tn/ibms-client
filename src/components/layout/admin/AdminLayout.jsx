import React from 'react'
import Header from './Header'
import MenuBar from './MenuBar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='wrapper'>
        <Header></Header>
        <MenuBar></MenuBar>
          <div className="content-wrapper">
            <div className="pb-3"></div>
            <section className="content">
              <Outlet />
            </section>
            <div className="pt-1"></div>
          </div>
        <Footer></Footer>
        <aside className="control-sidebar control-sidebar-dark">
        </aside>
    </div>
  )
}

export default AdminLayout
