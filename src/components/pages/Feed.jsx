import { Box, Stack, Skeleton } from "@mui/material";
import React, { useState, useEffect } from "react";
import Post from "./Post";
import api from "../../api";

const Feed = () => {
    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, [3000]);

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
    <Box p={{ xs: 0, md: 2 }}>
      {loading ? (
        <>
          <Stack spacing={1}>
            <Skeleton variant="text" height={100} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={300} />
          </Stack>
          <Stack spacing={1}>
            <Skeleton variant="text" height={100} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={300} />
          </Stack>
        </>
      ) : (
        <>
            { posts.map((post, index) =>(
                <Post key={index} post={post}/>

            ))}
        </>
      )}
    </Box>
  );
};

export default Feed;