import { Box } from "@mui/material";
import { BlogType } from "../../types/types"
import { blogStyles } from "../../styles/bloglist-styles";
import BlogItem from "./BlogItem";

type Props = {
    blogs: BlogType[];
}

const BlogList = (props: Props) => {
    console.log(props.blogs);
  return (
    <Box sx={blogStyles.container}>
        {props.blogs.length > 0 && props.blogs.map((blog: BlogType, index) => (
            <div key={index}><BlogItem blog={blog} /></div>
        ))}
    </Box>
  )
}

export default BlogList