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
    InputAdornment,
    Snackbar,
    Alert
} from "@mui/material";
import { Search, CalendarX, Clock } from "lucide-react";

import { tokens } from "../theme/theme";
import { getAppointments, cancelAppointment } from "../api/api";
import dayjs from "dayjs";

export default function ManageAppointments() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Fetch Appointments on Mount
    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                const res = await getAppointments();
                setAppointments(res.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                setSnackbar({ open: true, message: "Failed to load appointments.", severity: "error" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    // Helper: Convert Date (YYYY-MM-DD) and Slot (10:30 AM) to a Dayjs object for accurate time comparison
    const parseAppointmentTime = (dateStr, slotStr) => {
        if (!dateStr || !slotStr) return dayjs(0); // If corrupted, treat as past

        const [time, modifier] = slotStr.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours, 10);

        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return dayjs(dateStr).hour(hours).minute(parseInt(minutes, 10)).second(0);
    };

    // Filter appointments: Future only, not cancelled, matches search
    const activeFutureAppointments = useMemo(() => {
        const now = dayjs();

        const validAppointments = appointments.filter((appt) => {
            // 1. Must not be already cancelled
            if (appt.status === "cancelled") return false;

            // 2. Must be strictly in the future
            const apptTime = parseAppointmentTime(appt.date, appt.slot);
            if (apptTime.isBefore(now)) return false;

            // 3. Must match search term (Doctor Name or Patient Name)
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const doctorMatch = appt.doctor?.name?.toLowerCase().includes(searchLower);
                const patientMatch = appt.patient?.name?.toLowerCase().includes(searchLower);
                if (!doctorMatch && !patientMatch) return false;
            }

            return true;
        });

        // Sort them chronologically (soonest first)
        return validAppointments.sort((a, b) => {
            return parseAppointmentTime(a.date, a.slot).valueOf() - parseAppointmentTime(b.date, b.slot).valueOf();
        });
    }, [appointments, searchTerm]);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "emergency": return "#ef4444";
            case "urgent": return "#f59e0b";
            default: return colors.secondary[500];
        }
    };

    const handleCancel = async (id) => {
        setCancellingId(id);
        try {
            await cancelAppointment(id);
            // Remove from UI instantly by updating state
            setAppointments((prev) => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
            setSnackbar({ open: true, message: "Appointment cancelled successfully.", severity: "success" });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            setSnackbar({ open: true, message: "Failed to cancel appointment.", severity: "error" });
        } finally {
            setCancellingId(null);
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
        <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto", marginTop: "1.3rem", borderRadius: "32px", pb: 4, position: "relative" }}>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: "12px", fontWeight: 600, fontFamily: "Atlanta, sans-serif" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* HEADER SECTION */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h3" sx={{ color: colors.white[900], fontWeight: 800, fontFamily: "Atlanta, sans-serif", letterSpacing: "0.5px" }}>
                        Manage Bookings
                    </Typography>
                    <Typography sx={{ color: colors.white[600], mt: 0.5, fontSize: "0.95rem" }}>
                        View upcoming appointments or cancel them before their scheduled time.
                    </Typography>
                </Box>

                {/* SEARCH BAR */}
                <TextField
                    placeholder="Search by doctor or patient..."
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
                        width: "320px",
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
            </Box>

            {/* APPOINTMENTS GRID */}
            {activeFutureAppointments.length > 0 ? (
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                    gap: 3
                }}>
                    {activeFutureAppointments.map((appt) => (
                        <Card
                            key={appt.id}
                            sx={{
                                borderRadius: "24px",
                                bgcolor: colors.primary[100],
                                border: `1px solid ${colors.primary[300]}`,
                                boxShadow: "0px 4px 15px rgba(0,0,0,0.03)",
                                transition: "all 0.2s ease-in-out",
                                display: "flex",
                                flexDirection: "column",
                                "&:hover": {
                                    borderColor: colors.secondary[400]
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", flex: 1 }}>

                                {/* HEADER: Date & Priority */}
                                <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center" sx={{ mb: 2, justifyContent: "space-between" }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                        <Clock size={16} color={colors.secondary[400]} />
                                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.secondary[400] }}>
                                            {dayjs(appt.date).format("MMM DD, YYYY")} • {appt.slot}
                                        </Typography>
                                    </Stack>
                                    <Chip
                                        label={appt.priority || "Normal"}
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontWeight: 700,
                                            fontSize: "0.68rem",
                                            bgcolor: `${getPriorityColor(appt.priority)}20`,
                                            color: getPriorityColor(appt.priority),
                                            border: `1px solid ${getPriorityColor(appt.priority)}50`
                                        }}
                                    />
                                </Stack>

                                {/* DOCTOR INFO */}
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                    <Avatar src={appt.doctor?.image} sx={{ width: 44, height: 44, border: `1.5px solid ${colors.primary[400]}` }} />
                                    <Box>
                                        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: colors.white[900], fontFamily: "Atlanta, sans-serif" }}>
                                            {appt.doctor?.name || "Unknown Doctor"}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.75rem", color: colors.white[600] }}>
                                            {appt.doctor?.specialization || "Specialist"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* PATIENT INFO BOX */}
                                <Box sx={{ p: 1.5, borderRadius: "16px", bgcolor: colors.primary[200], border: `1px solid ${colors.primary[300]}`, mb: 2 }}>
                                    <Typography sx={{ fontSize: "0.8rem", color: colors.white[600], mb: 0.5 }}>
                                        Patient Details
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.9rem", color: colors.white[900], fontWeight: 700, mb: 0.2 }}>
                                        {appt.patient?.name || "Unknown Patient"}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.8rem", color: colors.white[800] }}>
                                        Contact: {appt.patient?.phone || "--"}
                                    </Typography>
                                </Box>

                                {/* CANCEL BUTTON */}
                                <Box sx={{ mt: "auto", pt: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<CalendarX size={16} />}
                                        disabled={cancellingId === appt.id}
                                        onClick={() => handleCancel(appt.id)}
                                        sx={{
                                            borderRadius: "12px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            height: 40,
                                            color: "#ef4444", 
                                            borderColor: "#ef444450", 
                                            "&:hover": {
                                                bgcolor: "#ef444415", 
                                                borderColor: "#ef4444"
                                            }
                                        }}
                                    >
                                        {cancellingId === appt.id ? "Cancelling..." : "Cancel Appointment"}
                                    </Button>
                                </Box>

                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Box sx={{ textAlign: "center", py: 10, bgcolor: colors.primary[100], borderRadius: "24px", border: `1px solid ${colors.primary[300]}` }}>
                    <CalendarX size={48} color={colors.primary[400]} style={{ marginBottom: "16px" }} />
                    <Typography variant="h5" sx={{ color: colors.white[700], fontWeight: 600 }}>
                        No upcoming appointments.
                    </Typography>
                    <Typography sx={{ color: colors.white[500], mt: 1 }}>
                        {searchTerm ? "Try adjusting your search criteria." : "All future schedules are completely clear."}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}