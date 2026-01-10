import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function ManageDoctors() {
  const navigate = useNavigate();
  const [activeDoctors, setActiveDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveDoctors();
  }, []);

  // ✅ WORKAROUND: Extract Doctors from Appointments
  const fetchActiveDoctors = async () => {
    try {
      // We use the appointments endpoint because "GET /api/doctors" does not exist in backend
      const res = await api.get("/api/admin/appointments");
      const appointments = res.data;

      // Filter for unique doctors
      const uniqueMap = new Map();
      
      appointments.forEach(app => {
        if (!uniqueMap.has(app.doctorName)) {
          uniqueMap.set(app.doctorName, {
            id: app.doctorId || "N/A", // Only if backend sends ID
            name: app.doctorName,
            status: "Active (Has Appointments)"
          });
        }
      });

      setActiveDoctors(Array.from(uniqueMap.values()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 style={styles.title}>Active Doctors</h2>
          <p style={styles.subtitle}>
            Doctors with appointment history. <br/>
            <span style={{fontSize: '12px', color: '#d32f2f'}}>
              * Note: Doctors with 0 appointments will not appear here due to backend restrictions.
            </span>
          </p>
          
          <div style={styles.listContainer}>
            {loading && <p>Loading...</p>}
            {!loading && activeDoctors.length === 0 && <p style={styles.empty}>No active doctors found.</p>}
            
            {activeDoctors.map((d, index) => (
              <div key={index} style={styles.listItem}>
                <div style={styles.avatar}>👨‍⚕️</div>
                <div style={styles.info}>
                  <h4 style={styles.docName}>{d.name}</h4>
                  <p style={styles.docSpec}>ID: {d.id}</p>
                </div>
                <div style={styles.statusBadge}>{d.status}</div>
              </div>
            ))}
          </div>
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
  contentWrapper: { flex: 1, padding: "40px", maxWidth: "800px", margin: "0 auto", width: "100%" },
  card: { backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #eaeaea" },
  title: { fontSize: "22px", color: "#2c3e50", marginBottom: "5px" },
  subtitle: { fontSize: "14px", color: "#666", marginBottom: "30px" },
  listContainer: { display: "flex", flexDirection: "column", gap: "15px" },
  listItem: { display: "flex", alignItems: "center", padding: "15px", border: "1px solid #eee", borderRadius: "8px", transition: "background 0.2s" },
  avatar: { fontSize: "24px", marginRight: "15px", background: "#e8f0fe", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" },
  info: { flex: 1 },
  docName: { margin: 0, fontSize: "16px", color: "#333" },
  docSpec: { margin: "2px 0 0 0", fontSize: "13px", color: "#5f6368" },
  statusBadge: { fontSize: "12px", color: "#137333", background: "#e6f4ea", padding: "4px 8px", borderRadius: "4px" },
  footer: { backgroundColor: "#222", color: "#888", textAlign: "center", padding: "15px", fontSize: "12px", marginTop: "auto" },
  empty: { textAlign: "center", color: "#888", padding: "20px" }
};

export default ManageDoctors;