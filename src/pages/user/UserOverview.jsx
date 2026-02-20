import { useEffect, useState } from "react";
import api from "../../api/api";

function UserOverview({ setActiveTab }) {

  const [nextAppointment, setNextAppointment] = useState(null);
  const [userName, setUserName] = useState("Patient");

  // ✅ RESPONSIVE SCREEN CHECK
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    // ✅ GET USER NAME FROM JWT TOKEN
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        let raw =
          payload.name ||
          payload.username ||
          payload.sub ||
          payload.email ||
          "";

        // remove domain
        if (raw.includes("@")) raw = raw.split("@")[0];

        // remove numbers
        raw = raw.replace(/[0-9]/g, "");

        raw = raw.trim();

        // capitalize
        if (raw.length > 0) {
          raw = raw.charAt(0).toUpperCase() + raw.slice(1);
        }

        setUserName(raw || "Patient");

      } catch (e) {
        console.error("Invalid token", e);
      }
    }

    // fetch appointment
    api.get("/api/appointments/my")
      .then(res => {
        const upcoming = res.data.find(a => a.status === "BOOKED");
        setNextAppointment(upcoming);
      })
      .catch(err => console.error(err));

  }, []);

  return (
    <div style={styles.container}>

      {/* HERO */}
      <div style={{
        ...styles.hero,
        flexDirection: isMobile ? "column" : "row",
        textAlign: isMobile ? "center" : "left",
        padding: isMobile ? "25px" : "40px"
      }}>

        <div style={{
          ...styles.heroContent,
          maxWidth: isMobile ? "100%" : "60%"
        }}>

          <h1 style={{
            ...styles.greeting,
            fontSize: isMobile ? "24px" : "32px"
          }}>
            Hello {userName} 👋
          </h1>

          <p style={styles.subtext}>
            Your health is our priority. What would you like to do today?
          </p>

          <button
            style={{
              ...styles.ctaButton,
              width: isMobile ? "100%" : "auto"
            }}
            onClick={() => setActiveTab('book')}
          >
            + Book New Appointment
          </button>
        </div>

        {/* hide big emoji on mobile */}
        {!isMobile && <div style={styles.heroDecoration}>🩺</div>}

      </div>


      {/* GRID */}
      <div style={{
        ...styles.grid,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(300px,1fr))"
      }}>

        {/* NEXT APPOINTMENT */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📅 Next Appointment</h3>

          {nextAppointment ? (
            <div style={{
              ...styles.appointmentPreview,
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left"
            }}>

              <div style={styles.dateBox}>
                <span style={styles.month}>
                  {new Date(nextAppointment.date)
                    .toLocaleString('default',{month:'short'})}
                </span>

                <span style={styles.day}>
                  {new Date(nextAppointment.date).getDate()}
                </span>
              </div>

              <div style={styles.details}>
                <h4>Dr. {nextAppointment.doctorName}</h4>
                <p>{nextAppointment.startTime} - {nextAppointment.endTime}</p>
              </div>

            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No upcoming visits.</p>
              <span style={styles.link}
                onClick={() => setActiveTab('book')}>
                Schedule one now →
              </span>
            </div>
          )}
        </div>


        {/* QUICK ACTIONS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⚡ Quick Actions</h3>

          <div style={styles.actionList}>
            <button style={styles.actionBtn}
              onClick={() => setActiveTab('my-appointments')}>
              View History
            </button>

            <button style={styles.actionBtn}
              onClick={() => setActiveTab('book')}>
              Find a Doctor
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}


const styles = {

  container:{maxWidth:"1000px",margin:"0 auto"},

  hero:{
    background:"linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%)",
    color:"#fff",
    borderRadius:"16px",
    marginBottom:"30px",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    boxShadow:"0 10px 30px rgba(26,115,232,0.2)"
  },

  heroContent:{},

  greeting:{margin:"0 0 10px 0",fontWeight:"700"},

  subtext:{margin:"0 0 25px 0",opacity:0.9,fontSize:"16px"},

  ctaButton:{
    padding:"12px 24px",
    background:"#fff",
    color:"#1a73e8",
    border:"none",
    borderRadius:"8px",
    fontSize:"14px",
    fontWeight:"bold",
    cursor:"pointer"
  },

  heroDecoration:{fontSize:"80px",opacity:0.2},

  grid:{display:"grid",gap:"25px"},

  card:{
    background:"#fff",
    padding:"25px",
    borderRadius:"16px",
    boxShadow:"0 4px 20px rgba(0,0,0,0.05)",
    border:"1px solid #f0f0f0"
  },

  cardTitle:{
    marginTop:0,
    color:"#444",
    fontSize:"18px",
    marginBottom:"20px"
  },

  appointmentPreview:{
    display:"flex",
    alignItems:"center",
    gap:"15px",
    background:"#f8f9fa",
    padding:"15px",
    borderRadius:"12px"
  },

  dateBox:{
    background:"#fff",
    padding:"10px",
    borderRadius:"8px",
    textAlign:"center",
    boxShadow:"0 2px 5px rgba(0,0,0,0.05)",
    minWidth:"60px"
  },

  month:{
    display:"block",
    fontSize:"12px",
    color:"#d32f2f",
    textTransform:"uppercase",
    fontWeight:"bold"
  },

  day:{
    display:"block",
    fontSize:"20px",
    fontWeight:"bold",
    color:"#333"
  },

  details:{flex:1},

  emptyState:{textAlign:"center",color:"#888",padding:"20px 0"},

  link:{color:"#1a73e8",cursor:"pointer",fontSize:"14px",fontWeight:"600"},

  actionList:{display:"flex",flexDirection:"column",gap:"10px"},

  actionBtn:{
    padding:"12px",
    background:"#f1f3f4",
    border:"none",
    borderRadius:"8px",
    textAlign:"left",
    cursor:"pointer",
    color:"#333",
    fontWeight:"500"
  }

};

export default UserOverview;
