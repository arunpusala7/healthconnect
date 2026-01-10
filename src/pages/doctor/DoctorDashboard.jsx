import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast"; // ✅ Added toast import
import DoctorSidebar from "./DoctorSidebar";
import DoctorScanner from "./DoctorScanner"; 
import DoctorHome from "./DoctorHome";           
import TodayAppointments from "./TodayAppointments";
import DoctorSchedule from "./DoctorSchedule"; 
import PatientHistoryDrawer from "./PatientHistoryDrawer"; 

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  // ✅ STATE FOR PATIENT HISTORY
  const [history, setHistory] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    api.get("/api/doctor/me")
      .then(res => setDoctor(res.data))
      .catch(() => {});
  }, []);

  // ✅ UPDATED: FUNCTION TO FETCH HISTORY (With Safety Check)
  const handleViewHistory = async (userId, userName) => {
    // 🛑 Critical check: If userId is null/undefined, don't call the API
    if (!userId) {
      console.error("userId is missing for:", userName);
      toast.error("Error: Patient ID not found. Please refresh the page.");
      return;
    }

    setLoadingHistory(true);
    setSelectedPatientName(userName);
    
    try {
      // Calls the endpoint we secured in SecurityConfig
      const res = await api.get(`/api/doctor/patient-history/${userId}`);
      setHistory(res.data);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error("Error fetching history", err);
      // Detailed error messages based on status
      if (err.response?.status === 403) {
        toast.error("Permission denied to view this history.");
      } else {
        toast.error("Failed to load patient history.");
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!doctor) return <div style={styles.loading}>Loading Profile...</div>;

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          Health<span style={{color: '#1a73e8'}}>Connect</span> <span style={styles.badge}>Doctor</span>
        </div>
        <div style={styles.userInfo}>
          <span style={styles.welcomeText}>Dr. {doctor.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.mainLayout}>
        <DoctorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={styles.contentArea}>
          {activeTab === "overview" && (
            <DoctorHome doctor={doctor} setActiveTab={setActiveTab} />
          )}

          {/* ✅ Pass the loading state and function to child */}
          {activeTab === "appointments" && (
            <TodayAppointments 
              onViewHistory={handleViewHistory} 
              isLoadingHistory={loadingHistory} 
            />
          )}

          {activeTab === "schedule" && (
            <DoctorSchedule />
          )}

          {activeTab === "scan" && (
             <div style={styles.scannerWrapper}>
               <h2 style={{ marginBottom: '20px', color: '#333' }}>Ticket Verification</h2>
               <DoctorScanner />
             </div>
          )}
        </main>
      </div>

      {/* ✅ PATIENT HISTORY DRAWER */}
      <PatientHistoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        history={history} 
        patientName={selectedPatientName} 
      />

      <footer style={styles.footer}>
        &copy; 2026 HealthConnect Doctor Portal.
      </footer>
    </div>
  );
}

// ... styles object remains exactly the same as your old code ...
const styles = {
  dashboardContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa", fontFamily: "'Roboto', sans-serif" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px", height: "60px", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0", position: "sticky", top: 0, zIndex: 1100 },
  logo: { fontSize: "20px", fontWeight: "600", color: "#202124", display: "flex", alignItems: "center", gap: "10px" },
  badge: { fontSize: "10px", background: "#1a73e8", color: "#fff", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" },
  userInfo: { display: "flex", alignItems: "center", gap: "20px" },
  welcomeText: { fontSize: "14px", fontWeight: "500", color: "#333" },
  logoutBtn: { padding: "6px 16px", background: "#ffebee", color: "#d32f2f", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  mainLayout: { display: "flex", flex: 1, height: "calc(100vh - 60px)" },
  contentArea: { flex: 1, padding: "30px", overflowY: "auto", backgroundColor: "#fdfbf7" },
  scannerWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' },
  footer: { textAlign: "center", padding: "10px", fontSize: "12px", color: "#999", background: "#222" },
  loading: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" },
};

export default DoctorDashboard;