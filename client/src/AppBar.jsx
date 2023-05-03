import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Switch from '@mui/material/Switch';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Stack from "@mui/material/Stack";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


export default function ButtonAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [intervalID, setintervalID] = React.useState(null);

  const theme = useTheme()
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirect = () => {
    navigate("/favoriteTrails")
  }

  const toggleLightMode = (event) => {
    props.setLightMode(!props.lightMode);
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/sessions/currentuser", {withCredentials: true});
      if (response.data) {
        props.setUserData(response.data);
      }
    } catch (err) {
      console.log("Error fetching user data: ", err);
    }
  }

  //checks if user is authenticated without updating state
  const authenticationCheck = async () => {
    try {
      const response = await axios.get("/api/sessions/currentuser", {withCredentials: true});
    } catch (err) {
      if (window.location.pathname !== '/'){
        alert('Your session has timed out, please log in again')
        console.log('redirecting to login')
        window.location.href = 'http://localhost:5173'
      }
      console.log("Error fetching user data: ", err);
    }
    () => clearInterval(id);
  }

//
  React.useEffect(() => {
    fetchUserData();
    // let id = setInterval(authenticationCheck, 15000);
    // setintervalID(id)
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <div hidden={!props.userData.name}>
            <IconButton
              onClick={handleMenu}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, color: "white" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{ marginTop: "2rem" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem sx={{ fontWeight: "bold" }} onClick={handleRedirect}>
                <span>Favorite trails</span>
              </MenuItem>
            </Menu>
          </div>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, letterSpacing: "1px", fontWeight: "bold", }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                boxShadow: "none",
                color: "#fff",
              }}
            >
              Trail Blazers
            </Link>
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton onClick={toggleLightMode} color="inherit" edge="end">
              {props.lightMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {Object.keys(props.userData).length > 0 ? (
              <Button
                color="inherit"
                component="a"
                href="http://localhost:4000/logout"
                sx={{ fontWeight: "bold", }}
              >
                Logout
              </Button>
            ) : (
              // <Button
              //   color="inherit"
              //   component="a"
              //   href="http://localhost:4000/auth/google"
              //   sx={{ fontWeight: "bold", }}
              // >
              //   Login
              // </Button>
              <GoogleOAuthProvider clientId="376042113743-qqvq0qnc4j0r7v4aq7hq9r2kqnj1jugj.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={(res) => {
                    console.log(res)
                    window.location.href="http://localhost:4000/auth/google"
                  }}
                  onFailure={(res)=>console.log(res)}
                />
              </GoogleOAuthProvider>
          )}
          </Stack>
          </Toolbar> 
      </AppBar>
    </Box>
  );
}
