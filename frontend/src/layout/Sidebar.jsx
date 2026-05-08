// src/layout/Sidebar.jsx

import {
    Box,
    Typography,
    Tooltip,
    useTheme,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";

import { tokens, ColorModeContext } from "../theme/theme";

// Icons
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function Sidebar({
    collapsed,
    setCollapsed,
}) {
    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const colorMode = useContext(ColorModeContext);

    const location = useLocation();

    const navigate = useNavigate();

    const menuItems = [
        {
            icon: <EventIcon />,
            label: "Appointments",
            path: "/",
        },

        {
            icon: <PeopleIcon />,
            label: "Patients",
            path: "/patients",
        },

        {
            icon: <CalendarMonthIcon />,
            label: "Schedule",
            path: "/schedule",
        },
    ];

    const bottomItems = [
        {
            icon: <SettingsIcon />,
            label: "Settings",
            path: "/settings",
        },
    ];

    const isActive = (path) =>
        location.pathname === path;

    return (
        <Box
            sx={{
                width: collapsed ? 72 : 240,
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1300,
                bgcolor: colors.default[100],
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.25s ease",
                overflow: "hidden",
                borderRight: `1.4px solid ${colors.primary[500]}`,
                // boxShadow:
                //     "0 10px 40px rgba(140, 149, 159, 0.08)",
            }}
        >
            {/* TOP */}
            {/* TOP */}
            <Box
                sx={{
                    height: "80px",

                    px: 2,

                    display: "flex",

                    alignItems: "center",

                    borderBottom: `1.4px solid ${colors.primary[500]}`,

                    boxSizing: "border-box",

                    flexShrink: 0,

                    cursor: "pointer",
                }}
                onClick={() => setCollapsed(!collapsed)}
            >
                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,

                            bgcolor: colors.secondary[500],

                            borderRadius: "14px",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            boxShadow:
                                "0 8px 20px rgba(168,163,246,0.25)",
                        }}
                    >
                        <LocalHospitalIcon
                            sx={{
                                color: "#fff",

                                fontSize: 22,
                            }}
                        />
                    </Box>

                    {!collapsed && (
                        <Typography
                            sx={{
                                color: colors.white[900],

                                fontWeight: 700,

                                fontSize: "1.2rem",

                                fontFamily:
                                    "Alata, sans-serif",
                            }}
                        >
                            Parchi
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* MIDDLE */}
            <Box sx={{ mt: 2 }}>
                {menuItems.map((item, i) => (
                    <Tooltip
                        title={collapsed ? item.label : ""}
                        key={i}
                        placement="right"
                    >
                        <Box
                            onClick={() =>
                                navigate(item.path)
                            }
                            sx={{
                                display: "flex",

                                alignItems: "center",

                                px: 2,

                                py: 1.1,

                                gap: 2,

                                cursor: "pointer",

                                transition: "0.2s ease",

                                "&:hover": {
                                    bgcolor:
                                        colors.primary[200],
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,

                                    borderRadius: "12px",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent:
                                        "center",

                                    bgcolor: isActive(
                                        item.path
                                    )
                                        ? colors.secondary[500]
                                        : "transparent",

                                    color: isActive(
                                        item.path
                                    )
                                        ? "#fff"
                                        : colors.white[700],

                                    transition:
                                        "0.2s ease",
                                }}
                            >
                                {item.icon}
                            </Box>

                            {!collapsed && (
                                <Typography
                                    sx={{
                                        color:
                                            colors.white[900],

                                        fontWeight: 600,

                                        fontSize: 14,
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            )}
                        </Box>
                    </Tooltip>
                ))}
            </Box>

            {/* BOTTOM */}
            <Box sx={{ mb: 2 }}>
                {bottomItems.map((item, i) => (
                    <Box
                        key={i}
                        onClick={() =>
                            navigate(item.path)
                        }
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 2,
                            py: 1.1,
                            gap: 2,
                            cursor: "pointer",
                            transition: "0.2s ease",
                            borderTop: `1.4px solid ${colors.primary[500]}`,
                            "&:hover": {
                                bgcolor:
                                    colors.primary[200],
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,

                                borderRadius: "12px",

                                display: "flex",

                                alignItems: "center",

                                justifyContent:
                                    "center",

                                bgcolor: isActive(
                                    item.path
                                )
                                    ? colors.secondary[500]
                                    : "transparent",

                                color: isActive(
                                    item.path
                                )
                                    ? "#fff"
                                    : colors.white[700],

                                transition:
                                    "0.2s ease",
                            }}
                        >
                            {item.icon}
                        </Box>

                        {!collapsed && (
                            <Typography
                                sx={{
                                    color:
                                        colors.white[900],

                                    fontWeight: 600,

                                    fontSize: 14,
                                }}
                            >
                                {item.label}
                            </Typography>
                        )}
                    </Box>
                ))}

                {/* Theme Toggle */}
                <Box
                    onClick={
                        colorMode.toggleColorMode
                    }
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        px: 2,

                        py: 1.1,

                        gap: 2,

                        cursor: "pointer",

                        transition: "0.2s ease",

                        "&:hover": {
                            bgcolor:
                                colors.primary[200],
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,

                            borderRadius: "12px",

                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                                "center",

                            bgcolor:
                                theme.palette.mode ===
                                    "dark"
                                    ? colors.secondary[500]
                                    : "transparent",

                            color:
                                theme.palette.mode ===
                                    "dark"
                                    ? "#fff"
                                    : colors.white[700],

                            transition:
                                "0.2s ease",
                        }}
                    >
                        <DarkModeIcon />
                    </Box>

                    {!collapsed && (
                        <Typography
                            sx={{
                                color:
                                    colors.white[900],

                                fontWeight: 600,

                                fontSize: 14,
                            }}
                        >
                            Theme
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}