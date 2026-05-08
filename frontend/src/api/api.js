import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
});

export const bookAppointment = (data) =>
    API.post("/book_appointment", data);

export const getAppointments = () =>
    API.get("/appointments");