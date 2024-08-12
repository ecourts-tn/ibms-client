import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import { toast, ToastContainer } from 'react-toastify';
import './header.css'
import Notification from './Notification';
import Post from './Postold';
import Feed from './Feed'
import Login from './Login';
import Sidebar from './Sidebar';

// import "./styles.css";

const imgLink = "";


// const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//       backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     borderColor:'green',
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       marginLeft: theme.spacing(1),
//       width: 'auto',
//     },
//   }));
  
//   const SearchIconWrapper = styled('div')(({ theme }) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     borderColor:'green',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }));
  
//   const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     width: '100%',
//     borderColor:'green',
//     '& .MuiInputBase-input': {
//       padding: theme.spacing(1, 1, 1, 0),
//       // vertical padding + font size from searchIcon
//       paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//       transition: theme.transitions.create('width'),
//       [theme.breakpoints.up('sm')]: {
//         width: '12ch',
//         '&:focus': {
//           width: '20ch',
//         },
//       },
//     },
//   }));

const Home = () => {

    const[isAuth, setIsAuth] = useState(false)
    const[user, setUser] = useState({})

    useEffect(() => {
        if(localStorage.getItem("access") !== null){
        setIsAuth(true)
        }
    },[isAuth])

    useEffect(() => {
        setUser(localStorage.getItem("user"))
    },[])

    return (
        <>
            <Container fluid className="px-5">
                <Row className='py-2'>
                    <Col md={3} className="mt-5 pt-3">
                        <ToastContainer />
                        { !isAuth ? <Login /> : <Login />}  
                    </Col>
                    <Col md={6} className="mt-5">
                        <Feed />
                    </Col>
                    <Col md={3} className="mt-5">
                        <Notification />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
