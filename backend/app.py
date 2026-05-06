from datetime import timedelta

def check_conflict(doctor_id, dt, appointments):
    """
    doctor_id: ID of the doctor
    dt: datetime object (start time of requested slot)
    appointments: list of existing appointments
                  each item:
                  {
                      "doctor_id": int,
                      "start": datetime,
                      "end": datetime
                  }

    Returns:
        True  -> slot already booked (conflict)
        False -> slot available
    """

    slot_duration = timedelta(minutes=30)  # define slot length
    requested_start = dt
    requested_end = dt + slot_duration

    for appt in appointments:
        # check only same doctor's appointments
        if appt["doctor_id"] != doctor_id:
            continue

        # overlap condition
        if requested_start < appt["end"] and requested_end > appt["start"]:
            return True

    return False

