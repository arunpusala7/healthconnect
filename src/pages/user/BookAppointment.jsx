import { useState, useEffect } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentReceipt from "./AppointmentReceipt"; 

function BookAppointment({ onBookingComplete }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Data State
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Waitlist Loading State
  const [joiningWaitlist, setJoiningWaitlist] = useState(false);

  // Receipt State
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // Load Doctors
  useEffect(() => {
    api.get("/api/doctors").then(res => setDoctors(res.data));
  }, []);

  // Filter Logic
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || doc.specialization === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const specializations = ["All", ...new Set(doctors.map(d => d.specialization))];

  // Fetch Slots
  const fetchSlots = async (docId, selectedDate) => {
    setLoadingSlots(true);
    setSlots([]);
    try {
      const res = await api.get(`/api/availability/doctor/${docId}?date=${selectedDate}`);
      setSlots(res.data.availableSlots || []);
    } catch (err) {
      toast.error("Could not load availability.");
    } finally {
      setTimeout(() => setLoadingSlots(false), 400);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot(null);
    if (selectedDoctor) fetchSlots(selectedDoctor.id, e.target.value);
  };

  const groupSlots = (allSlots) => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    allSlots.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      if (hour < 12) groups.Morning.push(slot);
      else if (hour < 17) groups.Afternoon.push(slot);
      else groups.Evening.push(slot);
    });
    return groups;
  };
  const groupedSlots = groupSlots(slots);

  const handleJoinWaitlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        toast.error("Please login to join the waitlist");
        return;
    }

    setJoiningWaitlist(true);
    try {
        await api.post("/api/waitlist/join", null, {
            params: {
                userId: userId,
                doctorId: selectedDoctor.id,
                date: date
            }
        });
        toast.success("You are on the waitlist! We'll email you if a slot opens.");
    } catch (err) {
        const msg = err.response?.data || "Failed to join waitlist";
        if(typeof msg === 'string' && msg.includes("already")) {
            toast("You are already on the list for this day!", { icon: 'ℹ️' });
        } else {
            toast.error("Could not join waitlist.");
        }
    } finally {
        setJoiningWaitlist(false);
    }
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      const formatTime = (t) => t.substring(0, 5);
      const res = await api.post("/api/appointments/book", {
        doctorId: selectedDoctor.id,
        date: date,
        startTime: formatTime(selectedSlot.startTime),
        endTime: formatTime(selectedSlot.endTime),
      });

      toast.success("Appointment Booked! 🎉");
      setConfirmedAppointment({
        ...res.data, 
        userName: "My Appointment" 
      });
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const changeStep = (newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleDoctorSelect = (doc) => {
    setSelectedDoctor(doc);
    setTimeout(() => {
      changeStep(2);
    }, 300);
  };

  return (
    <div style={styles.container}>
      <div style={styles.progressBarBg}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 3) * 100}%` }}
          style={styles.progressBarFill}
        />
      </div>

      <div style={styles.contentPadding}>
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div style={styles.headerRow}>
                <div>
                  <span style={styles.stepBadge}>Step 1/3</span>
                  <h2 style={styles.heading}>Select Specialist</h2>
                </div>
                <input 
                  type="text" 
                  placeholder="🔍 Search doctors..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchBarCompact}
                />
              </div>

              <div style={styles.chipContainer}>
                {specializations.map(spec => (
                  <motion.button
                    key={spec}
                    onClick={() => setActiveFilter(spec)}
                    style={activeFilter === spec ? styles.chipActive : styles.chip}
                    whileTap={{ scale: 0.95 }}
                  >
                    {spec}
                  </motion.button>
                ))}
              </div>

              <motion.div layout style={styles.doctorGrid}>
                <AnimatePresence>
                  {filteredDoctors.map(doc => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={doc.id} 
                      style={selectedDoctor?.id === doc.id ? {...styles.docCard, ...styles.docCardActive} : styles.docCard}
                      onClick={() => handleDoctorSelect(doc)}
                      whileHover={{ y: -3, boxShadow: "0 8px 15px rgba(0,0,0,0.08)" }}
                    >
                      <div style={styles.cardContent}>
                        <div style={styles.avatar}>{doc.name.charAt(0)}</div>
                        <div style={styles.textInfo}>
                          <h3 style={styles.docName}>{doc.name}</h3>
                          <p style={styles.docSpec}>{doc.specialization}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <div style={styles.footerAction}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  disabled={!selectedDoctor} 
                  onClick={() => changeStep(2)}
                  style={selectedDoctor ? styles.btnPrimary : styles.btnDisabled}
                >
                  Next Step &rarr;
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div style={styles.headerRow}>
                <div>
                  <span style={styles.stepBadge}>Step 2/3</span>
                  <h2 style={styles.heading}>Available Slots</h2>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.dateInputContainer}>
                  <label style={styles.label}>Select Date</label>
                  <input type="date" value={date} onChange={handleDateChange} style={styles.dateInput} />
                </div>

                {date && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.slotSection}>
                    {loadingSlots ? (
                      <div style={styles.slotGrid}>
                        {[1,2,3,4].map(i => <div key={i} style={{height:'45px', background:'#eee', borderRadius:'8px'}}></div>)}
                      </div>
                    ) : slots.length === 0 ? (
                      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={styles.waitlistCard}>
                        <div style={{fontSize: '30px', marginBottom: '10px'}}>🔔</div>
                        <h3 style={{margin: '0 0 5px 0', fontSize:'16px', color: '#333'}}>Fully Booked</h3>
                        <p style={{margin: '0 0 15px 0', fontSize:'13px', color: '#666'}}>Join the priority waitlist to be notified of cancellations.</p>
                        <button onClick={handleJoinWaitlist} disabled={joiningWaitlist} style={styles.btnWaitlist}>
                          {joiningWaitlist ? "Joining..." : "Join Waitlist"}
                        </button>
                      </motion.div>
                    ) : (
                      <div>
                        {['Morning', 'Afternoon', 'Evening'].map((period, pIdx) => (
                          groupedSlots[period].length > 0 && (
                            <div key={period} style={styles.timeGroup}>
                              <h4 style={styles.groupTitle}>{period}</h4>
                              <div style={styles.slotGrid}>
                                {groupedSlots[period].map((slot, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    whileHover={{ scale: 1.05 }}
                                    style={selectedSlot === slot ? {...styles.slotBox, ...styles.slotBoxActive} : styles.slotBox} 
                                    onClick={() => setSelectedSlot(slot)}
                                  >
                                    {slot.startTime.substring(0, 5)}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              <div style={styles.footerAction}>
                <button onClick={() => changeStep(1)} style={styles.btnSecondary}>&larr; Back</button>
                <motion.button 
                  disabled={!selectedSlot} 
                  onClick={() => changeStep(3)}
                  style={selectedSlot ? styles.btnPrimary : styles.btnDisabled}
                >
                  Review &rarr;
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div style={styles.confirmContainer}>
                <span style={styles.stepBadge}>Step 3/3</span>
                <h2 style={styles.heading}>Confirm Booking</h2>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryHeader}>
                    <div style={styles.avatarSmall}>{selectedDoctor.name.charAt(0)}</div>
                    <div>
                      <h3 style={{margin:0, fontSize: '18px'}}>{selectedDoctor.name}</h3>
                      <span style={{fontSize:'13px', color:'#777'}}>{selectedDoctor.specialization}</span>
                    </div>
                  </div>
                  <hr style={styles.divider} />
                  <div style={styles.summaryRow}><span>📅 Date</span><strong>{date}</strong></div>
                  <div style={styles.summaryRow}><span>⏰ Time</span><strong>{selectedSlot.startTime.substring(0,5)}</strong></div>
                </div>

                <div style={styles.footerAction}>
                  <button onClick={() => changeStep(2)} style={styles.btnSecondary}>Change</button>
                  <motion.button onClick={handleConfirmBooking} disabled={isBooking} style={styles.btnConfirm}>
                    {isBooking ? "Booking..." : "Confirm & Book"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {confirmedAppointment && (
        <AppointmentReceipt 
          appointment={confirmedAppointment} 
          onClose={() => {
            setConfirmedAppointment(null);
            onBookingComplete(); 
          }} 
        />
      )}
    </div>
  );
}

const pageVariants = {
  initial: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: (direction) => ({ x: direction > 0 ? -30 : 30, opacity: 0, transition: { duration: 0.2 } })
};

const styles = {
  // PULLED LEFT AND WIDER
  container: { 
    width: "100%", 
    maxWidth: "1100px", 
    marginLeft: "20px", 
    background: "#fff", 
    borderRadius: "20px", 
    boxShadow: "0 4px 25px rgba(0,0,0,0.03)", 
    overflow: "hidden" 
  },
  
  progressBarBg: { height: "4px", background: "#f0f0f0", width: "100%" },
  progressBarFill: { height: "100%", background: "#1a73e8" },
  contentPadding: { padding: "35px 45px" },

  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "25px" },
  stepBadge: { fontSize: "11px", textTransform: "uppercase", color: "#1a73e8", fontWeight: "bold", letterSpacing: "1px", marginBottom: "5px", display: "block" },
  heading: { color: "#202124", fontSize: "24px", margin: 0, fontWeight: "700" },
  searchBarCompact: { padding: "10px 18px", borderRadius: "25px", border: "1px solid #eee", fontSize: "14px", width: "250px", outline: "none" },

  chipContainer: { display: "flex", gap: "10px", marginBottom: "25px", overflowX: "auto", paddingBottom: "5px" },
  chip: { padding: "8px 16px", borderRadius: "20px", border: "1px solid #f0f0f0", background: "#fff", color: "#555", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" },
  chipActive: { padding: "8px 16px", borderRadius: "20px", border: "none", background: "#202124", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600" },

  doctorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" },
  docCard: { background: "#fff", padding: "20px", borderRadius: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", cursor: "pointer", border: "1px solid #f5f5f5", textAlign: 'center' },
  docCardActive: { borderColor: "#1a73e8", backgroundColor: "#fbfdff" },
  
  avatar: { width: "55px", height: "55px", background: "linear-gradient(135deg, #e8f0fe 0%, #c2d7ff 100%)", color: "#1a73e8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "bold", margin: "0 auto 12px auto" },
  docName: { margin: "0 0 4px 0", fontSize: "16px", color: "#202124", fontWeight: "600" },
  docSpec: { margin: 0, fontSize: "12px", color: "#666" },

  card: { background: "#f8f9fa", padding: "30px", borderRadius: "20px", border: "1px solid #eee" },
  dateInput: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", width: "100%", maxWidth: "280px", outline: "none" },
  label: { display: "block", marginBottom: "10px", fontWeight: "700", color: "#444", fontSize: "14px" },
  timeGroup: { marginBottom: "25px" },
  groupTitle: { fontSize: "13px", color: "#999", marginBottom: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" },
  slotBox: { padding: "12px", textAlign: "center", background: "#fff", borderRadius: "10px", cursor: "pointer", fontSize: "14px", color: "#444", border: "1px solid #e0e0e0", transition: "all 0.2s" },
  slotBoxActive: { background: "#202124", color: "#fff", borderColor: "#202124", fontWeight: "bold" },
  
  waitlistCard: { textAlign: "center", padding: "35px", background: "#fff", borderRadius: "15px", border: "1px dashed #ccc" },
  btnWaitlist: { padding: "12px 24px", background: "#fbbc04", color: "#333", border: "none", borderRadius: "25px", fontSize: "14px", fontWeight: "700", cursor: "pointer" },

  summaryCard: { background: "#f8f9fa", padding: "35px", borderRadius: "25px", border: "1px solid #eee", maxWidth: "450px", margin: "0 auto 25px auto", textAlign: "left" },
  summaryHeader: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" },
  avatarSmall: { width: "45px", height: "45px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "1px solid #eee" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "15px" },
  divider: { border: "none", borderTop: "1px solid #eee", margin: "20px 0" },

  footerAction: { marginTop: "35px", display: "flex", gap: "15px", justifyContent: "center" },
  btnPrimary: { padding: "14px 45px", background: "#202124", color: "#fff", border: "none", borderRadius: "30px", fontSize: "15px", cursor: "pointer", fontWeight: "600" },
  btnSecondary: { padding: "14px 35px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "30px", fontSize: "15px", cursor: "pointer" },
  btnConfirm: { padding: "14px 50px", background: "#137333", color: "#fff", border: "none", borderRadius: "30px", fontSize: "15px", cursor: "pointer", fontWeight: "700" },
  btnDisabled: { padding: "14px 45px", background: "#eee", color: "#aaa", border: "none", borderRadius: "30px", cursor: "not-allowed" },
};

export default BookAppointment;