import React, { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./DoctorTheme.css"; // ✅ Uses the professional theme

// ✅ Icons
import { 
    XOctagon, RefreshCw, Search, Calendar, Clock, AlertCircle, 
    ArrowLeft, LogOut, FileWarning, User
} from "lucide-react";

const CancelledPatients = () => {
    const navigate = useNavigate();
    const [cancelledList, setCancelledList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [doctorName, setDoctorName] = useState("Doctor");

    useEffect(() => {
        fetchProfile();
        fetchCancelledPatients();
    }, []);

    // 1. Fetch Profile for Layout
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/doctor/me");
            setDoctorName(res.data.name);
        } catch (e) {
            // silent fail or redirect to login
        }
    };

    // 2. Search Logic
    useEffect(() => {
        if (!searchTerm) {
            setFilteredList(cancelledList);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredList(cancelledList.filter(item => 
                item.patientName.toLowerCase().includes(lower) ||
                (item.cancellationReason && item.cancellationReason.toLowerCase().includes(lower))
            ));
        }
    }, [searchTerm, cancelledList]);

    const fetchCancelledPatients = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/doctor/appointments/cancelled`);
            // Sort by latest cancelled first
            const sorted = res.data.sort((a, b) => new Date(b.cancelledOn) - new Date(a.cancelledOn));
            setCancelledList(sorted);
            setFilteredList(sorted);
        } catch (error) {
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="app-wrapper">
            
            {/* ================= HEADER (Layout) ================= */}
            <nav className="navbar">
                <div className="logo-section" onClick={() => navigate('/doctor')}>
                    Health<span style={{color: '#2563eb'}}>Connect</span> 
                    <span className="role-badge">Doctor Portal</span>
                </div>
                <div className="user-section">
                    <span className="welcome-text">Dr. {doctorName}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            {/* ================= MAIN CONTENT ================= */}
            <div className="page-container" style={{marginTop: '30px'}}>
                
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate('/doctor')} 
                    className="btn-secondary"
                    style={{marginBottom: '24px', display: 'inline-flex', padding: '8px 16px', border:'none', background:'transparent', boxShadow:'none', paddingLeft:0, fontSize:15, color:'#64748b'}}
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                {/* Glass Header Page Title */}
                <div className="glass-header">
                    <div className="page-title">
                        <h2 style={{color: '#ef4444'}}>
                            <div style={{padding:8, background:'#fef2f2', borderRadius:8}}><XOctagon size={24} /></div>
                            Cancelled Archives
                        </h2>
                        <p className="page-subtitle">Historical records of all cancelled appointments and reasons.</p>
                    </div>
                    
                    <div className="control-group">
                        <div style={{position:'relative'}}>
                            <Search size={16} style={{position:'absolute', left:14, top:14, color:'#94a3b8'}} />
                            <input 
                                type="text" 
                                className="modern-input" 
                                style={{paddingLeft: 40}}
                                placeholder="Search by name or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-secondary" onClick={fetchCancelledPatients}>
                            <RefreshCw size={16} /> Refresh List
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                {loading ? (
                    <div style={{textAlign:'center', padding:80, color:'#64748b'}}>Loading archives...</div>
                ) : filteredList.length === 0 ? (
                    <div style={{textAlign:'center', padding:80, background:'white', borderRadius:16, border:'1px dashed #e2e8f0'}}>
                        <div style={{fontSize:40, marginBottom:15}}>✨</div>
                        <h3 style={{color:'#0f172a', margin:0}}>No records found</h3>
                        <p style={{color:'#64748b', marginTop:8}}>Your cancellation history is clean.</p>
                    </div>
                ) : (
                    <div className="modern-table-wrapper">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th><div style={{display:'flex', gap:8, alignItems:'center'}}><Calendar size={14}/> Original Date</div></th>
                                    <th><div style={{display:'flex', gap:8, alignItems:'center'}}><Clock size={14}/> Time</div></th>
                                    <th>Reason Provided</th>
                                    <th>Cancelled On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map((appt) => (
                                    <tr key={appt.id}>
                                        <td>
                                            <div style={{display:'flex', gap:10, alignItems:'center'}}>
                                                <div style={{width:32, height:32, background:'#f1f5f9', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b'}}>
                                                    <User size={16}/>
                                                </div>
                                                <span style={{fontWeight: 600, color: '#1e293b'}}>{appt.patientName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{background:'#f8fafc', padding:'6px 10px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, fontWeight:500, color:'#334155'}}>
                                                {appt.appointmentDate}
                                            </span>
                                        </td>
                                        <td style={{fontWeight:600, color:'#475569'}}>{appt.startTime}</td>
                                        <td>
                                            <div style={{display:'flex', alignItems:'center', gap:8, color: '#b91c1c', background:'#fef2f2', padding:'6px 10px', borderRadius:8, width:'fit-content'}}>
                                                <FileWarning size={14} />
                                                <span style={{fontSize:13, fontWeight:500}}>{appt.cancellationReason || "No reason"}</span>
                                            </div>
                                        </td>
                                        <td style={{color:'#64748b', fontSize:13}}>
                                            {new Date(appt.cancelledOn).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ================= FOOTER ================= */}
            <footer className="footer-bar">
                &copy; 2026 HealthConnect Doctor Portal. Secure & HIPAA Compliant.
            </footer>
        </div>
    );
};

export default CancelledPatients;