import ButtonAppBar from "./AppBar";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { lightBlue, deepOrange } from "@mui/material/colors";
import { IconButton, Paper } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import TrailInfoCard from "./TrailInfoCard";
import TrailDetails from "./TrailDetails";
import FavoriteTrails from "./FavoriteTrails";
import Grid from "@mui/material/Grid";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Slider from "@mui/material/Slider";
import ChatContainer from "./chatroom/ChatContainer";
import assetExports from './assets/assetExports'

const App = () => {
  const [zip, updateZip] = useState("");
  const [isZipInvalid, setIsZipInvalid] = useState(false);
  const [trails, setTrails] = useState([]);
  const [showTrails, setShowTrails] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const validZip = new RegExp("^[0-9]*$");
  const [userData, setUserData] = useState({});
  const [radius, setRadius] = useState(25);
  const [lightMode, setLightMode] = useState(false)

  // this resolves an error that is related to the loading overlay package used for the spinner
  // for more details: https://github.com/derrickpelletier/react-loading-overlay/pull/57
  LoadingOverlay.propTypes = undefined;

  // note that themes can be nested, and theme provider can be passed another instance of a theme obj
  const theme = !lightMode ? createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: lightBlue[500],
      },
      secondary: {
        main: lightBlue[100]
      },
      innerCard: {
        main: "#ffffff0d"
      },
      outerCard: {
        main: "#1e1e1e"
      },
      zipInput: {
        main: "#1e1e1e"
      },
      chatInput: {
        main: "#F3F3F3"
      },
      error: {
        main: deepOrange[500],
      },
    },
  }) : createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#4E7826",
      },
      background: {
        default: "#83976D",
      },
      secondary: {
        main: "#2c5601"
      },
      innerCard: {
        main: "white"
      },
      outerCard: {
        main: "#F3F3F3"
      },
      zipInput: {
        main: "#F3F3F3"
      },
      chatInput: {
        main: "#F3F3F3"
      },
      error: {
        main: deepOrange[500],
      },
    },
  });

  useEffect(() => {
    if (showTrails) {
      scrollToResults();
    }
  }, [showTrails]);
  
  const getTrailsByLocation = (e) => {
    e.preventDefault();
    if (!isZipInvalid) {
      setShowSpinner(true);
      fetch(`api/trails/${zip}/${radius}`)
        .then((response) => response.json())
        .then((res) => {
          if (res.status === 400) {
            setShowTrails(true);
            setTrails([]);
          } else {
            setTrails(res.data);
            setShowTrails(true);
            setShowSpinner(false);
            // scrollToResults(); // Add this line
          }
        })
        // TODO: do something more meaningful with this error
        .catch((err) => {
          setTrails([]);
          console.log("error occurred during get trails by location", err);
        });
    } else {
      setShowTrails(false);
      setTrails([]);
    }
  };

  const handleZipChange = (zip) => {
    updateZip(zip);
    setIsZipInvalid(false);
  };

  const validate = () => {
    if (zip.length === 5 && validZip.test(zip)) {
      setIsZipInvalid(false);
    } else {
      setIsZipInvalid(true);
    }
  };

  const navigate = useNavigate();
  
  const scrollToResults = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  console.log("userData: ", userData);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingOverlay active={showSpinner} spinner text="Loading trails...">
        <div className="parent-container">
        <ButtonAppBar
          userData={userData}
          setUserData={setUserData}
          setLightMode={setLightMode}
          lightMode={lightMode}
        ></ButtonAppBar>
        <Routes>
          <Route
            path="/chat/:id"
            element={<ChatContainer userData={userData}></ChatContainer>}
          ></Route>
          <Route
            path="/favoriteTrails"
            element={<FavoriteTrails></FavoriteTrails>}
          ></Route>
          <Route
            path="/details/:id/:idx"
            element={<TrailDetails lightMode={lightMode} userData={userData}></TrailDetails>}
          ></Route>
          <Route
            path="/"
            element={
              <>
                <Paper sx={{ marginBottom: "-64px", height: "100vh" }}>
                  <div className="landing-container">
                    <div className="img-wrapper">
                      <img
                        src={assetExports.homepage1}
                        className="welcome-img"
                      ></img>
                      <img
                        src={assetExports.homepage2}
                        className="welcome-img"
                      ></img>
                    </div>
                    <div className="welcome-msg">
                      <Typography
                        variant="h2"
                        sx={{
                          marginBottom: "1rem",
                          letterSpacing: "1px",
                          fontWeight: "bold",
                          color: "white"
                        }}
                      >
                        <> DISCOVER YOUR <br></br> NEXT ADVENTURE </>
                      </Typography>
                      <form onSubmit={getTrailsByLocation} noValidate hidden={!userData.name}>
                        <TextField
                          required
                          error={isZipInvalid}
                          helperText={
                            isZipInvalid
                              ? "Zipcode must be a 5 digit number"
                              : ""
                          }
                          value={zip}
                          onChange={(e) => handleZipChange(e.target.value)}
                          sx={{
                            backgroundColor: theme.palette.zipInput.main,
                            opacity: 0.9,
                            width: "70%",
                          }}
                          variant="filled"
                          label="Search by zipcode"
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                formNoValidate
                                type="submit"
                                onClick={validate}
                              >
                                <SearchIcon />
                              </IconButton>
                            ),
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ marginTop: "1rem", letterSpacing: "1px", fontWeight: "bold", color: "white" }}>
                          Search radius: {radius} miles
                        </Typography>
                        <Slider
                          value={radius}
                          onChange={(e, value) => setRadius(value)}
                          defaultValue={25}
                          step={1}
                          marks
                          min={1}
                          max={100}
                          valueLabelDisplay="auto"
                          sx={{
                            width: "70%",
                            marginBottom: "1rem",
                            color: "#ffffff",
                            "& .MuiSlider-thumb": {
                              color: "#ffffff",
                            },
                            "& .MuiSlider-track": {
                              color: "#ffffff",
                            },
                            "& .MuiSlider-rail": {
                              color: "#ffffff",
                            },
                          }}
                        />
                      </form>
                    </div>
                  </div>
                  <div className="grid-wrapper">
                    <Grid
                      container
                      sx={{ marginTop: "3rem" }}
                      direction={"row"}
                      spacing={6}
                    >
                      {showTrails ? (
                        trails === undefined ? (
                          <div className="error-message">
                            <p>
                              Sorry, no matching trails were found within a {radius} mile radius from this zipcode.
                            </p>
                          </div>
                        ) : (
                          trails.map((trail, i) => {
                            return (
                              <Grid
                                item
                                xs={6}
                                s={5}
                                lg={4}
                                xl={3}
                                display="flex"
                                justifyContent="center"
                                key={i}
                              >
                                <Link
                                  to={`/details/${trail.id}/${i}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <TrailInfoCard
                                    key={i}
                                    index={i}
                                    trail={trail}
                                  />
                                </Link>
                              </Grid>
                            );
                          })
                        )
                      ) : undefined}
                    </Grid>
                  </div>
                </Paper>
              </>
            }
          ></Route>
        </Routes>
        </div>
      </LoadingOverlay>
    </ThemeProvider>
  );
};

export default App;
