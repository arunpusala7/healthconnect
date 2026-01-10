function DoctorOverview({ doctor, setActiveTab }) {
  return (
    <div>
      <div style={styles.welcomeBanner}>
        <div>
          <h1 style={styles.heading}>Welcome back, Dr. {doctor.name} 👋</h1>
          <p style={styles.subtext}>You have a busy day ahead. Check your appointments below.</p>
        </div>
        
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" 
          alt="Doctor Icon" 
          style={styles.heroImage}
        />
      </div>

      <div style={styles.statsGrid}>
        {/* Card 1 */}
        <div style={styles.card} onClick={() => setActiveTab('appointments')}>
          <div style={styles.iconBox}>🩺</div>
          <h3>Check Appointments</h3>
          <p>View today's patient list and manage consults.</p>
          <span style={styles.link}>View Today &rarr;</span>
        </div>

        {/* Card 2 */}
        <div style={styles.card} onClick={() => setActiveTab('schedule')}>
          <div style={styles.iconBox}>🕒</div>
          <h3>Update Schedule</h3>
          <p>Add new availability slots for the upcoming week.</p>
          <span style={styles.link}>Manage Slots &rarr;</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  welcomeBanner: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #eaeaea",
  },
  heading: { margin: 0, color: "#2c3e50", fontSize: "28px" },
  subtext: { margin: "10px 0 0 0", color: "#666", fontSize: "16px" },
  heroImage: { height: "100px", opacity: 0.9 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #eaeaea",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  iconBox: { fontSize: "30px", marginBottom: "15px", background: "#f0f8ff", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" },
  link: { color: "#1a73e8", fontWeight: "600", fontSize: "14px", display: "block", marginTop: "15px" },
};

export default DoctorOverview;