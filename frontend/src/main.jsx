// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { BrowserRouter } from "react-router-dom";

import { ColorModeContext, useMode } from "./theme/theme";

function Root() {
    const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);