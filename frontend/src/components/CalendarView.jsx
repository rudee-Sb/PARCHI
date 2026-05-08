import dayjs from "dayjs";
import { Box, Button } from "@mui/material";
import { useStore } from "../store/useStore";

export default function CalendarView() {
    const setDate = useStore((s) => s.setDate);

    const days = Array.from({ length: 7 }, (_, i) =>
        dayjs().add(i, "day")
    );

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            {days.map((d) => (
                <Button key={d} onClick={() => setDate(d.format("YYYY-MM-DD"))}>
                    {d.format("DD MMM")}
                </Button>
            ))}
        </Box>
    );
}