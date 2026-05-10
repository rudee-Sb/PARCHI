import { useMemo, useState, useEffect } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    IconButton,
    Stack,
    Typography,
    useTheme,
    CircularProgress
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Make sure getAppointments is exported in your api/api.js file!
import { getAppointments } from "../api/api";
import { tokens } from "../theme/theme";

// --- Date Utility Helpers ---
const getStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
};

const getStartOfWeek = (date) => {
    const d = getStartOfDay(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

// --- Time Utilities ---
const timeSlots = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

// Helper to convert backend string "10:30 AM" to the numerical index your grid expects (where 8 AM = 0)
const convertSlotToGridIndex = (slotString) => {
    if (!slotString) return 0;

    // Quick parse: "10:30 AM" -> hour: 10, modifier: "AM"
    const parts = slotString.split(" ");
    if (parts.length !== 2) return 0;

    const timeParts = parts[0].split(":");
    let hour = parseInt(timeParts[0], 10);
    const modifier = parts[1].toUpperCase();

    // Convert to 24 hour clock format
    if (hour === 12 && modifier === "AM") hour = 0;
    if (hour !== 12 && modifier === "PM") hour += 12;

    // Grid starts at 8 AM (index 0)
    let gridIndex = hour - 8;

    // Add 0.5 if it's a 30-minute increment so it floats halfway down the cell
    if (timeParts[1] === "30") {
        gridIndex += 0.5;
    }

    // Clamp to boundaries to prevent cards flying off screen
    if (gridIndex < 0) return 0;
    if (gridIndex > timeSlots.length - 1) return timeSlots.length - 1;

    return gridIndex;
};


export default function Schedule() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [scheduleCards, setScheduleCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [view, setView] = useState("week");
    const today = useMemo(() => getStartOfDay(new Date()), []);
    const [currentDate, setCurrentDate] = useState(today);

    const gridHeight = 95; // Card height logic relies on this

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            try {
                const res = await getAppointments();
                const appointments = res.data?.data || [];

                // Map the raw JSON backend data to the UI format required by your grid
                const mapped = appointments
                    .filter(a => a.status !== "cancelled") // Don't show cancelled ones
                    .map((a) => ({
                        id: a.id,
                        title: a.title || "Consultation",
                        doctor: a.doctor?.name || "Dr. Unassigned",
                        date: a.date,
                        start: convertSlotToGridIndex(a.slot),
                        duration: 1, // You can make this dynamic if backend provides end times
                        avatars: a.patient?.gender === "Female"
                            ? ["https://i.pravatar.cc/150?img=5"]
                            : ["https://i.pravatar.cc/150?img=11"],
                    }));

                setScheduleCards(mapped);
            } catch (error) {
                console.error("Failed to fetch schedule data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const visibleDays = useMemo(() => {
        if (view === "day") {
            const d = getStartOfDay(currentDate);
            return [{
                short: d.toLocaleDateString("en-US", { weekday: "short" }),
                full: d.toLocaleDateString("en-US", { weekday: "long" }),
                date: d.getDate(),
                dateString: formatDate(d),
            }];
        } else {
            const startOfWeek = getStartOfWeek(currentDate);
            const days = [];
            for (let i = 0; i < 7; i++) {
                const d = addDays(startOfWeek, i);
                days.push({
                    short: d.toLocaleDateString("en-US", { weekday: "short" }),
                    full: d.toLocaleDateString("en-US", { weekday: "long" }),
                    date: d.getDate(),
                    dateString: formatDate(d),
                });
            }
            return days;
        }
    }, [view, currentDate]);

    const positionedCards = useMemo(() => {
        return scheduleCards
            .map((card) => {
                const columnIndex = visibleDays.findIndex(d => d.dateString === card.date);
                return { ...card, column: columnIndex };
            })
            .filter((card) => card.column !== -1); // Filter out cards not visible in current week/day
    }, [scheduleCards, visibleDays]);

    const handlePrev = () => setCurrentDate((prev) => addDays(prev, view === "week" ? -7 : -1));
    const handleNext = () => setCurrentDate((prev) => addDays(prev, view === "week" ? 7 : 1));
    const handleToday = () => setCurrentDate(today);

    const isPrevDisabled = useMemo(() => {
        if (view === "week") return getStartOfWeek(currentDate).getTime() <= getStartOfWeek(today).getTime();
        return getStartOfDay(currentDate).getTime() <= today.getTime();
    }, [currentDate, view, today]);

    const headerTitle = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box sx={{
            height: "100%", width: "100%", borderRadius: "30px", overflow: "hidden",
            bgcolor: colors.primary[100], border: `1px solid ${colors.primary[400]}`,
            display: "flex", flexDirection: "column",
        }}>
            {/* TOP HEADER */}
            <Box sx={{
                px: 3, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: `1px solid ${colors.primary[400]}`,
                background: theme.palette.mode === "dark" ? colors.primary[200] : "#f8fafc",
            }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: colors.white[900], width: "180px" }}>
                        {headerTitle}
                    </Typography>
                    <Button onClick={handleToday} sx={{
                        px: 2, borderRadius: "10px", textTransform: "none",
                        bgcolor: colors.yellowAccent[500], color: "#fff", fontWeight: 700,
                        "&:hover": { bgcolor: colors.yellowAccent[400] },
                    }}>Today</Button>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton onClick={handlePrev} disabled={isPrevDisabled} sx={{ bgcolor: isPrevDisabled ? colors.primary[200] : colors.primary[400] }}>
                            <ChevronLeft size={18} color={colors.white[800]} />
                        </IconButton>
                        <IconButton onClick={handleNext} sx={{ bgcolor: colors.primary[400] }}>
                            <ChevronRight size={18} color={colors.white[800]} />
                        </IconButton>
                    </Stack>
                </Stack>

                <Box sx={{ display: "flex", bgcolor: colors.primary[400], borderRadius: "14px", p: 0.5 }}>
                    {["week", "day"].map((item) => (
                        <Button key={item} onClick={() => setView(item)} sx={{
                            minWidth: 90, textTransform: "capitalize", borderRadius: "10px", fontWeight: 700,
                            color: view === item ? "#fff" : colors.white[700],
                            bgcolor: view === item ? colors.yellowAccent[500] : "transparent",
                        }}>{item}</Button>
                    ))}
                </Box>
            </Box>

            {/* CALENDAR BODY */}
            <Box sx={{
                flex: 1,
                display: "flex",
                overflowY: "auto",
                overflowX: "hidden"
            }}>

                {/* TIME COLUMN */}
                <Box sx={{
                    width: 80,
                    flexShrink: 0,
                    borderRight: `1px solid ${colors.primary[400]}`,
                    bgcolor: theme.palette.mode === "dark" ? colors.primary[200] : "#fcfcfd"
                }}>
                    <Box sx={{
                        height: 72,
                        borderBottom: `1px solid ${colors.primary[400]}`,
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        bgcolor: theme.palette.mode === "dark" ? colors.primary[200] : "#fcfcfd"
                    }} />

                    {timeSlots.map((time) => (
                        <Box key={time} sx={{ height: gridHeight, px: 1.5, borderBottom: `1px solid ${colors.primary[400]}` }}>
                            <Typography sx={{ mt: 1, fontSize: "0.82rem", fontWeight: 700, color: colors.white[600] }}>
                                {time}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
                    {/* DAY HEADERS */}
                    <Box sx={{
                        height: 72,
                        display: "grid",
                        gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
                        borderBottom: `1px solid ${colors.primary[400]}`,
                        background: theme.palette.mode === "dark" ? colors.primary[200] : "#f8fafc",
                        position: "sticky",
                        top: 0,
                        zIndex: 10
                    }}>
                        {visibleDays.map((day) => (
                            <Box key={day.dateString} sx={{
                                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                                borderRight: `1px solid ${colors.primary[400]}`,
                                bgcolor: day.dateString === formatDate(today) ? (theme.palette.mode === 'dark' ? colors.primary[300] : '#edf2f7') : "transparent",
                            }}>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: colors.white[600], textTransform: "uppercase" }}>{day.short}</Typography>
                                <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, color: colors.white[900] }}>{day.date}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* GRID BODY */}
                    <Box sx={{
                        position: "relative",
                        display: "grid",
                        gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`
                    }}>
                        {visibleDays.map((_, colIndex) => (
                            <Box key={colIndex} sx={{ borderRight: `1px solid ${colors.primary[400]}` }}>
                                {timeSlots.map((_, rowIndex) => (
                                    <Box key={rowIndex} sx={{ height: gridHeight, borderBottom: `1px solid ${colors.primary[400]}` }} />
                                ))}
                            </Box>
                        ))}

                        {/* APPOINTMENT CARDS */}
                        {positionedCards.map((card) => (
                            <Card
                                key={card.id}
                                sx={{
                                    position: "absolute",
                                    top: (card.start * gridHeight) + 6,
                                    left: `calc(${card.column} * (100% / ${visibleDays.length}) + 6px)`,
                                    width: `calc((100% / ${visibleDays.length}) - 12px)`,
                                    height: (card.duration * gridHeight) - 12,
                                    borderRadius: "18px",
                                    p: 1.5,
                                    bgcolor: theme.palette.mode === "dark" ? colors.primary[300] : "#ffffff",
                                    border: `1px solid ${colors.primary[400]}`,
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    zIndex: 2,
                                }}
                            >
                                <Box sx={{ flex: 1, overflow: "hidden" }}>
                                    <Typography noWrap sx={{
                                        fontSize: "0.85rem", fontWeight: 800, color: colors.white[900],
                                        lineHeight: 1.2
                                    }}>
                                        {card.title}
                                    </Typography>
                                    <Typography noWrap sx={{
                                        mt: 0.3, fontSize: "0.75rem", color: colors.white[600],
                                    }}>
                                        {card.doctor}
                                    </Typography>
                                </Box>

                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                                    <Typography sx={{
                                        fontSize: "0.7rem", color: colors.yellowAccent[400], fontWeight: 700,
                                    }}>
                                        {/* Simple formatting for display based on numerical start time */}
                                        {`${Math.floor(8 + card.start)}:${(card.start % 1) !== 0 ? '30' : '00'} - ${Math.floor(8 + card.start + card.duration)}:${((card.start + card.duration) % 1) !== 0 ? '30' : '00'}`}
                                    </Typography>

                                    <Stack direction="row" spacing={-1}>
                                        {card.avatars.slice(0, 3).map((avatar, index) => (
                                            <Avatar key={index} src={avatar}
                                                sx={{ width: 22, height: 22, border: "2px solid", borderColor: theme.palette.mode === 'dark' ? colors.primary[300] : 'white' }}
                                            />
                                        ))}
                                    </Stack>
                                </Stack>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}