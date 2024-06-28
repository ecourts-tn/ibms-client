import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { loadUser } from '../../redux/features/UserSlice';
import highcourtlogo from '../../highcourtlogo.png'
import './header.css'

import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentIcon from '@mui/icons-material/Comment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import InputBase from '@mui/material/InputBase';
import * as Yup from 'yup'



const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderColor:'green',
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    borderColor:'green',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    borderColor:'green',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

const Login = () => {

 const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    const [loading, setLoading]   = useState(false);
    const[form, setForm] =  useState({
        usertype: '',
        username:'',
        password:''
    })

    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        usertype: Yup.string().required("Please select the usertype"),
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required")
    })

    const dispatch = useDispatch()

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try{
            await validationSchema.validate(form, {abortEarly: false})
            const {username, password, usertype} = form
            const response = await api.post('api/login/public/', { usertype, username, password })
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            dispatch(loadUser(response.data.user))
            toast.success('logged in successfully', {
                theme: "colored"
            })
            navigate("/dashboard")
        }catch(error){
            if(!error.response){
                toast.error("Unable to reach the server. Please try later!",{
                    theme:"colored"
                })
                setLoading(false)
                return
            }
            if(error.response.status === 400 || error.response.status === 401){
                toast.error("Invalid username or password", {
                    theme: "colored"
                });
                setLoading(false)
                return
            }
            setLoading(false)
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }

        // try {
        //     const {username, password, usertype} = form
        //     const response = await api.post('api/login/public/', { usertype, username, password })
        //     localStorage.setItem(ACCESS_TOKEN, response.data.access);
        //     localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        //     dispatch(loadUser(response.data.user))
        //     toast.success('logged in successfully', {
        //         theme: "colored"
        //     })
        //     navigate("/dashboard")
        // } catch (error) {
        //     if(error.response.status === 401){
        //         toast.error("Invalid username or password", {
        //             theme: "colored"
        //         });
        //         setLoading(false)
        //         navigate("/")
        //     }
        //     if(error.response.status === 403){
        //         toast.error( error.response.data.message , {
        //             theme: "colored"
        //         });
        //         setLoading(false)
        //         navigate("/")
        //     }
        //     console.log(error)
        // } 
    }

    return (
        <>
            <Container fluid className="px-5">
                <Row className='py-2'>
                    <Col md={3} className="mt-5 pt-3">
                        <ToastContainer />
                        <div className="text-center mb-4">
                            <img className="mb-2" src={highcourtlogo} alt width={70} height={70} />
                            <h1 className="h4 mb-3 font-weight-bold">Sign In</h1>
                        </div>    
                        <form className="form-signin" onSubmit={handleSubmit} style={{boxShadow:'none'}}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                className="d-flex justify-content-center"
                                value={form.usertype}
                                onChange={(e) => setForm({...form, usertype: e.target.value})}
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Advocate" />
                                <FormControlLabel value={2} control={<Radio />} label="Litigant" />
                            </RadioGroup>
                            <div className="form-group mb-3">
                                <FormControl fullWidth className="mb-3">
                                    <TextField
                                        error={ errors.username ? true : false }
                                        helperText={ errors.username }
                                        label="Mobile/Email/Bar Code"
                                        size="small"
                                        name="username"
                                        value={ form.username }
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    />
                                </FormControl>
                                <FormControl fullWidth className="mb-3">
                                    <TextField
                                        error={ errors.password ? true : false }
                                        helperText={errors.password}
                                        label="Password"
                                        size="small"
                                        type="password"
                                        name="password"
                                        value={ form.password }
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    />
                                </FormControl>
                                <div className="form-group mb-1">
                                    <input type="checkbox" defaultValue="remember-me" style={{ width:20}} /> Remember me
                                </div>
                                <FormControl fullWidth>
                                    <Button 
                                        variant="contained" 
                                        endIcon={<SendIcon />}
                                        onClick={handleSubmit}
                                    >Sign In</Button>
                                </FormControl>
                                {/* <input  
                                    type="text" 
                                    id="username" 
                                    className="form-control" 
                                    name="username"
                                    placeholder="Mobile/Email/Bar Code"  
                                    value={form.username}
                                    onChange={(e) => setForm({...form, username: e.target.value})}
                                /> */}
                            </div>
                            {/* <div className="form-group mb-3">
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password"
                                    className="form-control" 
                                    placeholder="Password"  
                                    value={form.password}
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                />              
                            </div> */}

                            { loading && (
                                <div className="d-flex justify-content-center pt-1 pb-3">
                                    <Spinner animation="border" variant="primary" style={{ height:50, width:50}}/>
                                </div>
                            )}
                            {/* <button className="btn btn-block btn-signin">Sign in</button> */}
                            <div className="mt-1">
                                <p><a href="#">Forgot&nbsp;password?</a></p>
                                <p className="d-flex justify-content-end">Don't have an account?&nbsp;<Link to="user/registration"> Register</Link></p>
                            </div>
                        </form>
                    </Col>
                    <Col md={6} className="mt-5">
                    <div className="input-group mb-3 p-2">
                        <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <span className="input-group-text bg-primary" id="basic-addon2">Search
                                <i className="fa fa-search ml-1"></i>
                            </span>
                        </div>
                    </div>


                        <div className="feeds-container">
                            <Card className="mb-4">
                                <CardHeader style={{ fontWeight:'bold'}}
                                    avatar={
                                    <Avatar sx={{ bgcolor: '#138D75' }} aria-label="recipe">
                                        A
                                    </Avatar>
                                    }
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                    }
                                    title="About Integrated Bail Management System"
                                    subheader="September 14, 2016"
                                />
                                <CardContent>
                                    <p color="text.dark" style={{ textAlign:'justify'}}>
                                        Integrated Bail Management System is a complete end to end solution developed for online filing of various applications such as Bail Applications, Anticipatory Bail Applications, Condition Relaxation, Intervene Petition, Modification Petition, Discharge of Surety, Return of Passport, Extension of Time and Cancellation of Bail. All the applications can be filed before Madras High Court or District Courts of Tamil Nadu. It is designed in Bilingual (English and local language) to reach wider group covering advocates/litigants.
                                    </p>
                                </CardContent>
                                <CardActions className="d-flex justify-content-between">
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="comment">
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card className="mb-4">
                                <CardHeader style={{ fontWeight:'bold'}}
                                    avatar={
                                    <Avatar sx={{ bgcolor: '#138D75' }} aria-label="recipe">
                                        A
                                    </Avatar>
                                    }
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                    }
                                    title="Benefits of IBMS"
                                    subheader="September 14, 2016"
                                />
                                <CardContent>
                                    <p color="text.dark" style={{ textAlign:'justify'}}>
                                        <ul style={{lineHeight: '1.5rem'}}>
                                            <li>Save time, money, travel of advocates, litigants and government officials </li>
                                            <li>Obviate the need to physically visit the court</li>
                                            {/* <li>Reduce the need of meetings between clients and advocates</li> */}
                                            <li>Automatic digitization of case records</li>
                                            <li>Positive impact on environment by reducing paper footprint</li> 
                                        </ul>
                                    </p>
                                </CardContent>
                                <CardActions className="d-flex justify-content-between">
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="comment">
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card>
                                <CardHeader style={{ fontWeight:'bold'}}
                                    avatar={
                                    <Avatar sx={{ bgcolor: '#138D75' }} aria-label="recipe">
                                        A
                                    </Avatar>
                                    }
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                    }
                                    title="About Integrated Bail Management System"
                                    subheader="September 14, 2016"
                                />
                                <CardContent>
                                    <p color="text.dark" style={{ textAlign:'justify'}}>
                                        Integrated Bail Management System is a complete end to end solution developed for online filing of various applications such as Bail Applications, Anticipatory Bail Applications, Condition Relaxation, Intervene Petition, Modification Petition, Discharge of Surety, Return of Passport, Extension of Time and Cancellation of Bail. All the applications can be filed before Madras High Court or District Courts of Tamil Nadu. It is designed in Bilingual (English and local language) to reach wider group covering advocates/litigants.
                                    </p>
                                </CardContent>
                                <CardActions className="d-flex justify-content-between">
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="comment">
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </div>
                    </Col>
                    <Col md={3} className="mt-5">
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Brunch this weekend?"
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Ali Connors
                                        </Typography>
                                        {" — I'll be in your neighborhood doing errands this…"}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                primary="Summer BBQ"
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        to Scott, Alex, Jennifer
                                    </Typography>
                                    {" — Wish I could come, but I'm out of town this…"}
                                    </React.Fragment>
                                }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                primary="Oui Oui"
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Sandra Adams
                                    </Typography>
                                    {' — Do you have Paris recommendations? Have you ever…'}
                                    </React.Fragment>
                                }
                                />
                            </ListItem>
                        </List>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Login
