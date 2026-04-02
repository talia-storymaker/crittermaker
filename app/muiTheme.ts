"use client";
import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#590995", // should be the same as var(--dark)
    },
  },
});

export default muiTheme;
