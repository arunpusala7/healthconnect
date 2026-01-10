function AdminHome() {
  return (
    <div>
      <h2 style={{ marginBottom: "20px", color: "#202124" }}>Dashboard Overview</h2>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <span style={styles.icon}>👨‍⚕️</span>
          <h3>Manage Doctors</h3>
          <p>Add, remove, or update doctor profiles and specializations.</p>
        </div>

        <div style={styles.card}>
          <span style={styles.icon}>📅</span>
          <h3>Appointments</h3>
          <p>View upcoming schedules and cancel conflicting appointments.</p>
        </div>

        <div style={styles.card}>
          <span style={styles.icon}>🕒</span>
          <h3>Availability</h3>
          <p>Set global availability settings for the clinic.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
  icon: { fontSize: "40px", marginBottom: "15px", display: "block" },
};

export default AdminHome;