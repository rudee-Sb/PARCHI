import { Box, Typography } from "@mui/material";
import './index.css'
import { useState } from "react";

import {
    Routes,
    Route,
} from "react-router-dom";

import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";

import Appointments from "./pages/Appointments";
import ManageAppointments from "./pages/ManageAppointments";
import Schedule from "./pages/Schedule";
import Patients from "./pages/Patients";

function App() {
    const [collapsed, setCollapsed] =
        useState(true);

    return (
        <Box
            sx={{
                display: "grid",

                gridTemplateColumns:
                    collapsed
                        ? "72px 1fr"
                        : "240px 1fr",

                gridTemplateRows:
                    "80px 1fr",

                height: "100vh",

                bgcolor:
                    "background.default",

                overflow: "hidden",

                transition:
                    "grid-template-columns 0.25s ease",
            }}
        >
            {/* SIDEBAR */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1200,
                }}
            >
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={
                        setCollapsed
                    }
                />
            </Box>

            {/* NAVBAR */}
            <Box
                sx={{
                    gridColumn: 2,
                    minWidth: 0,
                }}
            >
                <Navbar />
            </Box>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    gridColumn: 2,

                    overflow: "auto",

                    p: 3,

                    minWidth: 0,

                    bgcolor:
                        "background.default",

                    color:
                        "text.primary",
                }}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Appointments />
                        }
                    />

                    <Route
                        path="/patients"
                        element={
                            <Patients />
                        }
                    />

                    <Route
                        path="/schedule"
                        element={
                            <Schedule />
                        }
                    />

                    <Route
                        path="/manage-appointments"
                        element={
                            <ManageAppointments />
                        }
                    />
                </Routes>
            </Box>
        </Box>
    );
}

export default App;