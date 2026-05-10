// src/layout/Navbar.jsx

import {
    Box,
    Typography,
    IconButton,
    Stack,
    useTheme,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";

import { useLocation } from "react-router-dom";

import { tokens } from "../theme/theme";

const pageTitles = {
    "/": "Appointments",
    "/patients": "Patients",
    "/schedule": "Schedule",
    "/manage-appointments": "Cancellations",
};

export default function Navbar() {
    const location = useLocation();

    const title =
        pageTitles[location.pathname] || "Dashboard";

    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                height: "80px",
                px: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // bgcolor: colors.primary[100],
                bgcolor: colors.default[100],
                borderBottom: `1.4px solid ${colors.primary[500]}`,
            }}
        >
            <Typography
                sx={{
                    color: colors.white[900],

                    fontWeight: 700,

                    fontSize: "1.35rem",

                    fontFamily: "Alata, sans-serif",

                    letterSpacing: "1px",
                }}
            >
                {title}
            </Typography>

            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                {/* SEARCH */}
                <IconButton
                    sx={{
                        bgcolor: colors.secondary[100],

                        border: `1px solid ${colors.secondary[200]}`,

                        borderRadius: "14px",

                        width: 44,

                        height: 44,

                        transition: "0.2s ease",

                        "&:hover": {
                            bgcolor: colors.secondary[200],
                        },
                    }}
                >
                    <SearchIcon
                        sx={{
                            color: colors.secondary[700],

                            fontSize: 22,
                        }}
                    />
                </IconButton>

                {/* NOTIFICATION */}
                <IconButton
                    sx={{
                        bgcolor: colors.secondary[100],

                        border: `1px solid ${colors.secondary[200]}`,

                        borderRadius: "14px",

                        width: 44,

                        height: 44,

                        position: "relative",

                        transition: "0.2s ease",

                        "&:hover": {
                            bgcolor: colors.secondary[200],
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",

                            top: 10,
                            right: 10,

                            width: 8,
                            height: 8,

                            borderRadius: "50%",

                            bgcolor: colors.yellowAccent[500],

                            boxShadow: `0 0 0 2px ${colors.primary[100]}`,

                            animation: "ping 1.5s infinite",
                        }}
                    />

                    <NotificationsNoneIcon
                        sx={{
                            color: colors.secondary[700],

                            fontSize: 22,
                        }}
                    />
                </IconButton>
            </Stack>

            <style>
                {`
                    @keyframes ping {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }

                        75% {
                            transform: scale(1.8);
                            opacity: 0;
                        }

                        100% {
                            transform: scale(1.8);
                            opacity: 0;
                        }
                    }
                `}
            </style>
        </Box>
    );
}