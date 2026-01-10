import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api/api";
import toast from "react-hot-toast"; 
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Reschedule State ---
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlot, setNewSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- Prescription State ---
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState(null);
  const prescriptionRef = useRef();

  // --- Cancel Modal State ---
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [apptToCancel, setApptToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const cancellationReasons = [
    "I am busy on that date",
    "I will go to a nearby hospital",
    "Health issue resolved",
    "Doctor unavailable",
    "Found a better slot",
    "Other"
  ];

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/appointments/my");
      setAppointments(res.data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // --- 1. Cancellation Logic ---
  const initiateCancel = (appt) => {
    setApptToCancel(appt);
    setCancelReason(""); 
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      toast.error("Please select a reason");
      return;
    }
    try {
      await api.put(`/api/appointments/${apptToCancel.appointmentId}/cancel`, cancelReason, {
        headers: { 'Content-Type': 'text/plain' }
      });
      toast.success("Appointment Cancelled");
      setCancelModalOpen(false);
      loadAppointments();
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  // --- 2. Reschedule Logic ---
  const openRescheduleModal = (appt) => {
    setSelectedAppt(appt);
    setNewDate("");
    setAvailableSlots([]);
    setNewSlot(null);
    setRescheduleModalOpen(true);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setNewDate(date);
    setNewSlot(null);
    
    if (!date || !selectedAppt?.doctorId) return;

    setLoadingSlots(true);
    try {
      // Updated to match your backend: RescheduleController.java
      const res = await api.get("/api/reschedule/slots", {
        params: {
          appointmentId: selectedAppt.appointmentId,
          doctorId: selectedAppt.doctorId,
          date: date
        }
      });
      setAvailableSlots(res.data.slots || []);
    } catch (err) {
      toast.error("Could not fetch slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!newDate || !newSlot) return;
    const toastId = toast.loading("Rescheduling...");
    try {
      await api.put(`/api/reschedule/${selectedAppt.appointmentId}`, {
        newDate,
        startTime: newSlot.startTime.substring(0, 5),
        endTime: newSlot.endTime.substring(0, 5)
      });
      toast.success("Rescheduled Successfully!", { id: toastId });
      setRescheduleModalOpen(false);
      loadAppointments();
    } catch {
      toast.error("Reschedule Failed", { id: toastId });
    }
  };

  // --- 3. Prescription Logic ---
  const openPrescriptionModal = (appt) => {
    setSelectedPrescriptionAppt(appt);
    setPrescriptionModalOpen(true);
  };

  const downloadPDF = async () => {
    const element = prescriptionRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Prescription-${selectedPrescriptionAppt.ticketId || 'record'}.pdf`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Appointments</h2>
        <button style={styles.refreshBtn} onClick={loadAppointments}>Refresh List ↻</button>
      </div>

      {loading && <p>Loading appointments...</p>}
      {!loading && appointments.length === 0 && <div style={styles.empty}>No appointments found.</div>}

      <div style={styles.grid}>
        {appointments.map((a) => (
          <div key={a.appointmentId} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.docInfo}>
                <span style={styles.icon}>👨‍⚕️</span>
                <div>
                  <h4 style={styles.docName}>Dr. {a.doctorName}</h4>
                  <span style={styles.date}>{a.date}</span>
                </div>
              </div>
              <span style={getStatusStyle(a.status)}>{a.status}</span>
            </div>
            <div style={styles.cardBody}>
               <p style={styles.timeLabel}>Scheduled Time:</p>
               <p style={styles.timeValue}>{a.startTime} – {a.endTime || '---'}</p>
            </div>

            <div style={styles.actions}>
              {(a.status === "BOOKED" || a.status === "RESCHEDULED") && (
                <>
                  <button style={styles.cancelBtn} onClick={() => initiateCancel(a)}>Cancel</button>
                  <button style={styles.rescheduleBtn} onClick={() => openRescheduleModal(a)}>Reschedule</button>
                </>
              )}
              {a.status === "COMPLETED" && (
                <button style={styles.prescriptionBtn} onClick={() => openPrescriptionModal(a)}>📄 View Prescription</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- CANCEL MODAL --- */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div style={styles.overlay} onClick={() => setCancelModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={styles.modal} onClick={e => e.stopPropagation()}
            >
              <h3>Cancel Appointment 🚫</h3>
              <p style={{color: '#666', fontSize: '14px'}}>
                Please tell us why you are cancelling with Dr. {apptToCancel?.doctorName}.
              </p>
              <div style={{marginBottom: '20px'}}>
                  <label style={styles.label}>Reason:</label>
                  <select style={styles.select} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                    <option value="">-- Select a Reason --</option>
                    {cancellationReasons.map((r, i) => <option key={i} value={r}>{r}</option>)}
                  </select>
              </div>
              <div style={styles.modalActions}>
                <button onClick={() => setCancelModalOpen(false)} style={styles.btnCancelText}>Keep Appointment</button>
                <button onClick={handleConfirmCancel} style={styles.btnDanger}>Confirm Cancellation</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RESCHEDULE MODAL --- */}
      <AnimatePresence>
        {rescheduleModalOpen && (
          <div style={styles.overlay} onClick={() => setRescheduleModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={styles.modal} onClick={e => e.stopPropagation()}
            >
              <h3 style={{margin: '0 0 10px 0'}}>📅 Reschedule</h3>
              <div style={{marginBottom: '15px'}}>
                <label style={styles.label}>New Date:</label>
                <input type="date" value={newDate} min={new Date().toISOString().split("T")[0]} onChange={handleDateChange} style={styles.input} />
              </div>
              {newDate && (
                <div style={{marginBottom: '20px'}}>
                  <label style={styles.label}>Available Slots:</label>
                  {loadingSlots ? <p style={{fontSize:'12px'}}>Loading slots...</p> : (
                    <div style={styles.slotGrid}>
                      {availableSlots.length > 0 ? availableSlots.map((slot, idx) => (
                        <button key={idx} onClick={() => setNewSlot(slot)} style={newSlot === slot ? styles.slotActive : styles.slot}>
                          {slot.startTime.substring(0,5)}
                        </button>
                      )) : <p style={{fontSize:'12px', color:'red'}}>No slots available</p>}
                    </div>
                  )}
                </div>
              )}
              <div style={styles.modalActions}>
                <button onClick={() => setRescheduleModalOpen(false)} style={styles.btnCancel}>Cancel</button>
                <button onClick={handleConfirmReschedule} disabled={!newSlot} style={newSlot ? styles.btnConfirm : styles.btnDisabled}>Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PRESCRIPTION MODAL (LETTERHEAD) --- */}
      <AnimatePresence>
        {prescriptionModalOpen && selectedPrescriptionAppt && (
           <div style={styles.overlay} onClick={() => setPrescriptionModalOpen(false)}>
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               style={styles.modalPaper} onClick={e => e.stopPropagation()}
             >
               <div style={{display:'flex', justifyContent:'flex-end'}}><button onClick={() => setPrescriptionModalOpen(false)} style={styles.closeBtn}>×</button></div>
               <div ref={prescriptionRef} style={styles.letterhead}>
                 <div style={styles.letterHeader}>
                     <h1 style={{margin: 0, fontSize: '24px', color: '#1a73e8', textTransform: 'uppercase'}}>HealthConnect Hospital</h1>
                     <p style={{margin: '5px 0 0', fontSize: '12px', color: '#555'}}>123, Wellness Avenue, Tech City, India | Ph: +91 98765 43210</p>
                     <hr style={{border: 'none', borderBottom: '2px solid #1a73e8', marginTop: '15px'}} />
                 </div>
                 <div style={styles.docDetails}>
                     <div style={{flex: 1}}>
                         <p style={styles.metaLabel}>DOCTOR</p>
                         <h3 style={styles.metaValue}>Dr. {selectedPrescriptionAppt.doctorName}</h3>
                         <span style={styles.specializationBadge}>{selectedPrescriptionAppt.doctorSpecialization || "General Physician"}</span>
                     </div>
                     <div style={{flex: 1, textAlign: 'right'}}>
                         <p style={styles.metaLabel}>DATE</p>
                         <h3 style={styles.metaValue}>{selectedPrescriptionAppt.date}</h3>
                     </div>
                 </div>
                 <div style={styles.patientBox}>
                     <div><p style={styles.metaLabel}>Patient Name</p><p style={{margin:0, fontSize: '14px', fontWeight:'bold'}}>{selectedPrescriptionAppt.userName || "User"}</p></div>
                     <div style={{textAlign: 'right'}}><p style={styles.metaLabel}>Ticket ID</p><p style={{margin:0, fontSize: '14px', fontFamily: 'monospace'}}>#{selectedPrescriptionAppt.ticketId?.substring(0,8) || 'N/A'}</p></div>
                 </div>
                 <div style={styles.rxBody}>
                     <h2 style={{color: '#1a73e8', fontFamily: 'serif', fontSize: '32px', margin: '0 0 15px 0'}}>℞</h2>
                     <div style={styles.notesText}>
                         {selectedPrescriptionAppt.prescription ? (
                             selectedPrescriptionAppt.prescription.split('\n').map((line, i) => (
                               <div key={i} style={{marginBottom: '10px', display: 'flex'}}><span style={{color:'#1a73e8', marginRight: '8px'}}>•</span><span>{line}</span></div>
                             ))
                         ) : (<p style={{color: '#888', fontStyle: 'italic'}}>No specific notes provided.</p>)}
                     </div>
                 </div>
                 <div style={styles.letterFooter}>
                     <div style={{flex: 1}}><p style={{fontSize: '10px', color: '#888'}}>Digitally generated on {new Date().toLocaleDateString()}</p></div>
                     <div style={styles.stampContainer}><div style={styles.stampBox}><span>✔ VERIFIED</span></div></div>
                 </div>
               </div>
               <div style={styles.modalActions}><button onClick={downloadPDF} style={styles.btnDownload}>⬇ Download PDF</button></div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const getStatusStyle = (status) => {
  if (status === 'COMPLETED') return styles.badgeCompleted;
  if (status === 'CANCELLED') return styles.badgeCancelled;
  if (status === 'RESCHEDULED') return styles.badgeRescheduled;
  return styles.badgeBooked;
};

const styles = {
  container: { maxWidth: "1000px", margin: "40px auto", padding: '0 20px' },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { color: "#2c3e50", margin: 0 },
  refreshBtn: { background: "transparent", border: "1px solid #ddd", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", color: "#555" },
  empty: { textAlign: "center", padding: "40px", background: "#fff", borderRadius: "12px", color: "#888" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #eaeaea" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" },
  docInfo: { display: "flex", alignItems: "center", gap: "10px" },
  icon: { fontSize: "24px", background: "#f0f4f8", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" },
  docName: { margin: "0", fontSize: "16px", color: "#333" },
  date: { fontSize: "13px", color: "#777" },
  cardBody: { background: "#f9f9f9", padding: "10px", borderRadius: "8px", marginBottom: "15px" },
  timeLabel: { margin: "0 0 5px 0", fontSize: "12px", color: "#777" },
  timeValue: { margin: "0", fontWeight: "600", color: "#333" },
  badgeBooked: { background: "#e3f2fd", color: "#1565c0", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  badgeCompleted: { background: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  badgeCancelled: { background: "#ffebee", color: "#c62828", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  badgeRescheduled: { background: "#fff8e1", color: "#f57f17", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  actions: { display: 'flex', gap: '10px' },
  cancelBtn: { flex: 1, padding: "8px", background: "#fff", border: "1px solid #ffcdd2", color: "#d32f2f", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  rescheduleBtn: { flex: 1, padding: "8px", background: "#e8f0fe", border: "1px solid #1a73e8", color: "#1a73e8", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  prescriptionBtn: { width: "100%", padding: "10px", background: "#1a73e8", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '380px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#444' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background:'white' },
  btnDanger: { padding: '10px 20px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  btnCancelText: { padding: '10px 15px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '13px' },
  slotGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  slot: { padding: '8px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  slotActive: { padding: '8px', border: '1px solid #1a73e8', background: '#1a73e8', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  btnConfirm: { padding: '10px 20px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  btnDisabled: { padding: '10px 20px', background: '#e0e0e0', color: '#999', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontSize: '13px' },
  btnCancel: { padding: '10px 15px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '13px' },
  modalPaper: { background: '#eee', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' },
  letterhead: { background: 'white', padding: '40px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', color: '#333' },
  letterHeader: { textAlign: 'center', marginBottom: '20px' },
  docDetails: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  metaLabel: { fontSize: '10px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' },
  metaValue: { fontSize: '16px', margin: 0, color: '#222' },
  specializationBadge: { fontSize: '12px', color: '#1a73e8', background: '#e8f0fe', padding: '2px 8px', borderRadius: '4px' },
  patientBox: { background: '#f8fbff', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', border: '1px solid #e1f5fe' },
  rxBody: { minHeight: '150px' },
  notesText: { fontSize: '14px', lineHeight: '1.6' },
  letterFooter: { marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' },
  stampContainer: { textAlign: 'right' },
  stampBox: { border: '2px solid #2e7d32', color: '#2e7d32', padding: '5px', fontWeight: 'bold', transform: 'rotate(-5deg)' },
  btnDownload: { padding: '12px 25px', background: '#202124', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }
};

export default MyAppointments;