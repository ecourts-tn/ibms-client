import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { getAllUserTypes, getUserTypeStatus, getUserTypes } from '../redux/features/UserTypeSlice';
import api from "../api";
import { useSelector, useDispatch } from 'react-redux';

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [utype, setUtype] = useState('')
       const [loading, setLoading]   = useState(false);

    const userStatus = useSelector(getUserTypeStatus)
    const usertype = useSelector(state=>state.usertypes.usertypes)

    const dispatch = useDispatch()

    // const navigate = useNavigate();

    useEffect(() => {
        if( userStatus === 'idle'){
            dispatch(getUserTypes())
        }
    }, [userStatus, dispatch]);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if(utype === ""){
            alert("Please select user type")
            return
        }

        try {
            const method="login"
            const res = await api.post('api/auth/token/', { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                // navigate("/register")
                console.log('loged IN')
            } else {
                // navigate("/login")
                console.log('not loged in')
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2" controlId="usertype">
                    <Form.Label>Select usertype</Form.Label>
                    <select className="form-control" size="sm" value={utype} onChange={(e) =>setUtype(e.target.value)}>
                        <option>Select</option>
                        { usertype.map( (item, index) => (
                            <option key={index} value={item.id}>{item.user_type}</option>)
                        )}
                    </select>
                </Form.Group>
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="username" 
                        placeholder="Bar Code/Email/Mobile/Unique Code" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="remember">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default Login