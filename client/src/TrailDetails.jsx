import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TrailDetailsSideIconMenu from "../src/TrailDetailsSideIconMenu";
import TrailsDetailsOverview from "../src/TrailDetailsOverview";
import LoadingOverlay from "react-loading-overlay";
import { Paper } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import assetExports from './assets/assetExports'

export default function TrailDetails(props) {
  const [trail, updateTrail] = useState([{}]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTrailDetails, updateShowTrailDetails] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [hasMatch, setHasMatch] = useState(false);
  const [alertState, setState] = React.useState({
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal } = alertState;
  let params = useParams();
  const theme = useTheme();

  const getTrailById = () => {
    if (params.id) {
      setShowSpinner(true);
      fetch(`/api/moreInfo/${params.id}`)
        .then((response) => response.json())
        .then((data) => {
          setShowSpinner(false);
          updateTrail(data.data[0]);
          updateShowTrailDetails(true);
        })
        // TODO: do something more meaningful with this error
        .catch((err) =>
          console.log("error occurred during get trails by id", err)
        );
    } else {
      updateTrail([]);
    }
  };

  const addSuccessType = (bool) => {
    if (bool) {
      setDeletedSuccess(false);
      setAddedSuccess(true);
    } else {
      setAddedSuccess(false);
    }
  };

  const deleteSuccessType = (bool) => {
    if (bool) {
      setAddedSuccess(false);
      setDeletedSuccess(true);
    } else {
      setDeletedSuccess(false);
    }
  };

  const showSuccessMessage = () => {
    if (addedSuccess) {
      return "Successfully added";
    } else if (deletedSuccess) {
      return "Successfully deleted";
    } else {
      return "Error - please try again";
    }
  };

  const showAlert = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const filterFavoriteTrails = (trails) => {
    const result = trails.data.filter((t) => t.trailId === params.id);
    if (result.length > 0) {
      setHasMatch(true);
    } else {
      setHasMatch(false);
    }
  };

  const getAllFavoriteTrails = () => {
    fetch("/api/db/getAllFavoriteTrails", {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        filterFavoriteTrails(data);
      });
  };

  useEffect(() => {
    if (params.id) {
      getTrailById();
      getAllFavoriteTrails();
    }
  }, []);

  return (
    <LoadingOverlay active={showSpinner} spinner text="Loading trail...">
      {showTrailDetails ? (
        <Paper sx={{ height: "26rem", marginTop: "64px" }}>
          <div className="details-container">
            <div className="banner-wrapper">
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                contentprops={{
                  classes: {
                    root: "snackbar",
                  },
                }}
              >
                <Alert
                  onClose={handleClose}
                  sx={{ width: "100%" }}
                  severity={
                    addedSuccess || deletedSuccess ? "success" : "error"
                  }
                >
                  {showSuccessMessage()}
                </Alert>
              </Snackbar>
              <img
                className="banner-img"
                src={assetExports.mtnBannerPics[params.idx]}
              ></img>
            </div>
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              className="details-title"
              color={"white"}
              sx={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
              }}
            >
              {trail.name}
            </Typography>
            <TrailDetailsSideIconMenu
              trail={trail}
              showAlert={showAlert}
              addSuccessType={addSuccessType}
              deleteSuccessType={deleteSuccessType}
              hasMatch={hasMatch}
            ></TrailDetailsSideIconMenu>
          </div>
          <TrailsDetailsOverview
            lightMode={props.lightMode}
            userData={props.userData}
            refreshTrail={getTrailById}
            trail={trail}
          ></TrailsDetailsOverview>
        </Paper>
      ) : (
        <Paper sx={{ height: "40rem" }}></Paper>
      )}
    </LoadingOverlay>
  );
}
