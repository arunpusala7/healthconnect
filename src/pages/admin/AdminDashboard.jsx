import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.pageContainer}>
      {/* ================= HEADER ================= */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          Health<span style={{color: '#1a73e8'}}>Connect</span> <span style={styles.badge}>Admin</span>
        </div>
        <div style={styles.userInfo}>
          <span>Administrator</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div style={styles.contentWrapper}>
        <div style={styles.dashboardHeader}>
          <h2>Admin Dashboard</h2>
          <p>Manage your hospital staff and appointments.</p>
        </div>

        <div style={styles.gridContainer}>
          
          {/* CARD 1: ADD DOCTOR */}
          <div style={styles.card} onClick={() => navigate("/admin/add-doctor")}>
            <div style={styles.iconContainer}>👨‍⚕️</div>
            <h3>Add New Doctor</h3>
            <p>Create a new account for a doctor with their specialization.</p>
            <span style={styles.linkArrow}>Go to page &rarr;</span>
          </div>

          {/* CARD 2: MANAGE APPOINTMENTS */}
          <div style={styles.card} onClick={() => navigate("/admin/appointments")}>
            <div style={styles.iconContainer}>📅</div>
            <h3>Manage Appointments</h3>
            <p>View, filter, and cancel scheduled appointments.</p>
            <span style={styles.linkArrow}>View details &rarr;</span>
          </div>

          {/* CARD 3: DOCTOR LIST */}
          <div style={styles.card} onClick={() => navigate("/admin/doctors")}>
            <div style={styles.iconContainer}>🏥</div>
            <h3>Active Doctor List</h3>
            <p>View doctors who currently have scheduled appointments.</p>
            <span style={styles.linkArrow}>View list &rarr;</span>
          </div>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        &copy; 2026 HealthConnect Admin Panel.
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fdfbf7",
    fontFamily: "'Roboto', sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badge: {
    fontSize: "10px",
    background: "#2c3e50",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#5f6368",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#ffebee",
    color: "#d32f2f",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  contentWrapper: {
    flex: 1,
    padding: "60px 40px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  dashboardHeader: {
    marginBottom: "40px",
    textAlign: "center",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    border: "1px solid #eaeaea",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
  },
  iconContainer: {
    fontSize: "30px",
    marginBottom: "20px",
    background: "#f0f4f8",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  linkArrow: {
    marginTop: "20px",
    color: "#1a73e8",
    fontSize: "14px",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#222",
    color: "#888",
    textAlign: "center",
    padding: "15px",
    fontSize: "12px",
    marginTop: "auto",
  },
};

export default AdminDashboard;