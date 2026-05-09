import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const getDoctors        = ()     => API.get("/doctors");
export const getPatients       = ()     => API.get("/patients");
export const getAppointments   = ()     => API.get("/appointments");
export const addPatient        = (data) => API.post("/add_patient", data);
export const bookAppointment   = (data) => API.post("/book_appointment", data);
export const cancelAppointment = (id)   => API.delete("/cancel_appointment", { data: { appointmentId: id } });