import {Grid, Paper} from "@mui/material";
import React from "react";

export default function Menu(props: React.PropsWithChildren<any>) {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{minHeight: '100vh', backgroundColor: "#b4d3ff"}}
    >
      <Paper style={{padding: '50px', backgroundColor: "#d2ffb4"}}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{minHeight: '100%'}}
        >
          {props.children}
        </Grid>
      </Paper>
    </Grid>
  )
}