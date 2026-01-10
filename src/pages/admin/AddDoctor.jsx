import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function AddDoctor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/api/admin/create-doctor-account", formData);
      setMessage({ type: "success", text: "✅ Doctor account created successfully!" });
      
      // Optional: Clear form
      setFormData({ name: "", email: "", password: "", specialization: "" });

      // Optional: Redirect back to dashboard after 2 seconds
      setTimeout(() => navigate("/admin"), 2000);

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Failed to create account. Email might exist." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* ================= HEADER ================= */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/admin")}>
          Health<span style={{color: '#1a73e8'}}>Connect</span> <span style={styles.badge}>Admin</span>
        </div>
        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/admin")}>&larr; Back to Dashboard</span>
        </div>
      </nav>

      {/* ================= FORM CONTENT ================= */}
      <div style={styles.contentWrapper}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Register New Doctor</h2>
          <p style={styles.subtitle}>Enter the doctor's details below</p>

          {message.text && (
            <p style={message.type === "success" ? styles.success : styles.error}>
              {message.text}
            </p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Doctor's Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="specialization"
            placeholder="Specialization (e.g. Cardiology)"
            value={formData.specialization}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Set Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>
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
  // HEADER
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
  },
  badge: {
    fontSize: "10px",
    background: "#2c3e50",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
    textTransform: "uppercase",
    marginLeft: "5px",
  },
  link: {
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#5f6368",
  },
  
  // FORM CARD
  contentWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  card: {
    width: "400px",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eaeaea",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "600",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#666",
    fontSize: "14px",
  },
  input: {
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fcfcfc",
  },
  button: {
    padding: "14px",
    marginTop: "10px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },
  error: {
    color: "#d32f2f",
    background: "#ffebee",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "14px",
  },
  success: {
    color: "#1b5e20",
    background: "#e8f5e9",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "14px",
  },

  // FOOTER
  footer: {
    backgroundColor: "#222",
    color: "#888",
    textAlign: "center",
    padding: "15px",
    fontSize: "12px",
    marginTop: "auto",
  },
};

export default AddDoctor;