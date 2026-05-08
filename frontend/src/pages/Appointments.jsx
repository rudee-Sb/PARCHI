import { useMemo, useState } from "react";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    useTheme,
    MenuItem,
} from "@mui/material";

import { tokens } from "../theme/theme";

import {
    LocalizationProvider,
    DateCalendar,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Ahmed",
        specialization: "Cardiologist",
        fees: 1200,
        image: "https://i.pravatar.cc/150?img=32",
    },
    {
        id: 2,
        name: "Dr. Raj Malhotra",
        specialization: "Dermatologist",
        fees: 900,
        image: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: 3,
        name: "Dr. Emily Carter",
        specialization: "Neurologist",
        fees: 1500,
        image: "https://i.pravatar.cc/150?img=48",
    },
    {
        id: 4,
        name: "Dr. Ram Mishra",
        specialization: "Physician",
        fees: 500,
        image: "https://i.pravatar.cc/150?img=18",
    },
];

const availableSlots = {
    1: [
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
    ],
    2: [
        "12:00 PM",
        "12:30 PM",
        "01:00 PM",
    ],
    3: [
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
    ],
    4: [
        "10:00 AM",
        "12:30 PM",
        "01:00 PM",
        "02:00 PM",
        "07:00 PM",
    ]
};

const bookedSlots = {
    1: ["10:30 AM"],
    2: ["12:30 PM"],
    3: ["03:30 PM"],
    4: ["10:30 AM", "11:00 AM"]
};

const steps = [
    "Patient Details",
    "Schedule Appointment",
    "Confirmation",
];

export default function Appointments() {
    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const [activeStep, setActiveStep] = useState(0);

    const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [selectedSlot, setSelectedSlot] = useState("");

    const [patientData, setPatientData] = useState({
        name: "",
        age: "",
        gender: "",
        symptoms: "",
    });

    const doctorSlots = useMemo(() => {
        return availableSlots[selectedDoctor.id] || [];
    }, [selectedDoctor]);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const fieldStyles = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            bgcolor: colors.primary[200],
            fontSize: "0.92rem",
            color: colors.white[900],
        },

        "& .MuiInputLabel-root": {
            color: colors.white[600],
            fontSize: "0.9rem",
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: colors.yellowAccent[500],
        },

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primary[300],
        },

        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
        {
            borderColor: colors.secondary[400],
        },

        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
        {
            borderColor: colors.secondary[500],
        },
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1600px",
                mx: "auto",
                marginTop: "1.3rem",
                // bgcolor: colors.primary[200],
                borderRadius: "32px",
            }}
        >
            {/* STEPPER */}
            <Card
                sx={{
                    mb: 3,
                    borderRadius: "24px",
                    bgcolor: colors.primary[100],
                    border: `1px solid ${colors.primary[400]}`,
                    boxShadow: "0px 7px 20px rgba(168, 163, 246, 0.25)",
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            "& .MuiStepConnector-line": {
                                borderColor: colors.primary[500],
                                borderTopWidth: 2,
                            },

                            "& .Mui-active .MuiStepConnector-line": {
                                borderColor: colors.secondary[500],
                            },

                            "& .Mui-completed .MuiStepConnector-line": {
                                borderColor: colors.secondary[500],
                            },

                            "& .MuiStepIcon-root": {
                                color: colors.primary[500],
                                fontSize: 30,
                                transition: "0.2s ease",
                            },

                            "& .MuiStepIcon-root.Mui-active": {
                                color: colors.yellowAccent[500],

                                filter:
                                    "drop-shadow(0 4px 10px rgba(168,163,246,0.45))",
                            },

                            "& .MuiStepIcon-root.Mui-completed": {
                                color: colors.secondary[500],
                            },

                            "& .MuiStepIcon-text": {
                                fill: "#fff",
                                fontWeight: 700,
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel
                                    sx={{
                                        "& .MuiStepLabel-label": {
                                            fontFamily:
                                                "Raleway, sans-serif",

                                            fontWeight: 500,

                                            color:
                                                colors.white[500],

                                            mt: 0.5,
                                        },

                                        "& .MuiStepLabel-label.Mui-active":
                                        {
                                            color:
                                                colors.white[900],

                                            fontWeight: 700,
                                        },

                                        "& .MuiStepLabel-label.Mui-completed":
                                        {
                                            color:
                                                colors.white[800],

                                            fontWeight: 600,
                                        },
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* STEP 1 */}
            {
                activeStep === 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        {/* LEFT FORM */}
                        <Box
                            sx={{
                                flex: 1.65,
                                minWidth: 0,
                                display: "flex",
                                // boxShadow: "0px 7px 20px rgba(168, 163, 246, 0.25)",
                            }}
                        >
                            <Card
                                sx={{
                                    flex: 1,
                                    borderRadius: "28px",
                                    bgcolor: colors.primary[100],
                                    border: `1px solid ${colors.primary[400]}`,
                                    boxShadow: "none",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 2.5,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: colors.white[900],
                                            fontWeight: 700,
                                            mb: 0.5,
                                        }}
                                    >
                                        Patient Information
                                    </Typography>

                                    {/* FORM */}
                                    <Box
                                        sx={{
                                            display: "grid",
                                            py: 2,
                                            gridTemplateColumns:
                                                "repeat(2, minmax(0, 1fr))",
                                            gap: 1.6,
                                            alignContent: "start",
                                            flex: 1,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Full Name"
                                            value={patientData.name}
                                            onChange={(e) =>
                                                setPatientData({
                                                    ...patientData,
                                                    name: e.target.value,
                                                })
                                            }
                                            sx={fieldStyles}
                                        />

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Phone Number"
                                            value={patientData.phone || ""}
                                            onChange={(e) =>
                                                setPatientData({
                                                    ...patientData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            sx={fieldStyles}
                                        />

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Age"
                                            value={patientData.age}
                                            onChange={(e) =>
                                                setPatientData({
                                                    ...patientData,
                                                    age: e.target.value,
                                                })
                                            }
                                            sx={fieldStyles}
                                        />

                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Gender"
                                            value={patientData.gender}
                                            onChange={(e) =>
                                                setPatientData({
                                                    ...patientData,
                                                    gender: e.target.value,
                                                })
                                            }
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="Male">
                                                Male
                                            </MenuItem>

                                            <MenuItem value="Female">
                                                Female
                                            </MenuItem>

                                            <MenuItem value="Other">
                                                Other
                                            </MenuItem>
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Priority"
                                            value={patientData.priority || ""}
                                            onChange={(e) =>
                                                setPatientData({
                                                    ...patientData,
                                                    priority: e.target.value,
                                                })
                                            }
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="Normal">
                                                Normal
                                            </MenuItem>

                                            <MenuItem value="Urgent">
                                                Urgent
                                            </MenuItem>

                                            <MenuItem value="Emergency">
                                                Emergency
                                            </MenuItem>
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Blood Group"
                                            value={patientData.bloodGroup || ""}
                                            onChange={(e) =>
                                                setPatientData({
                                                    ...patientData,
                                                    bloodGroup: e.target.value,
                                                })
                                            }
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="A+">A+</MenuItem>
                                            <MenuItem value="B+">B+</MenuItem>
                                            <MenuItem value="O+">O+</MenuItem>
                                            <MenuItem value="AB+">AB+</MenuItem>
                                        </TextField>

                                        {/* FULL WIDTH */}
                                        <Box
                                            sx={{
                                                gridColumn: "1 / -1",
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Existing Conditions"
                                                value={
                                                    patientData.conditions || ""
                                                }
                                                onChange={(e) =>
                                                    setPatientData({
                                                        ...patientData,
                                                        conditions:
                                                            e.target.value,
                                                    })
                                                }
                                                sx={fieldStyles}
                                            />
                                        </Box>

                                        <Box
                                            sx={{
                                                gridColumn: "1 / -1",
                                                flex: 1,
                                            }}
                                        >
                                            <TextField
                                                multiline
                                                minRows={3}
                                                fullWidth
                                                size="small"
                                                label="Symptoms / Problem"
                                                value={patientData.symptoms}
                                                onChange={(e) =>
                                                    setPatientData({
                                                        ...patientData,
                                                        symptoms:
                                                            e.target.value,
                                                    })
                                                }
                                                sx={{
                                                    ...fieldStyles,

                                                    "& .MuiOutlinedInput-root":
                                                    {
                                                        minHeight: "95px",
                                                        alignItems: "flex-start",
                                                        bgcolor: colors.primary[300],
                                                        color: colors.white[800],
                                                        fontFamily: "Atlanta, sans-serif",
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* RIGHT DOCTORS */}
                        <Box
                            sx={{
                                width: "360px",
                                minWidth: "360px",
                                display: "flex",
                            }}
                        >
                            <Card
                                sx={{
                                    flex: 1,
                                    borderRadius: "28px",
                                    bgcolor: colors.primary[100],
                                    border: `1px solid ${colors.primary[300]}`,
                                    boxShadow: "none",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 2,
                                            color: colors.white[900],
                                            fontWeight: 700,
                                        }}
                                    >
                                        Our Specialists
                                    </Typography>

                                    <Stack
                                        spacing={1.2}
                                        sx={{
                                            flex: 1,
                                            overflowY: "auto",
                                            pr: 0.5,
                                            pt: 1,
                                        }}
                                    >
                                        {doctors.map((doctor) => (
                                            <Box
                                                key={doctor.id}
                                                onClick={() =>
                                                    setSelectedDoctor(doctor)
                                                }
                                                sx={{
                                                    p: 1.2,
                                                    borderRadius: "18px",

                                                    bgcolor:
                                                        selectedDoctor.id ===
                                                            doctor.id
                                                            ? colors.secondary[100]
                                                            : colors.primary[200],

                                                    border:
                                                        selectedDoctor.id ===
                                                            doctor.id
                                                            ? `1px solid ${colors.secondary[400]}`
                                                            : `1px solid ${colors.primary[300]}`,

                                                    cursor: "pointer",
                                                    transition: "0.2s ease",

                                                    "&:hover": {
                                                        transform:
                                                            "translateY(-2px)",
                                                    },
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1.2}
                                                    alignItems="center"
                                                >
                                                    <Avatar
                                                        src={doctor.image}
                                                        sx={{
                                                            width: 46,
                                                            height: 46,
                                                        }}
                                                    />

                                                    <Box
                                                        sx={{
                                                            flex: 1,
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <Box flex={1}>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color:
                                                                        colors.white[900],
                                                                    fontSize: "0.88rem",
                                                                }}
                                                            >
                                                                {doctor.name}
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    color:
                                                                        colors.white[700],
                                                                    fontSize: "0.75rem",
                                                                }}
                                                            >
                                                                {
                                                                    doctor.specialization
                                                                }
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Chip
                                                                label={`₹${doctor.fees}`}
                                                                size="small"
                                                                sx={{
                                                                    mt: 0.7,
                                                                    height: 20,
                                                                    bgcolor:
                                                                        colors.secondary[500],
                                                                    color: "#fff",
                                                                    fontFamily: "Atlanata, sans-serif"
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{
                                            mt: 2,
                                            height: 46,
                                            borderRadius: "14px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            color: colors.white[300],
                                            bgcolor:
                                                colors.secondary[500],

                                            "&:hover": {
                                                bgcolor:
                                                    colors.secondary[600],
                                            },
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box >
                )
            }

            {/* STEP 2 */}
            {
                activeStep === 1 && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        {/* LEFT CALENDAR */}
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                display: "flex",
                            }}
                        >
                            <Card
                                sx={{
                                    flex: 1,
                                    borderRadius: "28px",
                                    bgcolor: colors.primary[100],
                                    border: `1px solid ${colors.primary[400]}`,
                                    boxShadow: "none",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        height: "100%",
                                        p: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 2,
                                            color: colors.white[900],
                                            fontFamily: "Atlanta, sans-serif",
                                            fontWeight: 700,
                                            letterSpacing: "1px",
                                            // borderBottom: `1.4px solid ${colors.primary[400]}`
                                        }}
                                    >
                                        Choose Date
                                    </Typography>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderTop: `1.4px solid ${colors.primary[400]}`,

                                            "& *": {
                                                fontFamily:
                                                    "Atlanta, sans-serif !important",
                                            },
                                        }}
                                    >
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DateCalendar
                                                value={selectedDate}
                                                onChange={(newValue) =>
                                                    setSelectedDate(newValue)
                                                }
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* RIGHT SIDE */}
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {/* SLOT BOX */}
                            <Card
                                sx={{
                                    flex: 1,
                                    borderRadius: "28px",
                                    bgcolor: colors.primary[100],
                                    border: `1px solid ${colors.primary[400]}`,
                                    boxShadow: "none",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 3,
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 2,
                                            color: colors.white[900],
                                            fontFamily: "Atlanta, sans-serif",
                                            fontWeight: 700,
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        Available Slots
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1.5,
                                            pt: "15px",
                                            alignContent: "flex-start",
                                            alignItems: "center",
                                            borderTop: `1.4px solid ${colors.primary[400]}`,
                                        }}
                                    >
                                        {doctorSlots.map((slot) => {
                                            const booked =
                                                bookedSlots[
                                                    selectedDoctor.id
                                                ]?.includes(slot);

                                            return (
                                                <Box
                                                    sx={{
                                                        display: "grid",
                                                        gridTemplateColumns:
                                                            "repeat(auto-fit, minmax(140px, 1fr))",
                                                        gap: 1.5,
                                                    }}
                                                >
                                                    <Button
                                                        key={slot}
                                                        disabled={booked}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        sx={{
                                                            width: "100%",
                                                            height: 52,

                                                            borderRadius: "16px",
                                                            textTransform: "none",

                                                            fontFamily: "Atlanta, sans-serif",
                                                            fontSize: "0.92rem",
                                                            fontWeight: 600,

                                                            bgcolor:
                                                                selectedSlot === slot
                                                                    ? colors.secondary[500]
                                                                    : colors.primary[400],

                                                            color:
                                                                selectedSlot === slot
                                                                    ? "#fff"
                                                                    : colors.white[900],

                                                            border: `1px solid ${colors.primary[300]}`,

                                                            opacity: booked ? 0.45 : 1,

                                                            transition: "0.2s ease",

                                                            "&:hover": {
                                                                bgcolor:
                                                                    selectedSlot === slot
                                                                        ? colors.secondary[600]
                                                                        : colors.primary[300],

                                                                transform: "translateY(-2px)",
                                                            },
                                                        }}
                                                    >
                                                        {slot}
                                                    </Button>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* BUTTON BOX */}
                            <Card
                                sx={{
                                    borderRadius: "28px",
                                    bgcolor: colors.primary[100],
                                    border: `1px solid ${colors.primary[400]}`,
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 2.5,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={handleBack}
                                            sx={{
                                                height: 50,
                                                borderRadius: "16px",
                                                textTransform: "none",

                                                fontFamily:
                                                    "Atlanta, sans-serif",

                                                border: `1.4px solid ${colors.primary[500]}`,
                                                letterSpacing: "0.5px",
                                                color: colors.white[800],

                                                "&:hover": {
                                                    borderColor:
                                                        colors.secondary[500],
                                                },
                                            }}
                                        >
                                            Back
                                        </Button>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{
                                                height: 50,
                                                borderRadius: "16px",
                                                textTransform: "none",
                                                fontWeight: 700,

                                                fontFamily:
                                                    "Atlanta, sans-serif",
                                                color: colors.white[300],
                                                bgcolor:
                                                    colors.secondary[500],

                                                "&:hover": {
                                                    bgcolor:
                                                        colors.secondary[600],
                                                },
                                            }}
                                        >
                                            Confirm Appointment
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                )
            }

            {/* STEP 3 */}
            {
                activeStep === 2 && (
                    <Card
                        sx={{
                            borderRadius: "28px",
                            bgcolor: colors.primary[100],
                            border: `1px solid ${colors.primary[300]}`,
                            boxShadow: "none",
                            overflow: "hidden",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                                }}
                            >
                                {/* HEADER */}
                                <Box>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: colors.white[900],
                                            fontWeight: 800,
                                            mb: 0.5,
                                        }}
                                    >
                                        Appointment Confirmed
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: colors.white[700],
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        Your appointment receipt has been generated successfully.
                                    </Typography>
                                </Box>

                                {/* RECEIPT */}
                                <Card
                                    id="receipt-download"
                                    sx={{
                                        borderRadius: "24px",
                                        bgcolor: colors.primary[200],
                                        border: `1.2px solid ${colors.primary[400]}`,
                                        overflow: "hidden",
                                        fontFamily: "Atlanta, sans-serif"
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 4,
                                        }}
                                    >
                                        {/* TOP */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: 4,
                                                gap: 3,
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "2rem",
                                                        fontWeight: 900,
                                                        letterSpacing: "0.08em",
                                                        color: colors.white[900],
                                                    }}
                                                >
                                                    MEDICAL RECEIPT
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 1,
                                                        color: colors.white[600],
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    Fauget Hospital • Digital Consultation Receipt
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    textAlign: "right",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: colors.secondary[400],
                                                        fontWeight: 700,
                                                        fontSize: "1.1rem",
                                                    }}
                                                >
                                                    #{Math.floor(
                                                        Math.random() * 100000
                                                    )}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: colors.white[700],
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    {selectedDate.format(
                                                        "DD MMM YYYY"
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* INFO */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 3,
                                                flexWrap: "wrap",
                                                mb: 4,
                                            }}
                                        >
                                            {/* PATIENT */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: "260px",
                                                    p: 2.5,
                                                    borderRadius: "20px",
                                                    bgcolor: colors.primary[100],
                                                    border: `1.2px solid ${colors.primary[400]}`,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        mb: 2,
                                                        color: colors.secondary[400],
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        fontSize: "0.82rem",
                                                        letterSpacing: "0.08em",
                                                    }}
                                                >
                                                    Patient Information
                                                </Typography>

                                                <Stack spacing={1}>
                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[900],
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {patientData.name ||
                                                            "Unknown Patient"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[700],
                                                        }}
                                                    >
                                                        Age:{" "}
                                                        {patientData.age ||
                                                            "--"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[700],
                                                        }}
                                                    >
                                                        Gender:{" "}
                                                        {patientData.gender ||
                                                            "--"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[700],
                                                        }}
                                                    >
                                                        Blood Group:{" "}
                                                        {patientData.bloodGroup ||
                                                            "--"}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            {/* DOCTOR */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: "260px",
                                                    p: 2.5,
                                                    borderRadius: "20px",
                                                    bgcolor: colors.primary[100],
                                                    border: `1.2px solid ${colors.primary[400]}`,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        mb: 2,
                                                        color: colors.secondary[400],
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        fontSize: "0.82rem",
                                                        letterSpacing: "0.08em",
                                                    }}
                                                >
                                                    Doctor Information
                                                </Typography>

                                                <Stack spacing={1}>
                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[900],
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {selectedDoctor.name}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[700],
                                                        }}
                                                    >
                                                        {
                                                            selectedDoctor.specialization
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[700],
                                                        }}
                                                    >
                                                        Consultation Slot:{" "}
                                                        {selectedSlot}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                colors.white[700],
                                                        }}
                                                    >
                                                        Priority:{" "}
                                                        {patientData.priority ||
                                                            "Normal"}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>

                                        {/* BILLING */}
                                        <Box
                                            sx={{
                                                borderRadius: "20px",
                                                overflow: "hidden",
                                                border: `1.2px solid ${colors.primary[400]}`,
                                            }}
                                        >
                                            {/* HEADER */}
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "2fr 1fr 1fr",
                                                    bgcolor:
                                                        colors.primary[100],
                                                    p: 2,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[800],
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Service
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[800],
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Date
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[800],
                                                        fontWeight: 700,
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    Amount
                                                </Typography>
                                            </Box>

                                            {/* ROW */}
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "2fr 1fr 1fr",
                                                    p: 2,
                                                    borderTop: `1px solid ${colors.primary[300]}`,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[900],
                                                    }}
                                                >
                                                    Specialist Consultation
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[700],
                                                    }}
                                                >
                                                    {selectedDate.format(
                                                        "DD MMM YYYY"
                                                    )}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[900],
                                                        textAlign: "right",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    ₹{selectedDoctor.fees}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* FOOTER */}
                                        <Box
                                            sx={{
                                                mt: 4,
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                flexWrap: "wrap",
                                                gap: 2,
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[600],
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    Notes
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[800],
                                                        mt: 0.5,
                                                        maxWidth: "420px",
                                                        lineHeight: 1.7,
                                                    }}
                                                >
                                                    Please arrive 15 minutes before your consultation.
                                                    Carry previous prescriptions and reports if applicable.
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    textAlign: "right",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.white[700],
                                                    }}
                                                >
                                                    Consultation Fee
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            colors.secondary[400],
                                                        fontSize: "1.8rem",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    ₹{selectedDoctor.fees}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* ACTIONS */}
                                <Stack
                                    direction="row"
                                    spacing={2}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                        sx={{
                                            borderRadius: "14px",
                                            textTransform: "none",
                                            border: `1.4px solid ${colors.secondary[300]}`,
                                            color: colors.white[800],
                                            px: 3,
                                        }}
                                    >
                                        Edit Details
                                    </Button>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <DownloadRoundedIcon />
                                        }
                                        onClick={() => {
                                            const receiptContent =
                                                document.querySelector(
                                                    "#receipt-download"
                                                )?.innerHTML;

                                            const blob = new Blob(
                                                [
                                                    `
                                    <html>
                                        <head>
                                            <title>Medical Receipt</title>
                                        </head>
                                        <body style="font-family:sans-serif;padding:40px;background:#111;color:white;">
                                            ${receiptContent}
                                        </body>
                                    </html>
                                `,
                                                ],
                                                {
                                                    type: "text/html",
                                                }
                                            );

                                            const link =
                                                document.createElement(
                                                    "a"
                                                );

                                            link.href =
                                                URL.createObjectURL(
                                                    blob
                                                );

                                            link.download =
                                                "medical-receipt.html";

                                            link.click();
                                        }}
                                        sx={{
                                            borderRadius: "14px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            color: colors.white[200],
                                            bgcolor:
                                                colors.secondary[500],

                                            "&:hover": {
                                                bgcolor:
                                                    colors.secondary[600],
                                            },
                                        }}
                                    >
                                        Download Receipt
                                    </Button>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                )
            }
        </Box >
    );
}