import { Box, Card, Typography } from "@mui/material";
import { BlogType } from "../../types/types";
import { blogStyles, randomBgColor } from "../../styles/bloglist-styles";
import { FcCalendar } from "react-icons/fc";

type Props = {
  blog: BlogType;
};

function BlogItem(props: Props) {
  return (
    <Card sx={blogStyles.card}>
      <Box sx={{ ...blogStyles.cardHeader, bgcolor: randomBgColor() }}>
        <Box sx={blogStyles.dateContainer} >
            {/* @ts-ignore */}
            <FcCalendar size={"30px"} />
          <Typography fontSize={'20px'} variant="caption">
            {new Date(Number(props.blog.date)).toDateString()}
          </Typography>
        </Box>
        <Typography variant="h4" sx={blogStyles.title}>
          {props.blog.title}
        </Typography>
      </Box>
      <Box sx={blogStyles.cardContent}>
        <Typography variant="h4" sx={blogStyles.contentText}>
          {props.blog.content}
        </Typography>
      </Box>
    </Card>
  );
}

export default BlogItem;
