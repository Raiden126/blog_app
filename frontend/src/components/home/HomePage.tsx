import { Box, Typography } from "@mui/material";
import { HomepageStyles } from "../../styles/homepage-styles";
import Footer from "./Footer";

function HomePage() {
  return (
    <Box sx={HomepageStyles.container}>
      <Box sx={HomepageStyles.wrapper}>
        <Typography sx={HomepageStyles.text}>
          Write and Share Your Blog With Millons Of People
        </Typography>
        <img
          width="50%"
          height="50%"
          //@ts-ignore
          style={HomepageStyles.image}
          src="/blog.png"
          alt="Blog"
        />
      </Box>
      <Box sx={HomepageStyles.wrapper}>
        <img
          width="50%"
          height="50%"
          //@ts-ignore
          style={HomepageStyles.image}
          src="/publish.png"
          alt="Publish"
        />
        <Typography sx={HomepageStyles.text}>
          Write and Share Your Blog With Millons Of People
        </Typography>
      </Box>
      <Box sx={HomepageStyles.wrapper}>
        <Typography sx={HomepageStyles.text}>
          Write and Share Your Blog With Millons Of People
        </Typography>
        <img
          width="50%"
          height="50%"
          //@ts-ignore
          style={HomepageStyles.image}
          src="/articles.png"
          alt="Articles"
        />
      </Box>
      <Footer />
    </Box>
  );
}

export default HomePage;
