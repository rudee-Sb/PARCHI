from datetime import datetime, timedelta
import json

# Store booked appointments
appointments = []

# Store available slots
available_slots = {
    1: [  # doctor_id
        "2026-05-07T10:00:00",
        "2026-05-07T10:30:00",
        "2026-05-07T11:00:00"
    ]
}


def check_conflict(doctor_id, dt, appointments):
    """
    Returns True if slot already booked
    Returns False if slot available
    """

    slot_duration = timedelta(minutes=30)

    requested_start = dt
    requested_end = dt + slot_duration

    for appt in appointments:

        # check same doctor only
        if appt["doctor_id"] != doctor_id:
            continue

        # overlap check
        if requested_start < appt["end"] and requested_end > appt["start"]:
            return True

    return False


def book_slot(doctor_id, time_str):

    dt = datetime.fromisoformat(time_str)

    # check if slot exists in available slots
    if time_str not in available_slots.get(doctor_id, []):
        return {"error": "Slot not available"}

    # check booking conflict
    if check_conflict(doctor_id, dt, appointments):
        return {"error": "Slot already booked"}

    # create appointment
    new_appointment = {
        "doctor_id": doctor_id,
        "start": dt,
        "end": dt + timedelta(minutes=30)
    }

    appointments.append(new_appointment)

    # remove booked slot from available slots
    available_slots[doctor_id].remove(time_str)

    return {"message": "Appointment booked successfully"}


# Save booked slots into JSON
def save_appointments():
    data = []

    for appt in appointments:
        data.append({
            "doctor_id": appt["doctor_id"],
            "start": appt["start"].isoformat(),
            "end": appt["end"].isoformat()
        })

    with open("booked_slots.json", "w") as f:
        json.dump(data, f, indent=4)


# Example test
print(book_slot(1, "2026-05-07T10:00:00"))
print(book_slot(1, "2026-05-07T10:00:00"))

save_appointments()