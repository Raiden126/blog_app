import { AppBar, Box, Button, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { FaBloggerB } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { useState } from "react";
import { headerStyles } from "../../styles/header-styles";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "./user/UserMenu";

function Header() {
  const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleAddBlog = () => {
    navigate("/");
  }

  return (
    <AppBar position="static" sx={headerStyles.appBar}>
      <Toolbar>
        {/* @ts-ignore */}
        <FaBloggerB
          size={30}
          style={{
            borderRadius: "50%",
            padding: "10px",
            background: "#6C5252",
            color: "white",
          }}
        />
        <Box onClick={handleAddBlog} sx={headerStyles.addLink}>
          <Typography fontFamily="Work Sans" fontSize={20} >Post New Blog</Typography>
          <IconButton color="inherit">
            {/* @ts-ignore */}
            <FaBloggerB />
          </IconButton>
        </Box>
        <Box sx={headerStyles.tabContainer}>
          <Tabs textColor="inherit" TabIndicatorProps={{style: {background: "white"}}} value={value} onChange={(e, val) => setValue(val)}>
            {/* @ts-ignore */}
            <Tab LinkComponent={Link} to="/" disableRipple label="Home" />
            {/* @ts-ignore */}
            <Tab LinkComponent={Link} to="/blogs" disableRipple label="Blog" />
          </Tabs>
          {isLoggedIn ? <UserMenu /> : <Link style={{textDecoration: "none"}} to="/auth" >
            {/* @ts-ignore */}
            <Button endIcon={<IoLogInOutline  />} sx={headerStyles.authButton}>Auth</Button>
          </Link>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
