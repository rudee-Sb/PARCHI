import { Box, Button } from "@mui/material";
import { useStore } from "../store/useStore";
import { bookAppointment } from "../api/api";

const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];

export default function TimeSlots() {
    const { selectedDoctor, selectedDate } = useStore();

    const handleBooking = async (time) => {
        if (!selectedDoctor || !selectedDate) {
            alert("Select doctor and date first");
            return;
        }

        try {
            const res = await bookAppointment({
                doctor_id: selectedDoctor.id,
                datetime: `${selectedDate} ${time}`,
            });

            alert(res.data.message);
        } catch {
            alert("Slot already booked");
        }
    };

    return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {slots.map((s) => (
                <Button
                    key={s}
                    variant="contained"
                    onClick={() => handleBooking(s)}
                >
                    {s}
                </Button>
            ))}
        </Box>
    );
}