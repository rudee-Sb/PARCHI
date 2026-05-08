import { Card, CardContent, Typography } from "@mui/material";

export default function PatientCard({ patient }) {
    return (
        <Card sx={{ borderRadius: 3, p: 2 }}>
            <CardContent>
                <Typography variant="h6">{patient.name}</Typography>
                <Typography>{patient.age} years</Typography>
                <Typography>Blood: {patient.blood}</Typography>
            </CardContent>
        </Card>
    );
}