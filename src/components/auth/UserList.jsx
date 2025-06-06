import React, { useState, useEffect, useContext } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import api from 'api';
import Loading from 'components/utils/Loading';

import { AuthContext } from 'contexts/AuthContext';

const UserList = () => {    
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async() => {
            try{
                setLoading(true)
                const response = await api.get('auth/users/', {
                    params:{
                        department:user.department
                    }
                })
                if(response.status === 200){
                    setUsers(response.data)
                }
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    return (
        <div className="card card-outline card-primary">
            <ToastContainer />
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>Users</strong></h3>
            </div>
            <div className="card-body">
                <table className="table table-bordered table-striped table-sm">
                    <thead className='bg-info'>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Mobile Number</th>
                            <th>Email Address</th>
                            <th>Court</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map((user, index) => (
                        <tr>
                            <td>{index+1}</td>
                            <td>{user.username}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td>{user.court?.court_name}<br/>{user.establishment?.establishment_name}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserList