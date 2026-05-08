// src/theme/theme.js

import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

import "@fontsource/alata";
import "@fontsource/raleway";

export const tokens = () => ({
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

    default : {
        100: "#f5f6fb"
    },
});

export const themeSettings = () => {
    const colors = tokens();

    return {
        palette: {
            mode: "light",

            primary: {
                main: colors.primary[300],
            },

            secondary: {
                main: colors.secondary[500],
            },

            background: {
                default: "#f5f6fb",
                paper: "#ffffff",
            },

            text: {
                primary: colors.white[900],
                secondary: colors.white[700],
            },

            divider: "rgba(80, 87, 102, 0.08)",
        },

        typography: {
            fontFamily: "Atlanta, sans-serif",

            h1: {
                fontFamily: "Alata, sans-serif",
                fontSize: 42,
                color: colors.white[900],
            },

            h2: {
                fontFamily: "Alata, sans-serif",
                fontSize: 34,
                color: colors.white[900],
            },

            h3: {
                fontFamily: "Alata, sans-serif",
                fontSize: 28,
                color: colors.white[900],
            },

            h4: {
                fontFamily: "Alata, sans-serif",
                fontSize: 22,
                color: colors.white[900],
            },

            h5: {
                fontFamily: "Alata, sans-serif",
                fontSize: 18,
                color: colors.white[900],
            },

            h6: {
                fontFamily: "Alata, sans-serif",
                fontSize: 15,
                color: colors.white[900],
            },

            body1: {
                fontSize: 15,
                lineHeight: 1.7,
                color: colors.white[800],
            },

            body2: {
                fontSize: 13,
                lineHeight: 1.6,
                color: colors.white[700],
            },
        },

        shape: {
            borderRadius: 16,
        },

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: "#f5f6fb",
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        borderRadius: 18,
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        borderRadius: 22,
                        border: `1px solid ${colors.primary[400]}`,
                        boxShadow: `
                            0px 4px 12px rgba(15, 23, 42, 0.03),
                            0px 2px 4px rgba(15, 23, 42, 0.02)
                        `,
                    },
                },
            },

            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        textTransform: "none",
                        fontWeight: 600,
                        paddingInline: 18,
                        boxShadow: "none",
                    },

                    contained: {
                        backgroundColor: colors.secondary[500],

                        "&:hover": {
                            backgroundColor: colors.secondary[600],
                            boxShadow: "none",
                        },
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                    },
                },
            },

            MuiTextField: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#ffffff",
                    },
                },
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                        backgroundColor: "#ffffff",

                        "& fieldset": {
                            borderColor: colors.primary[400],
                        },

                        "&:hover fieldset": {
                            borderColor: colors.secondary[300],
                        },

                        "&.Mui-focused fieldset": {
                            borderColor: colors.secondary[500],
                        },
                    },
                },
            },

            MuiStepper: {
                styleOverrides: {
                    root: {
                        padding: 0,
                    },
                },
            },
        },
    };
};

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

export const useMode = () => {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prev) =>
                    prev === "light" ? "dark" : "light"
                );
            },
        }),
        []
    );

    // intentionally using same theme for both modes for now
    const theme = useMemo(
        () => createTheme(themeSettings(mode)),
        [mode]
    );

    return [theme, colorMode];
};