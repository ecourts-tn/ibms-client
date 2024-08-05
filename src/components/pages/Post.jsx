import React, {useState, useEffect} from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentIcon from '@mui/icons-material/Comment';
import api from '../../api';

const Post = () => {
    const[posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await api.get("api/base/post")
            if(response.status === 200){
                setPosts(response.data)
            }
        }
        fetchPosts()
    },[])

    return (
        <>
            <div className="input-group mb-3 p-2">
                <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <div className="input-group-append">
                    <span className="input-group-text bg-primary" id="basic-addon2">Search
                        <i className="fa fa-search ml-1"></i>
                    </span>
                </div>
            </div>
            <div className="feeds-container">
                { posts.map((post, index) => (
                    <Card className="mb-4" key={index}>
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
                            title={post.title}
                            subheader={post.notification_date}
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
                ))}
                {/* <Card className="mb-4">
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
                 */}
            </div>
        </>
    )
}

export default Post