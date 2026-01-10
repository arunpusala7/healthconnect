import React, { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./DoctorTheme.css"; 

import { 
    Calendar, CheckCircle, XCircle, FileText, Search, 
    FolderClock, AlertTriangle, User, Hash, History 
} from "lucide-react";

const TodayAppointments = ({ onViewHistory, isLoadingHistory }) => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppts, setFilteredAppts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState("");

    const [completeModal, setCompleteModal] = useState({ show: false, id: null });
    const [cancelModal, setCancelModal] = useState({ show: false, id: null });
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredAppts(appointments);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredAppts(appointments.filter(a => 
                a.userName.toLowerCase().includes(lower) || 
                (a.ticketId && a.ticketId.includes(lower))
            ));
        }
    }, [searchTerm, appointments]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/doctor/appointments?date=${selectedDate}`);
            setAppointments(res.data);
            setFilteredAppts(res.data);
        } catch (error) {
            toast.error("Failed to sync appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSubmit = async () => {
        if (!completeModal.id) return;
        try {
            await api.put(`/api/doctor/appointments/${completeModal.id}/complete`, inputText, {
                headers: { 'Content-Type': 'text/plain' }
            });
            toast.success("Prescription Sent! ✅");
            setCompleteModal({ show: false, id: null });
            fetchAppointments();
        } catch (error) {
            toast.error("Failed to complete");
        }
    };

    const handleCancelSubmit = async () => {
        if (!cancelModal.id) return;
        if (!inputText.trim()) return toast.error("Cancellation reason is required");
        
        try {
            await api.put(`/api/doctor/appointments/${cancelModal.id}/cancel`, inputText, {
                headers: { 'Content-Type': 'text/plain' }
            });
            toast.success("Appointment Cancelled");
            setCancelModal({ show: false, id: null });
            fetchAppointments();
        } catch (error) {
            toast.error("Failed to cancel");
        }
    };

    return (
        <div className="page-container">
            <div className="glass-header">
                <div className="page-title">
                    <h2 style={{color:'#1e293b'}}>
                        <Calendar className="text-primary" size={24} color="#2563eb"/> 
                        Schedule Manager
                    </h2>
                    <p className="page-subtitle">
                        Managing <strong>{filteredAppts.length}</strong> appointments for <strong>{selectedDate}</strong>
                    </p>
                </div>
                
                <div className="control-group">
                    <button className="btn-secondary" onClick={() => navigate('/doctor/cancelled')}>
                        <FolderClock size={16} /> Archive History
                    </button>
                    
                    <div style={{position:'relative'}}>
                        <Search size={16} style={{position:'absolute', left:14, top:14, color:'#94a3b8'}} />
                        <input 
                            type="text" 
                            className="modern-input" 
                            style={{paddingLeft: 40}}
                            placeholder="Search by Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <input 
                        type="date" 
                        className="modern-input"
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                    />
                </div>
            </div>

            {loading ? (
                <div style={{textAlign:'center', padding:60, color:'#64748b'}}>
                    <div className="spinner"></div>
                    Loading schedule...
                </div>
            ) : filteredAppts.length === 0 ? (
                <div style={{textAlign:'center', padding:80, background:'white', borderRadius:16, border:'1px dashed #e2e8f0'}}>
                    <div style={{fontSize:48, marginBottom:16}}>📭</div>
                    <h3 style={{color:'#0f172a', margin:0}}>No appointments found</h3>
                    <p style={{color:'#64748b', marginTop:8}}>Enjoy your free time or select a different date.</p>
                </div>
            ) : (
                <div style={{display:'flex', flexDirection:'column', gap: 16}}>
                    <AnimatePresence>
                        {filteredAppts.map((appt) => (
                            <motion.div 
                                key={appt.appointmentId}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="appt-card"
                            >
                                <div className="time-pill">
                                    <span className="time">{appt.startTime.substring(0,5)}</span>
                                    <span className="label">Start</span>
                                </div>

                                <div style={{flex: 1}}>
                                    <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:6}}>
                                        <h3 style={{margin:0, fontSize:18, fontWeight:700, color:'#1e293b'}}>{appt.userName}</h3>
                                        <span className="badge" style={{background:'#f1f5f9', color:'#64748b', fontFamily:'monospace', display:'flex', alignItems:'center', gap:4}}>
                                            <Hash size={10}/> {appt.ticketId ? appt.ticketId.substring(0,6) : '---'}
                                        </span>
                                        <StatusBadge status={appt.status} />
                                        
                                        {/* ✅ UPDATED: History Button with Safety Check */}
                                        <button 
                                            onClick={() => {
                                                if (appt.userId) {
                                                    onViewHistory(appt.userId, appt.userName);
                                                } else {
                                                    console.error("Missing userId in appt:", appt);
                                                    toast.error("Patient ID missing from record");
                                                }
                                            }}
                                            style={styles.historyIconBtn}
                                            title="View Patient History"
                                            disabled={isLoadingHistory}
                                        >
                                            <History size={16} />
                                        </button>
                                    </div>
                                    
                                    {appt.prescription ? (
                                        <p style={{margin:0, fontSize:14, color:'#64748b', display:'flex', gap:8, alignItems:'center'}}>
                                            <FileText size={14} color="#2563eb"/> 
                                            <span>Prescription: <i style={{color:'#334155'}}>{appt.prescription.substring(0, 60)}...</i></span>
                                        </p>
                                    ) : (
                                        <p style={{margin:0, fontSize:14, color:'#94a3b8', display:'flex', gap:8, alignItems:'center'}}>
                                            <User size={14}/> Waiting for consultation...
                                        </p>
                                    )}
                                </div>

                                <div style={{display:'flex', gap:12}}>
                                    {appt.status === 'BOOKED' && (
                                        <>
                                            <button 
                                                className="btn-primary"
                                                onClick={() => {
                                                    setInputText("");
                                                    setCompleteModal({ show: true, id: appt.appointmentId });
                                                }}
                                            >
                                                <CheckCircle size={16} /> Complete
                                            </button>
                                            <button 
                                                className="btn-danger-solid"
                                                onClick={() => {
                                                    setInputText("");
                                                    setCancelModal({ show: true, id: appt.appointmentId });
                                                }}
                                            >
                                                <XCircle size={16} /> Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal Logic remains the same... */}
            <AnimatePresence>
                {(completeModal.show || cancelModal.show) && (
                    <div className="modal-overlay">
                        <motion.div 
                            className="modern-modal"
                            initial={{scale:0.95, opacity:0, y:20}}
                            animate={{scale:1, opacity:1, y:0}}
                            exit={{scale:0.95, opacity:0, y:20}}
                        >
                            {completeModal.show ? (
                                <>
                                    <h3 style={{margin:0, display:'flex', alignItems:'center', gap:10, fontSize:20}}>
                                        <div style={{padding:8, background:'#eff6ff', borderRadius:8, color:'#2563eb'}}><FileText size={20}/></div>
                                        Write Prescription
                                    </h3>
                                    <textarea 
                                        className="modal-textarea" 
                                        placeholder="Enter details..."
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        autoFocus
                                    />
                                    <div style={{display:'flex', justifyContent:'flex-end', gap:12}}>
                                        <button className="btn-secondary" onClick={() => setCompleteModal({show:false, id:null})}>Close</button>
                                        <button className="btn-primary" onClick={handleCompleteSubmit}>Save & Send</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={{margin:0, display:'flex', alignItems:'center', gap:10, fontSize:20, color:'#ef4444'}}>
                                        <div style={{padding:8, background:'#fef2f2', borderRadius:8}}><AlertTriangle size={20}/></div>
                                        Cancel Appointment
                                    </h3>
                                    <textarea 
                                        className="modal-textarea" 
                                        placeholder="Reason..."
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        style={{borderColor: '#fca5a5', background:'#fffafa'}}
                                        autoFocus
                                    />
                                    <div style={{display:'flex', justifyContent:'flex-end', gap:12}}>
                                        <button className="btn-secondary" onClick={() => setCancelModal({show:false, id:null})}>Keep</button>
                                        <button className="btn-danger-solid" onClick={handleCancelSubmit}>Confirm Cancel</button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    historyIconBtn: {
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        transition: 'all 0.2s ease',
        marginLeft: '4px'
    }
};

const StatusBadge = ({ status }) => {
    let className = "badge";
    if (status === 'BOOKED') className += " booked";
    else if (status === 'COMPLETED') className += " completed";
    else if (status === 'CANCELLED') className += " cancelled";
    return <span className={className}>{status}</span>;
};

export default TodayAppointments;