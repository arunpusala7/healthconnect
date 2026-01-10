import { useEffect, useState } from "react";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode"; // Import the library

function UserProfile() {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  
  // Default state
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    role: "PATIENT",
    sub: ""
  });

  useEffect(() => {
    // ------------------------------------------------------
    // 1️⃣ EXTRACT DETAILS FROM JWT
    // ------------------------------------------------------
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded); // Check console to see what fields you have!

        // Map JWT fields to your UI
        // Note: Different backends name fields differently. 
        // Common names: 'sub' (email/username), 'name', 'iat', 'exp'
        setUser({
          name: decoded.name || decoded.sub?.split('@')[0] || "Valued User", // Try 'name', fallback to part of email
          email: decoded.sub || decoded.email || "No Email",
          role: decoded.role || localStorage.getItem("role") || "USER",
          sub: decoded.sub || ""
        });
        
      } catch (error) {
        console.error("Invalid Token", error);
      }
    }

    // ------------------------------------------------------
    // 2️⃣ GET REAL STATS FROM API
    // ------------------------------------------------------
    api.get("/api/appointments/my").then(res => {
      const all = res.data;
      const upcoming = all.filter(a => a.status === 'BOOKED').length;
      const completed = all.filter(a => a.status === 'COMPLETED').length;
      setStats({ total: all.length, upcoming, completed });
    }).catch(err => console.error(err));
    
  }, []);

  return (
    <div style={styles.container}>
      {/* Profile Header Card */}
      <div style={styles.headerCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatarLarge}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.role}>{user.role}</p>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Personal Details */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Personal Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>Email Address</span>
            <span style={styles.value}>{user.email}</span>
          </div>
          <div style={styles.divider}></div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Username / Sub</span>
            <span style={styles.value}>{user.sub}</span>
          </div>
          <div style={styles.divider}></div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Account Status</span>
            <span style={styles.value}><span style={{color: '#4caf50'}}>●</span> Active</span>
          </div>
        </div>

        {/* Health Stats */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Activity Overview</h3>
          <div style={styles.statsContainer}>
            
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{stats.total}</span>
              <span style={styles.statLabel}>Total Visits</span>
            </div>

            <div style={styles.statBox}>
              <span style={{...styles.statNumber, color: '#1a73e8'}}>{stats.upcoming}</span>
              <span style={styles.statLabel}>Upcoming</span>
            </div>

            <div style={styles.statBox}>
              <span style={{...styles.statNumber, color: '#137333'}}>{stats.completed}</span>
              <span style={styles.statLabel}>Completed</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto" },
  headerCard: {
    background: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)",
    borderRadius: "16px",
    padding: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    marginBottom: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  },
  avatarSection: { display: "flex", alignItems: "center", gap: "20px" },
  avatarLarge: {
    width: "80px",
    height: "80px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    border: "2px solid rgba(255,255,255,0.3)",
    textTransform: "uppercase"
  },
  name: { margin: "0 0 5px 0", fontSize: "24px", textTransform: "capitalize" },
  role: { margin: 0, opacity: 0.8, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px" },
  card: { background: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" },
  cardTitle: { marginTop: 0, color: "#444", borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "20px" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "8px 0" },
  label: { color: "#888", fontSize: "14px" },
  value: { color: "#333", fontWeight: "500" },
  divider: { height: "1px", background: "#f5f5f5", margin: "5px 0" },
  statsContainer: { display: "flex", justifyContent: "space-between", textAlign: "center", paddingTop: "10px" },
  statBox: { flex: 1 },
  statNumber: { display: "block", fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "5px" },
  statLabel: { fontSize: "13px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" },
};

export default UserProfile;