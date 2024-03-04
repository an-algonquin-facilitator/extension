import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Loading } from "./Loading";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Loading />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
