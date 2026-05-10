import { useState, useEffect, useMemo } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    TextField,
    Typography,
    useTheme,
    CircularProgress,
    InputAdornment
} from "@mui/material";
import { Search, UserPlus } from "lucide-react";

import { tokens } from "../theme/theme";
import { getPatients } from "../api/api";

export default function Patients() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Patients on Mount
    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const res = await getPatients();
                setPatients(res.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Filter patients based on search term
    const filteredPatients = useMemo(() => {
        if (!searchTerm) return patients;
        return patients.filter((p) =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phone?.includes(searchTerm) ||
            p.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [patients, searchTerm]);

    // Helper to determine Priority Chip Color
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "emergency":
                return "#ef4444"; // Red
            case "urgent":
                return "#f59e0b"; // Orange/Yellow
            default:
                return colors.secondary[500]; // Default Theme Accent
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto", marginTop: "1.3rem", borderRadius: "32px", pb: 4 }}>
            
            {/* HEADER SECTION */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h3" sx={{ color: colors.white[900], fontWeight: 800, fontFamily: "Atlanta, sans-serif", letterSpacing: "0.5px" }}>
                        Patients in Care
                    </Typography>
                    <Typography sx={{ color: colors.white[600], mt: 0.5, fontSize: "0.95rem" }}>
                        Manage and view all registered patient records.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    {/* SEARCH BAR */}
                    <TextField
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} color={colors.white[600]} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: "280px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                bgcolor: colors.primary[100],
                                color: colors.white[900],
                                "& fieldset": { borderColor: colors.primary[400] },
                                "&:hover fieldset": { borderColor: colors.secondary[400] },
                                "&.Mui-focused fieldset": { borderColor: colors.secondary[500] },
                            }
                        }}
                    />
                    
                    {/* ADD PATIENT BUTTON */}
                    <Button
                        variant="contained"
                        startIcon={<UserPlus size={18} />}
                        sx={{
                            height: 40,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontFamily: "Atlanta, sans-serif",
                            color: colors.white[200],
                            bgcolor: colors.secondary[500],
                            "&:hover": { bgcolor: colors.secondary[600] },
                            px: 3
                        }}
                    >
                        New Patient
                    </Button>
                </Stack>
            </Box>

            {/* PATIENTS GRID */}
            {filteredPatients.length > 0 ? (
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 3
                }}>
                    {filteredPatients.map((patient) => (
                        <Card 
                            key={patient.id} 
                            sx={{ 
                                borderRadius: "24px", 
                                bgcolor: colors.primary[100], 
                                border: `1px solid ${colors.primary[300]}`, 
                                boxShadow: "0px 4px 15px rgba(0,0,0,0.03)",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    borderColor: colors.secondary[400] // Only changes border color now
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
                                {/* TOP ROW: AVATAR & INFO */}
                                <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 44, 
                                            height: 44, 
                                            bgcolor: colors.primary[300], 
                                            color: colors.white[900],
                                            fontWeight: 700,
                                            fontSize: "1.1rem",
                                            border: `1.5px solid ${colors.primary[400]}`
                                        }}
                                    >
                                        {patient.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        {/* Removed noWrap so very long names can wrap instead of truncating */}
                                        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: colors.white[900], fontFamily: "Atlanta, sans-serif", lineHeight: 1.2 }}>
                                            {patient.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.75rem", color: colors.white[600], mt: 0.3 }}>
                                            ID: {patient.id.split("-")[0].toUpperCase()}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={patient.priority || "Normal"} 
                                        size="small" 
                                        sx={{ 
                                            height: 22, 
                                            fontWeight: 700, 
                                            fontSize: "0.68rem", 
                                            bgcolor: `${getPriorityColor(patient.priority)}20`, 
                                            color: getPriorityColor(patient.priority),
                                            border: `1px solid ${getPriorityColor(patient.priority)}50`
                                        }} 
                                    />
                                </Stack>

                                {/* MIDDLE ROW: VITALS/TAGS */}
                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                    <Chip label={`${patient.age} Yrs`} size="small" sx={{ height: 22, fontSize: "0.7rem", bgcolor: colors.primary[200], color: colors.white[800], fontWeight: 600 }} />
                                    <Chip label={patient.gender} size="small" sx={{ height: 22, fontSize: "0.7rem", bgcolor: colors.primary[200], color: colors.white[800], fontWeight: 600 }} />
                                    {patient.bloodGroup && (
                                        <Chip label={patient.bloodGroup} size="small" sx={{ height: 22, fontSize: "0.7rem", bgcolor: colors.primary[200], color: colors.white[800], fontWeight: 600 }} />
                                    )}
                                </Stack>

                                {/* BOTTOM ROW: SYMPTOMS & CONTACT */}
                                <Box sx={{ mt: "auto", p: 1.5, borderRadius: "16px", bgcolor: colors.primary[200], border: `1px solid ${colors.primary[300]}` }}>
                                    <Typography 
                                        sx={{ 
                                            fontSize: "0.8rem", 
                                            color: colors.white[800], 
                                            fontWeight: 600, 
                                            mb: 0.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2, // Clamps text to 2 lines max
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        Issue: <span style={{ color: colors.white[600], fontWeight: 500 }}>{patient.symptoms || "Not specified"}</span>
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.8rem", color: colors.white[800], fontWeight: 600 }}>
                                        Contact: <span style={{ color: colors.white[600], fontWeight: 500 }}>{patient.phone || "--"}</span>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Box sx={{ textAlign: "center", py: 10, bgcolor: colors.primary[100], borderRadius: "24px", border: `1px solid ${colors.primary[300]}` }}>
                    <Typography variant="h5" sx={{ color: colors.white[700], fontWeight: 600 }}>
                        No patients found.
                    </Typography>
                    <Typography sx={{ color: colors.white[500], mt: 1 }}>
                        {searchTerm ? "Try adjusting your search criteria." : "Start by adding a new patient to the system."}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}