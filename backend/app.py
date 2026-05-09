from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

PATIENTS_FILE     = os.path.join(DATA_DIR, "patients.json")
DOCTORS_FILE      = os.path.join(DATA_DIR, "doctors.json")
APPOINTMENTS_FILE = os.path.join(DATA_DIR, "appointments.json")

def load(path):
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def save(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def success(message="", data=None):
    return jsonify({"status": "success", "message": message, "data": data or {}})

def error(message="", code=400):
    return jsonify({"status": "error", "message": message, "data": {}}), code


@app.route("/add_patient", methods=["POST"])
def add_patient():
    body = request.get_json(silent=True) or {}
    required = ["name", "age", "gender", "phone", "symptoms"]
    missing  = [f for f in required if not body.get(f)]
    if missing:
        return error(f"Missing fields: {', '.join(missing)}")
    patients = load(PATIENTS_FILE)
    patient = {
        "id":         str(uuid.uuid4()),
        "name":       body["name"],
        "age":        body["age"],
        "gender":     body["gender"],
        "phone":      body["phone"],
        "symptoms":   body["symptoms"],
        "priority":   body.get("priority", "Normal"),
        "bloodGroup": body.get("bloodGroup", ""),
        "conditions": body.get("conditions", ""),
        "createdAt":  datetime.now().isoformat(),
    }
    patients.append(patient)
    save(PATIENTS_FILE, patients)
    return success("Patient added successfully", patient)


@app.route("/add_doctor", methods=["POST"])
def add_doctor():
    body = request.get_json(silent=True) or {}
    required = ["name", "specialization", "fees"]
    missing  = [f for f in required if not body.get(f)]
    if missing:
        return error(f"Missing fields: {', '.join(missing)}")
    doctors = load(DOCTORS_FILE)
    doctor = {
        "id":             str(uuid.uuid4()),
        "name":           body["name"],
        "specialization": body["specialization"],
        "fees":           body["fees"],
        "image":          body.get("image", ""),
        "availableSlots": body.get("availableSlots", []),
        "createdAt":      datetime.now().isoformat(),
    }
    doctors.append(doctor)
    save(DOCTORS_FILE, doctors)
    return success("Doctor added successfully", doctor)


@app.route("/book_appointment", methods=["POST"])
def book_appointment():
    body = request.get_json(silent=True) or {}
    required = ["patientId", "doctorId", "date", "slot"]
    missing  = [f for f in required if not body.get(f)]
    if missing:
        return error(f"Missing fields: {', '.join(missing)}")
    appointments = load(APPOINTMENTS_FILE)
    duplicate = any(
        a["doctorId"] == body["doctorId"]
        and a["date"]  == body["date"]
        and a["slot"]  == body["slot"]
        and a["status"] != "cancelled"
        for a in appointments
    )
    if duplicate:
        return error("This slot is already booked.")
    appointment = {
        "id":        str(uuid.uuid4()),
        "patientId": body["patientId"],
        "doctorId":  body["doctorId"],
        "date":      body["date"],
        "slot":      body["slot"],
        "status":    "confirmed",
        "priority":  body.get("priority", "Normal"),
        "title":     body.get("title", "Consultation"),
        "createdAt": datetime.now().isoformat(),
    }
    appointments.append(appointment)
    save(APPOINTMENTS_FILE, appointments)
    return success("Appointment booked successfully", appointment)


@app.route("/cancel_appointment", methods=["DELETE"])
def cancel_appointment():
    body = request.get_json(silent=True) or {}
    appt_id = body.get("appointmentId")
    if not appt_id:
        return error("appointmentId is required")
    appointments = load(APPOINTMENTS_FILE)
    found = False
    for a in appointments:
        if a["id"] == appt_id:
            a["status"] = "cancelled"
            found = True
            break
    if not found:
        return error("Appointment not found", 404)
    save(APPOINTMENTS_FILE, appointments)
    return success("Appointment cancelled", {"appointmentId": appt_id})


@app.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = load(APPOINTMENTS_FILE)
    patients     = {p["id"]: p for p in load(PATIENTS_FILE)}
    doctors      = {d["id"]: d for d in load(DOCTORS_FILE)}
    result = []
    for a in appointments:
        result.append({
            **a,
            "patient": patients.get(a["patientId"], {}),
            "doctor":  doctors.get(a["doctorId"],   {}),
        })
    return success("Appointments fetched", result)


@app.route("/doctors", methods=["GET"])
def get_doctors():
    return success("Doctors fetched", load(DOCTORS_FILE))


@app.route("/patients", methods=["GET"])
def get_patients():
    return success("Patients fetched", load(PATIENTS_FILE))


if __name__ == "__main__":
    app.run(debug=True, port=5000)