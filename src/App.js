import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet, Navigate } from 'react-router-dom';
/* -------Layout & Providers ----------*/
import PublicLayout from 'components/layout/public/PublicLayout'
import AdminLayout from 'components/layout/admin/AdminLayout';
import { AuthProvider } from "contexts/AuthContext";
import { AppProvider } from 'contexts/AppContext';
import { publicRoutes } from 'routes/publicRoutes';
import { CourtRoutes } from 'routes/courtRoutes';
import { policeRoutes } from 'routes/policeRoutes';
import { prosecutorRoutes } from 'routes/prosecutorRoutes';
import { prisonRoutes } from 'routes/prisonRoutes';
import { FilingRoutes } from 'routes/filingRoutes';
import DepartmentRegistration from 'components/auth/DepartmentRegistration';
import UserList from 'components/auth/UserList';

function App() {

    const handleRightClick = (event) => {
        event.preventDefault();  // Prevent the context menu from appearing
        alert('Right-click is disabled on this page!');
    };

    const RequiredRole = ({ allowed, children }) => {
        debugger
        const userStr = sessionStorage.getItem('user');
        let department = null;

        try {
            department = JSON.parse(userStr)?.department;
        } catch (e) {
            // silently fail
        }

        if (!department) return <Navigate to="/unauthorized" replace />;

        return department === allowed ? children : <Navigate to="/unauthorized" replace />;
    };

    return (
        <BrowserRouter basename="/ibms">
            <AuthProvider>
                <AppProvider>
                    <div>
                        <ToastContainer />
                        <Routes>
                            <Route element={<PublicLayout />}>

                                {publicRoutes.map((route, index) => (
                                    <Route key={index} path={route.path} element={route.element} />
                                ))}
                                {FilingRoutes()}
                            </Route>
                            <Route element={<AdminLayout />}>
                                {CourtRoutes()}
                                <Route path="police" element={<RequiredRole allowed={2}><Outlet /></RequiredRole>}>
                                    {policeRoutes.map((route, index) => (
                                        <Route key={index} path={route.path} element={route.element} />
                                    ))}
                                </Route>
                                <Route path="prison" element={<RequiredRole allowed={3}><Outlet /></RequiredRole>}>
                                    {prisonRoutes.map((route, index) => (
                                        <Route key={index} path={route.path} element={route.element} />
                                    ))}
                                </Route>
                                <Route path="prosecution">
                                    {prosecutorRoutes.map((route, index) => (
                                        <Route key={index} path={route.path} element={route.element} />
                                    ))}
                                </Route>
                                <Route path='/auth/user/registration' element={<DepartmentRegistration />} />
                                <Route path="/auth/users" element={<UserList />} />
                            </Route>
                        </Routes>
                    </div>
                </AppProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}



export default App