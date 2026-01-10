import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, User, Activity } from 'lucide-react';

const PatientHistoryDrawer = ({ isOpen, onClose, history, patientName }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - dims the background */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000]"
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                    />
                    
                    {/* Side Drawer */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed', right: 0, top: 0, height: '100vh',
                            width: '450px', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                            zIndex: 1001, padding: '30px', overflowY: 'auto'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>{patientName}</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Medical History</p>
                            </div>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Timeline Wrapper */}
                        <div style={{ position: 'relative', borderLeft: '2px solid #e2e8f0', marginLeft: '15px', paddingLeft: '30px' }}>
                            {history.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                                    <Activity size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                    <p>No past appointments found.</p>
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <div key={index} style={{ marginBottom: '40px', position: 'relative' }}>
                                        {/* Timeline Dot */}
                                        <div style={{ 
                                            position: 'absolute', left: '-41px', top: '5px', 
                                            width: '20px', height: '20px', borderRadius: '50%', 
                                            background: 'white', border: '4px solid #2563eb' 
                                        }} />
                                        
                                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#475569', fontWeight: '700', fontSize: '14px' }}>
                                                <Calendar size={14} />
                                                {item.date}
                                            </div>
                                            <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                                                <FileText size={18} style={{ color: '#2563eb', marginTop: '2px' }} />
                                                <div>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>Prescription</span>
                                                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', fontStyle: 'italic', lineHeight: '1.5' }}>
                                                        "{item.prescription || "No notes recorded"}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PatientHistoryDrawer;