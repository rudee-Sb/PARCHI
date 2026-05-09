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
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAppointments } from "../api/api";

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

const today = getStartOfDay(new Date());
const tomorrow = addDays(today, 1);
const dayAfter = addDays(today, 2);

const timeSlots = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM"];


export default function Schedule() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [scheduleCards, setScheduleCards] = useState([]);

    useEffect(() => {
        getAppointments().then(res => {
            const mapped = res.data.data.map((a, i) => ({
                id:       a.id,
                title:    a.title || "Consultation",
                doctor:   a.doctor?.name || "Unknown Doctor",
                date:     a.date,
                start:    i % 6,
                duration: 1,
                avatars:  [],
            }));
            setScheduleCards(mapped);
        });
    }, []);

    const [view, setView] = useState("week");
    const [currentDate, setCurrentDate] = useState(today);

    const gridHeight = 95; // Increased slightly to prevent vertical clipping

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
            .filter((card) => card.column !== -1);
    }, [visibleDays]);

    const handlePrev = () => setCurrentDate((prev) => addDays(prev, view === "week" ? -7 : -1));
    const handleNext = () => setCurrentDate((prev) => addDays(prev, view === "week" ? 7 : 1));
    const handleToday = () => setCurrentDate(today);

    const isPrevDisabled = useMemo(() => {
        if (view === "week") return getStartOfWeek(currentDate).getTime() <= getStartOfWeek(today).getTime();
        return getStartOfDay(currentDate).getTime() <= today.getTime();
    }, [currentDate, view]);

    const headerTitle = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
                        <IconButton onClick={handlePrev} disabled={isPrevDisabled} sx={{ bgcolor: colors.primary[400] }}>
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
                overflowY: "auto", // 1. Changed to auto to allow scrolling
                overflowX: "hidden" 
            }}>
                
                {/* TIME COLUMN */}
                <Box sx={{ 
                    width: 80, 
                    flexShrink: 0, // Prevent column from squishing
                    borderRight: `1px solid ${colors.primary[400]}`, 
                    bgcolor: theme.palette.mode === "dark" ? colors.primary[200] : "#fcfcfd" 
                }}>
                    {/* EMPTY HEADER CORNER (Made Sticky) */}
                    <Box sx={{ 
                        height: 72, 
                        borderBottom: `1px solid ${colors.primary[400]}`,
                        position: "sticky", // 2. Keep at top while scrolling
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
                    {/* DAY HEADERS (Made Sticky) */}
                    <Box sx={{
                        height: 72, 
                        display: "grid", 
                        gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
                        borderBottom: `1px solid ${colors.primary[400]}`,
                        background: theme.palette.mode === "dark" ? colors.primary[200] : "#f8fafc",
                        position: "sticky", // 3. Keep days at top while scrolling
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
                        // Removed `flex: 1` here so it properly expands to full 6 * 95px height
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
                                        {`${8 + card.start}:00 - ${8 + card.start + card.duration}:00`}
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