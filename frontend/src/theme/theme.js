// src/theme/theme.js

import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

import "@fontsource/alata";
import "@fontsource/raleway";

export const tokens = (mode) => ({
    ...(mode === "dark"
        ? {
            /* DARK MODE */
            white: {
                100: "#e5e7eb",
                200: "#d1d5db",
                300: "#9ca3af",
                400: "#7b818f",
                500: "#6b7684",
                600: "#424b5a",
                700: "#445164",
                800: "#575d6c",
                900: "#3a3e4a",
            },

            primary: {
                100: "#18181b",
                200: "#111114",
                300: "#0b0b0d",
                400: "#09090b",
                500: "#070709",
                600: "#050507",
                700: "#030304",
                800: "#020203",
                900: "#000000",
            },

            secondary: {
                100: "#dbeafe",
                200: "#bfdbfe",
                300: "#93c5fd",
                400: "#60a5fa",
                500: "#3b82f6",
                600: "#2563eb",
                700: "#1d4ed8",
                800: "#1e40af",
                900: "#1e3a8a",
            },

            yellowAccent: {
                100: "#fef9c3",
                200: "#fef08a",
                300: "#fde047",
                400: "#facc15",
                500: "#eab308",
                600: "#ca8a04",
                700: "#a16207",
                800: "#854d0e",
                900: "#713f12",
            },

            pinkAccent: {
                100: "#fce7f3",
                200: "#fbcfe8",
                300: "#f9a8d4",
                400: "#f472b6",
                500: "#ec4899",
                600: "#db2777",
                700: "#be185d",
                800: "#9d174d",
                900: "#831843",
            },

            success: {
                500: "#22c55e",
            },

            error: {
                500: "#ef4444",
            },

            warning: {
                500: "#f59e0b",
            },

            default: {
                100: "#09090b",
            },
        }
        : {
            /* LIGHT MODE */
            white: {
                100: "#ffffff",
                200: "#f8f8fb",
                300: "#f1f2f6",
                400: "#e7e8ee",
                500: "#d7d9e0",
                600: "#b7bbc7",
                700: "#8f96a3",
                800: "#5e6674",
                900: "#2b2f38",
            },

            primary: {
                100: "#ffffff",
                200: "#fafafe",
                300: "#f5f6fb",
                400: "#eef0f6",
                500: "#e7e9f1",
                600: "#cfd4df",
                700: "#a8afbf",
                800: "#7b8393",
                900: "#4f5665",
            },

            secondary: {
                100: "#f2f1ff",
                200: "#e4e2ff",
                300: "#d0ccff",
                400: "#b5afff",
                500: "#7c6cf2",
                600: "#6757dd",
                700: "#5243c4",
                800: "#3f3298",
                900: "#2b2268",
            },

            yellowAccent: {
                100: "#fff8e7",
                200: "#ffefbf",
                300: "#ffe08a",
                400: "#ffd54f",
                500: "#fbbf24",
                600: "#d69e1f",
                700: "#a87918",
                800: "#7a5610",
                900: "#4d3608",
            },

            pinkAccent: {
                100: "#fff1f4",
                200: "#ffdce5",
                300: "#ffbfd0",
                400: "#ff94b3",
                500: "#ff6b96",
                600: "#e2557f",
                700: "#bd4367",
                800: "#8d2f4d",
                900: "#5a1b31",
            },

            success: {
                500: "#22c55e",
            },

            error: {
                500: "#ef4444",
            },

            warning: {
                500: "#f59e0b",
            },

            default: {
                100: "#f5f6fb",
            },
        }),
});

export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode,

            primary: {
                main: colors.primary[200],
            },

            secondary: {
                main: colors.secondary[500],
            },

            background: {
                default:
                    mode === "dark"
                        ? colors.primary[300]
                        : "#f5f6fb",

                paper:
                    mode === "dark"
                        ? colors.primary[100]
                        : "#ffffff",
            },

            text: {
                primary:
                    mode === "dark"
                        ? colors.white[100]
                        : colors.white[900],

                secondary:
                    mode === "dark"
                        ? colors.white[300]
                        : colors.white[700],
            },

            divider:
                mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(80, 87, 102, 0.08)",
        },

        typography: {
            fontFamily:
                "Atlanta, sans-serif",

            h1: {
                fontFamily:
                    "Alata, sans-serif",
                fontSize: 42,
                fontWeight: 700,
            },

            h2: {
                fontFamily:
                    "Alata, sans-serif",
                fontSize: 34,
                fontWeight: 700,
            },

            h3: {
                fontFamily:
                    "Alata, sans-serif",
                fontSize: 28,
                fontWeight: 700,
            },

            h4: {
                fontFamily:
                    "Alata, sans-serif",
                fontSize: 22,
                fontWeight: 700,
            },

            h5: {
                fontFamily:
                    "Alata, sans-serif",
                fontSize: 18,
                fontWeight: 700,
            },

            h6: {
                fontFamily:
                    "Alata, sans-serif",
                fontSize: 15,
                fontWeight: 700,
            },

            body1: {
                fontSize: 15,
                lineHeight: 1.7,
            },

            body2: {
                fontSize: 13,
                lineHeight: 1.6,
            },
        },

        shape: {
            borderRadius: 18,
        },

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor:
                            mode === "dark"
                                ? colors.primary[300]
                                : "#f5f6fb",

                        color:
                            mode === "dark"
                                ? colors.white[100]
                                : colors.white[900],

                        transition:
                            "all 0.25s ease",
                    },

                    "*": {
                        scrollbarWidth:
                            "thin",

                        scrollbarColor:
                            mode === "dark"
                                ? "#3f3f46 transparent"
                                : "#cbd5e1 transparent",
                    },

                    "*::-webkit-scrollbar": {
                        width: "7px",
                        height: "7px",
                    },

                    "*::-webkit-scrollbar-track":
                    {
                        background:
                            "transparent",
                    },

                    "*::-webkit-scrollbar-thumb":
                    {
                        background:
                            mode ===
                                "dark"
                                ? "rgba(63,63,70,0.9)"
                                : "rgba(148,163,184,0.7)",

                        borderRadius:
                            "20px",
                    },

                    "*::-webkit-scrollbar-thumb:hover":
                    {
                        background:
                            mode ===
                                "dark"
                                ? "rgba(82,82,91,1)"
                                : "rgba(100,116,139,1)",
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage:
                            "none",

                        borderRadius: 20,

                        backgroundColor:
                            mode === "dark"
                                ? colors.primary[100]
                                : "#ffffff",
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage:
                            "none",

                        borderRadius: 24,

                        border: `1px solid ${mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : colors.primary[400]
                            }`,

                        backgroundColor:
                            mode === "dark"
                                ? colors.primary[100]
                                : "#ffffff",

                        boxShadow:
                            mode === "dark"
                                ? `
                                0px 10px 30px rgba(0,0,0,0.35)
                              `
                                : `
                                0px 4px 12px rgba(15, 23, 42, 0.03),
                                0px 2px 4px rgba(15, 23, 42, 0.02)
                              `,
                    },
                },
            },

            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                        textTransform:
                            "none",
                        fontWeight: 700,
                        paddingInline: 18,
                        boxShadow: "none",
                    },

                    contained: {
                        backgroundColor:
                            colors.secondary[500],

                        color: "#ffffff",

                        "&:hover": {
                            backgroundColor:
                                colors.secondary[600],

                            boxShadow:
                                "none",
                        },
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                    },
                },
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,

                        backgroundColor:
                            mode === "dark"
                                ? colors.primary[200]
                                : "#ffffff",

                        "& fieldset": {
                            borderColor:
                                mode === "dark"
                                    ? "rgba(255,255,255,0.06)"
                                    : colors.primary[400],
                        },

                        "&:hover fieldset":
                        {
                            borderColor:
                                colors.secondary[400],
                        },

                        "&.Mui-focused fieldset":
                        {
                            borderColor:
                                colors.secondary[500],
                        },
                    },

                    input: {
                        color:
                            mode === "dark"
                                ? colors.white[100]
                                : colors.white[900],
                    },
                },
            },

            MuiTextField: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        fontWeight: 600,
                    },
                },
            },

            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor:
                            mode === "dark"
                                ? "rgba(255,255,255,0.06)"
                                : "rgba(0,0,0,0.06)",
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor:
                            mode === "dark"
                                ? "#18181b"
                                : "#111827",

                        borderRadius: 12,
                        fontSize: 12,
                    },
                },
            },
        },
    };
};

export const ColorModeContext = createContext({
    toggleColorMode: () => { },
});

export const useMode = () => {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prev) =>
                    prev === "light"
                        ? "dark"
                        : "light"
                );
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme(
                themeSettings(mode)
            ),
        [mode]
    );

    return [theme, colorMode];
};