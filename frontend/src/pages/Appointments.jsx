import { useMemo, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    useTheme,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

import { tokens } from "../theme/theme";

import {
    LocalizationProvider,
    DateCalendar,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { getDoctors, addPatient, bookAppointment, getAppointments } from "../api/api";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const FALLBACK_SLOTS = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "03:00 PM", "03:30 PM"];

const steps = [
    "Patient Details",
    "Schedule Appointment",
    "Confirmation",
];

export default function Appointments() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [doctorsList, setDoctorsList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [allAppointments, setAllAppointments] = useState([]);

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedSlot, setSelectedSlot] = useState("");
    const [patientData, setPatientData] = useState({
        name: "", phone: "", age: "", gender: "", priority: "", bloodGroup: "", conditions: "", symptoms: "",
    });

    const [step0Error, setStep0Error] = useState(false);
    const [step1Error, setStep1Error] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- NEW: Snackbar Alert State ---
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error", // 'error' | 'warning' | 'info' | 'success'
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const docRes = await getDoctors();
                const docs = docRes.data?.data || [];
                setDoctorsList(docs);
                if (docs.length > 0) setSelectedDoctor(docs[0]);

                const apptRes = await getAppointments();
                setAllAppointments(apptRes.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch initial backend data:", error);
                setSnackbar({ open: true, message: "Failed to connect to the server.", severity: "error" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const doctorSlots = useMemo(() => {
        return selectedDoctor?.availableSlots?.length > 0 ? selectedDoctor.availableSlots : FALLBACK_SLOTS;
    }, [selectedDoctor]);

    const currentBookedSlots = useMemo(() => {
        if (!selectedDoctor || !selectedDate) return [];
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        return allAppointments
            .filter(a => a.doctorId === selectedDoctor.id && a.date === formattedDate && a.status !== "cancelled")
            .map(a => a.slot);
    }, [allAppointments, selectedDoctor, selectedDate]);

    const handleNextStep0 = () => {
        const { name, phone, age, gender, priority, bloodGroup, symptoms } = patientData;
        if (!name || !phone || !age || !gender || !priority || !bloodGroup || !symptoms) {
            setStep0Error(true);
            // Trigger Error Alert
            setSnackbar({ open: true, message: "Please fill in all required patient details.", severity: "error" });
            return;
        }
        setStep0Error(false);
        setActiveStep(1);
    };

    const handleConfirmAppointment = async () => {
        if (!selectedSlot) {
            setStep1Error(true);
            // Trigger Warning Alert
            setSnackbar({ open: true, message: "Please select an available time slot.", severity: "warning" });
            return;
        }
        setStep1Error(false);
        setIsSubmitting(true);

        try {
            const patientRes = await addPatient({
                ...patientData,
                priority: patientData.priority || "Normal",
            });
            const patientId = patientRes.data.data.id;

            await bookAppointment({
                patientId,
                doctorId: selectedDoctor.id,
                date: selectedDate.format("YYYY-MM-DD"),
                slot: selectedSlot,
                priority: patientData.priority || "Normal",
                title: "Consultation",
            });

            const apptRes = await getAppointments();
            setAllAppointments(apptRes.data?.data || []);

            // Trigger Success Alert
            setSnackbar({ open: true, message: "Appointment booked successfully!", severity: "success" });
            setActiveStep(2);
        } catch (error) {
            console.error("Error booking appointment", error);
            // Trigger API Error Alert
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Failed to book appointment. Please try again.",
                severity: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prev) => prev - 1);
    };

    const fieldStyles = {
        "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: colors.primary[200], fontSize: "0.92rem", color: colors.white[900] },
        "& .MuiInputLabel-root": { color: colors.white[600], fontSize: "0.9rem" },
        "& .MuiInputLabel-root.Mui-focused:not(.Mui-error)": { color: colors.yellowAccent[500] },
        "& .MuiOutlinedInput-root:not(.Mui-error) .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary[300] },
        "& .MuiOutlinedInput-root:not(.Mui-error):hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.secondary[400] },
        "& .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": { borderColor: colors.secondary[500] },
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto", marginTop: "1.3rem", borderRadius: "32px", position: "relative" }}>

            {/* --- NEW: SNACKBAR COMPONENT --- */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: "12px", fontWeight: 600, fontFamily: "Atlanta, sans-serif" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* STEPPER */}
            <Card sx={{ mb: 3, borderRadius: "24px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[400]}`, boxShadow: "0px 7px 20px rgba(168, 163, 246, 0.25)" }}>
                <CardContent sx={{ p: 3 }}>
                    <Stepper activeStep={activeStep} sx={{
                        "& .MuiStepConnector-line": { borderColor: colors.primary[500], borderTopWidth: 2 },
                        "& .Mui-active .MuiStepConnector-line": { borderColor: colors.secondary[500] },
                        "& .Mui-completed .MuiStepConnector-line": { borderColor: colors.secondary[500] },
                        "& .MuiStepIcon-root": { color: colors.primary[500], fontSize: 30, transition: "0.2s ease" },
                        "& .MuiStepIcon-root.Mui-active": { color: colors.yellowAccent[500], filter: "drop-shadow(0 4px 10px rgba(168,163,246,0.45))" },
                        "& .MuiStepIcon-root.Mui-completed": { color: colors.secondary[500] },
                        "& .MuiStepIcon-text": { fill: "#fff", fontWeight: 700 },
                    }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel sx={{
                                    "& .MuiStepLabel-label": { fontFamily: "Raleway, sans-serif", fontWeight: 500, color: colors.white[500], mt: 0.5 },
                                    "& .MuiStepLabel-label.Mui-active": { color: colors.white[900], fontWeight: 700 },
                                    "& .MuiStepLabel-label.Mui-completed": { color: colors.white[800], fontWeight: 600 },
                                }}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* STEP 1: PATIENT DETAILS */}
            {activeStep === 0 && (
                <Box sx={{ display: "flex", gap: 2, width: "100%", height: "100%", overflow: "hidden" }}>
                    <Box sx={{ flex: 1.65, minWidth: 0, display: "flex" }}>
                        <Card sx={{ flex: 1, borderRadius: "28px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[400]}`, boxShadow: "none", overflow: "hidden" }}>
                            <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
                                <Typography variant="h4" sx={{ color: colors.white[900], fontWeight: 700, mb: 0.5 }}>Patient Information</Typography>

                                <Box sx={{ display: "grid", py: 2, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.6, alignContent: "start", flex: 1 }}>
                                    <TextField fullWidth size="small" label="Full Name" value={patientData.name} onChange={(e) => setPatientData({ ...patientData, name: e.target.value })} sx={fieldStyles} error={step0Error && !patientData.name} />
                                    <TextField fullWidth size="small" label="Phone Number" value={patientData.phone || ""} onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })} sx={fieldStyles} error={step0Error && !patientData.phone} />
                                    <TextField fullWidth size="small" label="Age" type="number" value={patientData.age} onChange={(e) => setPatientData({ ...patientData, age: e.target.value })} sx={fieldStyles} error={step0Error && !patientData.age} />
                                    <TextField select fullWidth size="small" label="Gender" value={patientData.gender} onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })} sx={fieldStyles} error={step0Error && !patientData.gender}>
                                        <MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                    <TextField select fullWidth size="small" label="Priority" value={patientData.priority || ""} onChange={(e) => setPatientData({ ...patientData, priority: e.target.value })} sx={fieldStyles} error={step0Error && !patientData.priority}>
                                        <MenuItem value="Normal">Normal</MenuItem><MenuItem value="Urgent">Urgent</MenuItem><MenuItem value="Emergency">Emergency</MenuItem>
                                    </TextField>
                                    <TextField select fullWidth size="small" label="Blood Group" value={patientData.bloodGroup || ""} onChange={(e) => setPatientData({ ...patientData, bloodGroup: e.target.value })} sx={fieldStyles} error={step0Error && !patientData.bloodGroup}>
                                        <MenuItem value="A+">A+</MenuItem><MenuItem value="A-">A-</MenuItem><MenuItem value="B+">B+</MenuItem><MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem><MenuItem value="O-">O-</MenuItem><MenuItem value="AB+">AB+</MenuItem><MenuItem value="AB-">AB-</MenuItem>
                                    </TextField>
                                    <Box sx={{ gridColumn: "1 / -1" }}>
                                        <TextField fullWidth size="small" label="Existing Conditions (Optional)" value={patientData.conditions || ""} onChange={(e) => setPatientData({ ...patientData, conditions: e.target.value })} sx={fieldStyles} />
                                    </Box>
                                    <Box sx={{ gridColumn: "1 / -1", flex: 1 }}>
                                        <TextField multiline minRows={3} fullWidth size="small" label="Symptoms / Problem" value={patientData.symptoms} onChange={(e) => setPatientData({ ...patientData, symptoms: e.target.value })} error={step0Error && !patientData.symptoms}
                                            sx={{ ...fieldStyles, "& .MuiOutlinedInput-root": { minHeight: "95px", alignItems: "flex-start", bgcolor: colors.primary[300], color: colors.white[800], fontFamily: "Atlanta, sans-serif" } }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* DOCTOR SELECTION */}
                    <Box sx={{ width: "360px", minWidth: "360px", display: "flex", flexDirection: "column", gap: 2 }}>
                        <Card sx={{ flex: 1, borderRadius: "28px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[300]}`, boxShadow: "none", overflow: "hidden" }}>
                            <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                                <Typography variant="h5" sx={{ mb: 2, color: colors.white[900], fontWeight: 700 }}>Our Specialists</Typography>
                                <Stack spacing={1.2} sx={{ flex: 1, overflowY: "auto", pr: 0.5, pt: 1 }}>
                                    {doctorsList.length > 0 ? doctorsList.map((doctor) => (
                                        <Box key={doctor.id} onClick={() => setSelectedDoctor(doctor)} sx={{ p: 1.2, borderRadius: "18px", bgcolor: selectedDoctor?.id === doctor.id ? colors.secondary[100] : colors.primary[200], border: selectedDoctor?.id === doctor.id ? `1px solid ${colors.secondary[400]}` : `1px solid ${colors.primary[300]}`, cursor: "pointer", transition: "0.2s ease", "&:hover": { transform: "translateY(-2px)" } }}>
                                            <Stack direction="row" spacing={1.2} alignItems="center">
                                                <Avatar src={doctor.image} sx={{ width: 46, height: 46 }} />
                                                <Box sx={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                    <Box flex={1}>
                                                        <Typography sx={{ fontWeight: 700, color: colors.white[900], fontSize: "0.88rem" }}>{doctor.name}</Typography>
                                                        <Typography sx={{ color: colors.white[700], fontSize: "0.75rem" }}>{doctor.specialization}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Chip label={`₹${doctor.fees}`} size="small" sx={{ mt: 0.7, height: 20, bgcolor: colors.secondary[500], color: "#fff", fontFamily: "Atlanta, sans-serif" }} />
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )) : (
                                        <Typography color={colors.white[500]}>No doctors found in database.</Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Button fullWidth variant="contained" onClick={handleNextStep0} disabled={!selectedDoctor} sx={{ height: 50, borderRadius: "16px", textTransform: "none", fontWeight: 700, color: colors.white[300], bgcolor: colors.secondary[500], "&:hover": { bgcolor: colors.secondary[600] } }}>
                            Continue
                        </Button>
                    </Box>
                </Box>
            )}

            {/* STEP 2: SCHEDULE APPOINTMENT */}
            {activeStep === 1 && (
                <Box sx={{ display: "flex", gap: 2, width: "100%", height: "100%", overflow: "hidden" }}>
                    <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
                        <Card sx={{ flex: 1, borderRadius: "28px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[400]}`, boxShadow: "none", overflow: "hidden" }}>
                            <CardContent sx={{ height: "100%", p: 3, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h4" sx={{ mb: 2, color: colors.white[900], fontFamily: "Atlanta, sans-serif", fontWeight: 700, letterSpacing: "1px" }}>Choose Date</Typography>
                                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderTop: `1.4px solid ${colors.primary[400]}`, "& *": { fontFamily: "Atlanta, sans-serif !important" } }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar disablePast value={selectedDate} onChange={(newValue) => { setSelectedDate(newValue); setSelectedSlot(""); setStep1Error(false); }} sx={{ width: "100%", maxWidth: "100%", "& .MuiPickersDay-root": { fontSize: "0.92rem", fontWeight: 600, color: colors.white[800], "&:hover": { backgroundColor: colors.primary[300] } }, "& .Mui-selected": { backgroundColor: theme.palette.mode === "dark" ? colors.secondary[600] : colors.secondary[700], color: "#fff !important", "&:hover": { backgroundColor: theme.palette.mode === "dark" ? colors.secondary[500] : colors.secondary[800] } }, "& .MuiPickersDay-today": { border: `1.5px solid ${colors.secondary[500]}` }, "& .MuiDayCalendar-weekDayLabel": { color: colors.white[700], fontWeight: 700 }, "& .MuiPickersCalendarHeader-label": { color: colors.white[900], fontWeight: 700 }, "& .MuiSvgIcon-root": { color: colors.white[800] } }} />
                                    </LocalizationProvider>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Card sx={{ flex: 1, borderRadius: "28px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[400]}`, boxShadow: "none", overflow: "hidden" }}>
                            <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                                <Typography variant="h4" sx={{ mb: 2, color: colors.white[900], fontFamily: "Atlanta, sans-serif", fontWeight: 700, letterSpacing: "1px" }}>Available Slots</Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, pt: "15px", alignContent: "flex-start", alignItems: "center", borderTop: `1.4px solid ${colors.primary[400]}` }}>
                                    {doctorSlots.length > 0 ? doctorSlots.map((slot) => {
                                        const booked = currentBookedSlots.includes(slot);
                                        return (
                                            <Box key={slot} sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1.5 }}>
                                                <Button disabled={booked} onClick={() => { setSelectedSlot(slot); setStep1Error(false); }} sx={{ width: "100%", height: 52, borderRadius: "16px", textTransform: "none", fontFamily: "Atlanta, sans-serif", fontSize: "0.92rem", fontWeight: 600, bgcolor: selectedSlot === slot ? colors.secondary[500] : colors.primary[400], color: selectedSlot === slot ? "#fff" : colors.white[900], border: `1px solid ${selectedSlot === slot ? colors.secondary[400] : colors.primary[300]}`, opacity: booked ? 0.45 : 1, transition: "0.2s ease", "&:hover": { bgcolor: selectedSlot === slot ? colors.secondary[600] : colors.primary[300], transform: "translateY(-2px)" } }}>
                                                    {slot}
                                                </Button>
                                            </Box>
                                        );
                                    }) : (
                                        <Typography sx={{ color: colors.white[600] }}>No slots available.</Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                        <Card sx={{ borderRadius: "28px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[400]}`, boxShadow: "none" }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" spacing={2}>
                                    <Button fullWidth variant="outlined" onClick={handleBack} disabled={isSubmitting} sx={{ height: 50, borderRadius: "16px", textTransform: "none", fontFamily: "Atlanta, sans-serif", border: `1.4px solid ${colors.secondary[300]}`, letterSpacing: "0.5px", color: colors.white[800], px: 3, "&:hover": { borderColor: colors.secondary[500] } }}>Back</Button>
                                    <Button fullWidth variant="contained" disabled={isSubmitting} onClick={handleConfirmAppointment} sx={{ height: 50, borderRadius: "16px", textTransform: "none", fontWeight: 700, fontFamily: "Atlanta, sans-serif", color: colors.white[300], bgcolor: colors.secondary[500], "&:hover": { bgcolor: colors.secondary[600] } }}>
                                        {isSubmitting ? "Booking..." : "Confirm Appointment"}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            {/* STEP 3: CONFIRMATION */}
            {activeStep === 2 && (
                <Card sx={{ borderRadius: "28px", bgcolor: colors.primary[100], border: `1px solid ${colors.primary[300]}`, boxShadow: "none", overflow: "hidden" }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box>
                                <Typography variant="h3" sx={{ color: colors.white[900], fontWeight: 800, mb: 0.5 }}>Appointment Confirmed</Typography>
                                <Typography sx={{ color: colors.white[700], fontSize: "0.95rem" }}>Your appointment receipt has been generated successfully.</Typography>
                            </Box>

                            <Card id="receipt-download" sx={{ borderRadius: "24px", bgcolor: colors.primary[200], border: `1.2px solid ${colors.primary[400]}`, overflow: "hidden", fontFamily: "Atlanta, sans-serif" }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, gap: 3 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "0.08em", color: colors.white[900] }}>MEDICAL RECEIPT</Typography>
                                            <Typography sx={{ mt: 1, color: colors.white[600], fontSize: "0.9rem" }}>Fauget Hospital • Digital Consultation</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography sx={{ color: colors.secondary[400], fontWeight: 700, fontSize: "1.1rem" }}>#{Math.floor(Math.random() * 100000)}</Typography>
                                            <Typography sx={{ color: colors.white[700], fontSize: "0.85rem" }}>{selectedDate.format("DD MMM YYYY")}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
                                        <Box sx={{ flex: 1, minWidth: "260px", p: 2.5, borderRadius: "20px", bgcolor: colors.primary[100], border: `1.2px solid ${colors.primary[400]}` }}>
                                            <Typography sx={{ mb: 2, color: colors.secondary[400], fontWeight: 700, textTransform: "uppercase", fontSize: "0.82rem", letterSpacing: "0.08em" }}>Patient Information</Typography>
                                            <Stack spacing={1}>
                                                <Typography sx={{ color: colors.white[900], fontWeight: 700 }}>{patientData.name}</Typography>
                                                <Typography sx={{ color: colors.white[700] }}>Age: {patientData.age}</Typography>
                                                <Typography sx={{ color: colors.white[700] }}>Gender: {patientData.gender}</Typography>
                                            </Stack>
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: "260px", p: 2.5, borderRadius: "20px", bgcolor: colors.primary[100], border: `1.2px solid ${colors.primary[400]}` }}>
                                            <Typography sx={{ mb: 2, color: colors.secondary[400], fontWeight: 700, textTransform: "uppercase", fontSize: "0.82rem", letterSpacing: "0.08em" }}>Doctor Information</Typography>
                                            <Stack spacing={1}>
                                                <Typography sx={{ color: colors.white[900], fontWeight: 700 }}>{selectedDoctor?.name}</Typography>
                                                <Typography sx={{ color: colors.white[700] }}>{selectedDoctor?.specialization}</Typography>
                                                <Typography sx={{ color: colors.white[700] }}>Slot: {selectedSlot}</Typography>
                                            </Stack>
                                        </Box>
                                    </Box>

                                    <Box sx={{ borderRadius: "20px", overflow: "hidden", border: `1.2px solid ${colors.primary[400]}` }}>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", bgcolor: colors.primary[100], p: 2 }}>
                                            <Typography sx={{ color: colors.white[800], fontWeight: 700 }}>Service</Typography><Typography sx={{ color: colors.white[800], fontWeight: 700 }}>Date</Typography><Typography sx={{ color: colors.white[800], fontWeight: 700, textAlign: "right" }}>Amount</Typography>
                                        </Box>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", p: 2, borderTop: `1px solid ${colors.primary[300]}` }}>
                                            <Typography sx={{ color: colors.white[900] }}>Consultation</Typography><Typography sx={{ color: colors.white[700] }}>{selectedDate.format("DD MMM YYYY")}</Typography><Typography sx={{ color: colors.white[900], textAlign: "right", fontWeight: 700 }}>₹{selectedDoctor?.fees}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" onClick={() => { setActiveStep(0); setPatientData({ ...patientData, name: "", phone: "", age: "", gender: "", priority: "", bloodGroup: "", conditions: "", symptoms: "" }); setSelectedSlot(""); }} sx={{ borderRadius: "14px", textTransform: "none", border: `1.4px solid ${colors.secondary[300]}`, color: colors.white[800], px: 3, "&:hover": { borderColor: colors.secondary[500] } }}>Book Another</Button>
                                <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={() => { const el = document.querySelector("#receipt-download"); if (el) html2pdf().set({ margin: 0.5, filename: "receipt.pdf" }).from(el).save(); }} sx={{ borderRadius: "14px", textTransform: "none", fontWeight: 700, color: colors.white[200], bgcolor: colors.secondary[500], "&:hover": { bgcolor: colors.secondary[600] } }}>Download Receipt</Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}