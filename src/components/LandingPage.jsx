import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch doctors from Spring Boot public endpoint
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError(null);
        const res = await fetch("http://localhost:8080/api/doctors/landing-page-doctors");
        if (!res.ok) {
          throw new Error("Failed to load doctors");
        }
        const data = await res.json();
        setDoctors(data || []);
      } catch (err) {
        setError(err.message || "Unable to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div style={styles.container}>
      {/* ================= NAVBAR ================= */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => scrollToSection("home")}>
          Health<span style={{ color: "#1a73e8" }}>Connect</span>
        </div>
        <div style={styles.navLinks}>
          <span style={styles.link} onClick={() => scrollToSection("home")}>
            Home
          </span>
          <span style={styles.link} onClick={() => scrollToSection("about")}>
            About
          </span>
          <span style={styles.link} onClick={() => scrollToSection("services")}>
            Services
          </span>
          <span style={styles.link} onClick={() => scrollToSection("contact")}>
            Contact
          </span>
        </div>
        <div style={styles.authButtons}>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            style={styles.registerBtn}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <header id="home" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Book appointments <br />
            <span style={{ color: "#1a73e8" }}>hassle-free.</span>
          </h1>
          <p style={styles.heroText}>
            Skip the waiting room. Connect with trusted doctors and book your
            slots instantly from the comfort of your home.
          </p>
          <button
            style={styles.ctaButton}
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
        <div style={styles.heroImageContainer}>
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
            alt="Doctor"
            style={styles.heroImage}
          />
        </div>
      </header>

      {/* ================= ABOUT US (New Section) ================= */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>About HealthConnect</h2>
          <p style={styles.sectionSubtitle}>
            Bridging the gap between patients and care.
          </p>
        </div>

        <div style={styles.aboutContent}>
          <div style={styles.aboutText}>
            <p>
              At HealthConnect, we believe healthcare should be accessible,
              transparent, and simple. Founded with a mission to eliminate the
              uncertainty of walk-in appointments, we provide a seamless
              platform where patients can view real-time doctor availability.
            </p>
            <p style={{ marginTop: "15px" }}>
              Whether you need a general checkup or specialized care, our
              technology empowers you to manage your health schedule without the
              stress of long queues.
            </p>
          </div>

          {/* Simple Stats / Steps */}
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>1</span>
              <span style={styles.statLabel}>Search Doctor</span>
            </div>
            <div style={styles.statDivider}>→</div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>2</span>
              <span style={styles.statLabel}>Book Slot</span>
            </div>
            <div style={styles.statDivider}>→</div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>3</span>
              <span style={styles.statLabel}>Get Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <p style={styles.sectionSubtitle}>
            Comprehensive care at your fingertips.
          </p>
        </div>

        <div style={styles.gridContainer}>
          {/* Card 1 */}
          <div style={styles.compactCard}>
            <div style={styles.iconSmall}>🩺</div>
            <div>
              <h3 style={styles.cardTitle}>General Consultation</h3>
              <p style={styles.cardText}>
                Connect with trusted physicians for your everyday health
                concerns.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div style={styles.compactCard}>
            <div style={styles.iconSmall}>🦷</div>
            <div>
              <h3 style={styles.cardTitle}>Specialized Care</h3>
              <p style={styles.cardText}>
                Access specialists across departments through a single platform.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div style={styles.compactCard}>
            <div style={styles.iconSmall}>📅</div>
            <div>
              <h3 style={styles.cardTitle}>Instant Booking</h3>
              <p style={styles.cardText}>
                View live slot availability and confirm your visit in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DOCTORS FROM BACKEND ================= */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Available Doctors</h2>
          <p style={styles.sectionSubtitle}>
            This data is loaded from your Spring Boot API at{" "}
            <code>GET /api/doctors</code>.
          </p>
        </div>

        {loadingDoctors && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
            Loading doctors…
          </p>
        )}

        {error && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#c0392b" }}>
            {error}
          </p>
        )}

        {!loadingDoctors && !error && (
          <div style={styles.doctorGrid}>
            {doctors.length === 0 && (
              <p style={styles.emptyDoctorsText}>
                No doctors found. Add doctors in backend to see them here.
              </p>
            )}

            {doctors.map((doc) => (
              <div key={doc.id} style={styles.doctorCard}>
                <div style={styles.doctorHeaderRow}>
                  <h3 style={styles.doctorName}>{doc.name}</h3>
                  {doc.specialization && (
                    <span style={styles.doctorSpecialty}>
                      {doc.specialization}
                    </span>
                  )}
                </div>
                <p style={styles.doctorMeta}>
                  {doc.clinicName || doc.hospitalName || "Clinic information"}
                </p>
                <button
                  style={styles.doctorButton}
                  onClick={() =>
                    navigate(
                      `/login?redirect=/doctors/${encodeURIComponent(
                        doc.id
                      )}`
                    )
                  }
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.contactContent}>
          <h2 style={styles.contactTitle}>Get in Touch</h2>

          <div style={styles.contactRow}>
            {/* Phone */}
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📞</span>
              <div style={styles.contactTextGroup}>
                <span style={styles.contactLabel}>Phone</span>
                <span style={styles.contactValue}>+91 6300036680</span>
              </div>
            </div>

            {/* Email */}
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>✉️</span>
              <div style={styles.contactTextGroup}>
                <span style={styles.contactLabel}>Email</span>
                <span style={styles.contactValue}>
                  pusalaarunkumar7@gmail.com
                </span>
              </div>
            </div>

            {/* Location */}
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📍</span>
              <div style={styles.contactTextGroup}>
                <span style={styles.contactLabel}>Location</span>
                <span style={styles.contactValue}>
                  Hyderabad, Telangana, India
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PREMIUM FOOTER ================= */}
      <section style={styles.footerSection}>
        <div style={styles.footerGrid}>
          <div>
            <h3 style={styles.footerBrand}>
              Health<span style={{ color: "#1a73e8" }}>Connect</span>
            </h3>
            <p style={styles.footerText}>
              A simple, reliable way to connect patients and doctors. Integrate
              it with your existing systems to make appointments truly seamless.
            </p>
          </div>
          <div>
            <h4 style={styles.footerHeading}>Platform</h4>
            <p style={styles.footerText}>
              All configuration, integrations, and analytics live in your
              backend and dashboards — this landing page focuses on the
              experience layer only.
            </p>
          </div>
        </div>
        <p style={styles.footerCopy}>
          © {new Date().getFullYear()} HealthConnect. All rights reserved.
        </p>
      </section>

      {/* ================= COPYRIGHT STRIP ================= */}
      <footer style={styles.copyright}>
        &copy; 2026 HealthConnect.
      </footer>
    </div>
  );
}

/* =======================
   STYLES (Warm "Reading Mode" Theme)
   ======================= */
const styles = {
  container: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    color: "#4a4a4a",
    backgroundColor: "#fdfbf7",
    overflowX: "hidden",
  },

  // NAVBAR
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    backgroundColor: "#fdfbf7",
    borderBottom: "1px solid #e0ddd5",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
    cursor: "pointer",
    letterSpacing: "-0.5px",
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
    transition: "color 0.2s",
  },
  authButtons: {
    display: "flex",
    gap: "10px",
  },
  loginBtn: {
    padding: "8px 16px",
    border: "1px solid #dcdcdc",
    background: "transparent",
    color: "#1a73e8",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "500",
  },
  registerBtn: {
    padding: "8px 16px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "500",
  },

  // HERO
  heroSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "60px 100px",
    backgroundColor: "#fdfbf7",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heroContent: {
    flex: 1,
    paddingRight: "20px",
    minWidth: "300px",
  },
  heroTitle: {
    fontSize: "40px",
    lineHeight: "1.1",
    marginBottom: "16px",
    color: "#2c3e50",
    letterSpacing: "-1px",
  },
  heroText: {
    fontSize: "16px",
    color: "#5f6368",
    marginBottom: "24px",
    lineHeight: "1.6",
    maxWidth: "400px",
  },
  ctaButton: {
    padding: "10px 24px",
    fontSize: "14px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
  },
  heroImageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  heroImage: {
    width: "100%",
    maxWidth: "280px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  // ABOUT
  aboutSection: {
    padding: "60px 40px",
    backgroundColor: "#fdfbf7",
    textAlign: "center",
    maxWidth: "900px",
    margin: "0 auto",
  },
  aboutContent: {
    marginTop: "20px",
  },
  aboutText: {
    fontSize: "15px",
    lineHeight: "1.8",
    color: "#555",
    marginBottom: "40px",
    maxWidth: "700px",
    margin: "0 auto 40px auto",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  statItem: {
    background: "#fff",
    padding: "15px 30px",
    borderRadius: "50px",
    border: "1px solid #eee",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  statNumber: {
    background: "#e8f0fe",
    color: "#1a73e8",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  statDivider: {
    color: "#ccc",
    fontSize: "20px",
  },

  // SERVICES
  section: {
    padding: "60px 40px",
    backgroundColor: "#fdfbf7",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "28px",
    marginBottom: "8px",
    color: "#2c3e50",
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#7f8c8d",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  compactCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #eaeaea",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  },
  iconSmall: {
    fontSize: "24px",
    marginBottom: "12px",
    background: "#f0f4f8",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  },
  cardText: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
    margin: 0,
  },

  // DOCTORS GRID
  doctorGrid: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  doctorCard: {
    background: "#fff",
    borderRadius: "8px",
    border: "1px solid #eaeaea",
    padding: "16px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  },
  doctorHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "6px",
  },
  doctorName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  doctorSpecialty: {
    fontSize: "12px",
    color: "#1a73e8",
    fontWeight: "500",
  },
  doctorMeta: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "10px",
  },
  doctorButton: {
    padding: "8px 14px",
    borderRadius: "4px",
    border: "none",
    background: "#1a73e8",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
  },
  emptyDoctorsText: {
    gridColumn: "1 / -1",
    textAlign: "center",
    fontSize: 13,
    color: "#666",
  },

  // CONTACT
  contactSection: {
    padding: "50px 20px",
    backgroundColor: "#2d3436",
    color: "#fff",
  },
  contactContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  },
  contactTitle: {
    fontSize: "22px",
    marginBottom: "30px",
    fontWeight: "500",
    color: "#fdfbf7",
  },
  contactRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "40px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
  },
  contactIcon: {
    fontSize: "18px",
  },
  contactTextGroup: {
    display: "flex",
    flexDirection: "column",
  },
  contactLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#b2bec3",
    fontWeight: "bold",
  },
  contactValue: {
    fontSize: "14px",
    color: "#dfe6e9",
  },

  // PREMIUM FOOTER
  footerSection: {
    marginTop: 0,
    padding: "40px 40px 24px",
    background: "#111827",
    color: "#e5e7eb",
  },
  footerGrid: {
    maxWidth: 1000,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
    paddingBottom: 16,
    borderBottom: "1px solid #374151",
  },
  footerBrand: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 8,
  },
  footerHeading: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  footerCopy: {
    maxWidth: 1000,
    margin: "12px auto 0",
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },

  // COPYRIGHT STRIP
  copyright: {
    backgroundColor: "#222",
    color: "#888",
    textAlign: "center",
    padding: "15px",
    fontSize: "12px",
  },
};

export default LandingPage;
