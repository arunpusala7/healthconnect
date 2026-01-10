import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function ManageAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await api.get("/api/admin/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to load appointments");
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.delete(`/api/admin/appointments/${id}`);
      loadAppointments();
    } catch {
      alert("Failed to cancel");
    }
  };

  const filtered = appointments.filter(a =>
    a.doctorName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={styles.pageContainer}>
      {/* HEADER */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/admin")}>
          Health<span style={{color: '#1a73e8'}}>Connect</span> <span style={styles.badge}>Admin</span>
        </div>
        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/admin")}>&larr; Back to Dashboard</span>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={styles.contentWrapper}>
        <div style={styles.card}>
          <div style={styles.headerRow}>
            <h2 style={styles.title}>All Appointments</h2>
            <input
              style={styles.searchBox}
              placeholder="🔍 Search by Doctor Name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={styles.empty}>No appointments found</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.appointmentId} style={styles.tr}>
                    <td style={styles.td}>#{a.appointmentId}</td>
                    <td style={styles.td}><strong>{a.doctorName}</strong></td>
                    <td style={styles.td}>{a.userName}</td>
                    <td style={styles.td}>{a.date} <br/><span style={styles.time}>{a.startTime} - {a.endTime}</span></td>
                    <td style={styles.td}>
                      <span style={a.status === 'BOOKED' ? styles.statusBooked : styles.statusCancelled}>
                        {a.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {a.status !== 'CANCELLED' && (
                        <button style={styles.cancelBtn} onClick={() => cancelAppointment(a.appointmentId)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        &copy; 2026 HealthConnect Admin Panel.
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fdfbf7", fontFamily: "'Roboto', sans-serif" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" },
  logo: { fontSize: "20px", fontWeight: "600", color: "#2c3e50", cursor: "pointer" },
  badge: { fontSize: "10px", background: "#2c3e50", color: "#fff", padding: "2px 6px", borderRadius: "4px", marginLeft: "5px" },
  link: { cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#5f6368" },
  contentWrapper: { flex: 1, padding: "40px", maxWidth: "1000px", margin: "0 auto", width: "100%" },
  card: { backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #eaeaea" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "22px", color: "#2c3e50" },
  searchBox: { padding: "10px", width: "300px", borderRadius: "6px", border: "1px solid #ddd" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  thead: { backgroundColor: "#f8f9fa", borderBottom: "2px solid #eee" },
  th: { padding: "15px", textAlign: "left", color: "#5f6368", fontWeight: "600" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "15px", color: "#333" },
  time: { fontSize: "12px", color: "#888" },
  cancelBtn: { padding: "6px 12px", backgroundColor: "#ffebee", color: "#c62828", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  statusBooked: { background: "#e6f4ea", color: "#137333", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" },
  statusCancelled: { background: "#fce8e6", color: "#c5221f", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" },
  footer: { backgroundColor: "#222", color: "#888", textAlign: "center", padding: "15px", fontSize: "12px", marginTop: "auto" },
  empty: { padding: "20px", textAlign: "center", color: "#888" },
};

export default ManageAppointments;