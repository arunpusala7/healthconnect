import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/api/auth/register", {
        name: name,
        email: email,
        password: password,
        role: "USER",
      });

      setMessage("✅ Registration successful! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError("❌ Registration failed. Email may already exist.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* ================= HEADER ================= */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          Health<span style={{color: '#1a73e8'}}>Connect</span>
        </div>
        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => navigate("/")}>Home</span>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div style={styles.contentWrapper}>
        <form style={styles.card} onSubmit={handleRegister}>
          <h2 style={styles.title}>Create Account</h2>

          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>

          <p style={styles.linkText}>
            Already have an account? <Link to="/login" style={styles.activeLink}>Login</Link>
          </p>
        </form>
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        &copy; 2026 HealthConnect.
      </footer>
    </div>
  );
}

export default Register;

/* =======================
   SHARED STYLES (Copy exact styles from Login.jsx or use a shared file)
   ======================= */
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
    backgroundColor: "#fdfbf7",
    borderBottom: "1px solid #e0ddd5",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "24px",
  },
  link: {
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#5f6368",
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  card: {
    width: "380px",
    padding: "35px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eaeaea",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "600",
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
  },
  linkText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  activeLink: {
    color: '#1a73e8', 
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  error: {
    color: "#d32f2f",
    background: "#ffebee",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  },
  success: {
    color: "#1b5e20",
    background: "#e8f5e9",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
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