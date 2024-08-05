import { Favorite, FavoriteBorder, MoreVert, Share } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";

const Post = ({post}) => {


    return (
        <Card sx={{ margin: 5 }}>
            <CardHeader
                avatar={
                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                    R
                </Avatar>
                }
                action={
                <IconButton aria-label="settings">
                    <MoreVert />
                </IconButton>
                }
                title={post.title}
                subheader={ post.notification_date }
            />
            { post.attachment && (
                <CardMedia
                    component="img"
                    height="20%"
                    image={`http://localhost:8000${post.attachment}`}
                    alt="Paella dish"
                />
            )}
        <CardContent>
            <p>{post.description}</p>
        </CardContent>
        <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
            <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite sx={{ color: "red" }} />}
            />
            </IconButton>
            <IconButton aria-label="share">
            <Share />
            </IconButton>
        </CardActions>
        </Card>
    );
};

export default Post;