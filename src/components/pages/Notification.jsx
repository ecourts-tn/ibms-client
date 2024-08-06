import React, {useState, useEffect} from 'react'
import { Box, Stack, Skeleton } from "@mui/material";
import { Grid, Paper } from '@mui/material';
import api from '../../api';

const Notification = () => {

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, [3000]);

    const[notifications, setNotifications] = useState([])

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await api.get("api/base/notification")
            if(response.status === 200){
                setNotifications(response.data)
            }
        }
        fetchNotifications()
    },[])

    return (
        <>
            <h5><strong>Notifications</strong></h5>
            {loading ? (
                <Stack spacing={2}>
                    <Skeleton variant="rectangle" height={70} />
                    <Skeleton variant="rectangle" height={70} />
                    <Skeleton variant="rectangle" height={70} />
                    <Skeleton variant="rectangle" height={70} />
                    <Skeleton variant="rectangle" height={70} />
                    <Skeleton variant="rectangle" height={70} />
                    <Skeleton variant="rectangle" height={70} />
                </Stack>
            ) : (
            <div className="comments-container">
                <Paper style={{ padding: "40px 20px" }}>
                    { notifications.map((s, index) => (
                    <Grid container wrap="nowrap" spacing={2} key={index}>
                        <Grid item>
                            <div className="calendar">
                                <div className="month">Jul</div>
                                <div className="date">{ index+3 }</div>
                                <div className="year">2024</div>
                            </div>
                            {/* <Avatar alt="Remy Sharp" src={imgLink} /> */}
                        </Grid>
                        <Grid justifyContent="left" item xs zeroMinWidth>
                            <h6 style={{ margin: 0, textAlign: "left", fontWeight:'bold' }}>Notification {index+1}</h6>
                            <p style={{ textAlign: "left" }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                                luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.<br></br>
                            <span style={{ textAlign: "left", color: "gray" }}>posted 1 minute ago</span>
                            </p>
                        </Grid>
                    </Grid>
                    ))}
                </Paper>
            </div>
            )}
        </>
    )
}

export default Notification