import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    apiFetch("/api/admin/appointments").then(setAppointments);
  }, []);

  const cancelAppointment = async (id) => {
    await apiFetch(`/api/admin/appointments/${id}`, {
      method: "DELETE"
    });

    setAppointments(appointments.filter(a => a.appointmentId !== id));
  };

  return (
    <div>
      <h2>All Appointments</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>User</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map(a => (
            <tr key={a.appointmentId}>
              <td>{a.doctorName}</td>
              <td>{a.userName}</td>
              <td>{a.date}</td>
              <td>{a.startTime} - {a.endTime}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => cancelAppointment(a.appointmentId)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllAppointments;
