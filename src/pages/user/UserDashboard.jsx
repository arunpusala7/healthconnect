import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import BookAppointment from "./BookAppointment";
import MyAppointments from "./MyAppointments";
import UserOverview from "./UserOverview";
import UserProfile from "./UserProfile"; 

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* HEADER */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => setActiveTab("overview")}>
          Health<span style={{color: '#1a73e8'}}>Connect</span> <span style={styles.badge}>Patient</span>
        </div>
        
        <div style={styles.profileSection}>
          <div style={styles.avatarCircle} onClick={() => setShowProfileMenu(!showProfileMenu)}>U</div>
          {showProfileMenu && (
            <div style={styles.dropdownMenu}>
              <div style={styles.menuItem} onClick={() => {setActiveTab("profile"); setShowProfileMenu(false)}}>My Profile</div>
              <div style={styles.menuItem} onClick={() => {setActiveTab("my-appointments"); setShowProfileMenu(false)}}>Appointments</div>
              <div style={styles.menuDivider}></div>
              <div style={styles.menuItemDanger} onClick={handleLogout}>Sign Out</div>
            </div>
          )}
        </div>
      </nav>

      <div style={styles.mainLayout}>
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* CONTENT AREA - GAP REDUCED */}
        <main style={styles.contentArea}>
          
          {activeTab === "overview" && (
            <div style={styles.fadeIn}><UserOverview setActiveTab={setActiveTab} /></div>
          )}

          {activeTab === "profile" && (
            <div style={styles.fadeIn}><UserProfile /></div>
          )}

          {activeTab === "book" && (
            <div style={styles.fadeIn}>
              <BookAppointment onBookingComplete={() => setActiveTab("my-appointments")} />
            </div>
          )}

          {activeTab === "my-appointments" && (
            <div style={styles.fadeIn}><MyAppointments /></div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa", fontFamily: "'Roboto', sans-serif" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", height: "60px", backgroundColor: "#ffffff", borderBottom: "1px solid #eaeaea", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: "20px", fontWeight: "700", color: "#202124", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },
  badge: { fontSize: "10px", background: "#e8f0fe", color: "#1a73e8", padding: "3px 6px", borderRadius: "6px", textTransform: "uppercase" },
  
  profileSection: { position: "relative" },
  avatarCircle: { width: "35px", height: "35px", borderRadius: "50%", background: "#1a73e8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: "pointer", fontSize: "16px" },
  dropdownMenu: { position: "absolute", top: "45px", right: "0", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", width: "160px", overflow: "hidden", zIndex: 200 },
  menuItem: { padding: "10px 15px", cursor: "pointer", fontSize: "13px", color: "#333", transition: "background 0.2s" },
  menuDivider: { height: "1px", background: "#eee", margin: "0" },
  menuItemDanger: { padding: "10px 15px", cursor: "pointer", fontSize: "13px", color: "#d32f2f", fontWeight: "500" },

  mainLayout: { display: "flex", flex: 1, height: "calc(100vh - 60px)" },
  
  // ✅ UPDATED: Reduced Padding to close the gap
  contentArea: { 
    flex: 1, 
    padding: "20px", // Reduced from 40px
    overflowY: "auto", 
    backgroundColor: "#fdfbf7" 
  },
  fadeIn: { animation: "fadeIn 0.3s ease-in-out" },
};

export default UserDashboard;