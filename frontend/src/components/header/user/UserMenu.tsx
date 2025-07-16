import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { FaUserNurse } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../../../store/auth-slice";

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const onProfileClick = () => {
    navigate("/profile");
  }
  return (
    <Box>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="secondary"
      >
        {/* @ts-ignore */}
        <FaUserNurse />
      </IconButton>
      {/* @ts-ignore */}
      <Menu
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      >
        {/* @ts-ignore */}
        <MenuItem onClick={onProfileClick}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography>LogOut</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default UserMenu;
