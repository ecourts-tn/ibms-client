import React, {useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";





const Logout = () => {
    const [hasLoggedOut, setHasLoggedOut] = useState(false);
    const navigate = useNavigate();
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasLoggedOut) return; // Prevent re-execution
        setHasLoggedOut(true); // Mark as executed

        const logout = async () => {
            const response = await api.post("api/auth/logout/", {
                refresh: localStorage.getItem(REFRESH_TOKEN),
            });

           
        // if (hasRun.current) return; // Skip if already run
        // hasRun.current = true;
        // const logout = async() => {
            // const response = await api.post('api/auth/logout/', {
            //     refresh: localStorage.getItem(REFRESH_TOKEN)
            // })
            if(response.status === 200){    
                toast.success("You are logged out successfully", {
                    theme:"colored"
                })
                localStorage.clear()
                setTimeout(() => navigate('/'), 2000);
            }
        }
        logout();
    }, [navigate, hasLoggedOut]);

    return (
        <>
            <ToastContainer />
            {/* <div className="container-fluid px-5 my-4" style={{minHeight:'600px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-center" style={{paddingTop:'150px'}}>
                            <p>You are logged out successfully!!!. <Link to="/">Click Here</Link> to login again</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Logout;
