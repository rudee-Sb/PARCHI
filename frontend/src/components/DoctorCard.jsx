import { Card, Button, Typography, Box } from "@mui/material";
import { useStore } from "../store/useStore";

export default function DoctorCard({ doctor }) {
    const setDoctor = useStore((s) => s.setDoctor);

    return (
        <Card
            sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box>
                <Typography variant="h6">{doctor.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {doctor.speciality}
                </Typography>
            </Box>

            <Button
                variant="contained"
                onClick={() => setDoctor(doctor)}
            >
                Book
            </Button>
        </Card>
    );
}