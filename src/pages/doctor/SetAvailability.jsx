import { useState } from "react";
import api from "../../api/api";

function SetAvailability() {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    slotDurationMinutes: 30
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const addAvailability = async () => {
    try {
      await api.post("/api/availability/add", formData);
      alert("✅ Availability added successfully!");
      setFormData({...formData, date: "", startTime: "", endTime: ""});
    } catch (e) {
      alert("❌ Failed to add availability. Please check the inputs.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Manage Availability</h2>
        <p style={styles.subtitle}>Set your working hours to allow patients to book appointments.</p>

        <div style={styles.formGrid}>
          <div style={styles.group}>
            <label style={styles.label}>Select Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Slot Duration</label>
            <select name="slotDurationMinutes" value={formData.slotDurationMinutes} onChange={handleChange} style={styles.input}>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
            </select>
          </div>
        </div>

        <button onClick={addAvailability} style={styles.button}>Publish Availability</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center" },
  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #eaeaea",
  },
  title: { margin: "0 0 10px 0", color: "#2c3e50" },
  subtitle: { margin: "0 0 30px 0", color: "#666", fontSize: "14px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" },
  group: { display: "flex", flexDirection: "column" },
  label: { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" },
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", backgroundColor: "#f9f9f9" },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default SetAvailability;