import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AppointmentReceipt = ({ appointment, onClose }) => {
  const receiptRef = useRef();

  const downloadPDF = async () => {
    const element = receiptRef.current;
    
    // 1. Capture the receipt design as an image
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    // 2. Generate PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(data, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`Ticket-${appointment.ticketId || "booking"}.pdf`);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* === THIS SECTION IS WHAT GETS DOWNLOADED === */}
        <div ref={receiptRef} style={styles.ticketContainer}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.logo}>HealthConnect</h1>
                <span style={styles.tag}>OFFICIAL E-TICKET</span>
            </div>

            {/* Ticket Content */}
            <div style={styles.content}>
                <div style={styles.leftCol}>
                    <div style={styles.field}>
                        <span style={styles.label}>Patient Name</span>
                        <h3 style={styles.value}>{appointment.userName || "Valued Patient"}</h3>
                    </div>
                    <div style={styles.field}>
                        <span style={styles.label}>Doctor</span>
                        <h3 style={styles.value}>{appointment.doctorName}</h3>
                    </div>
                    
                    <div style={styles.row}>
                         <div style={styles.field}>
                            <span style={styles.label}>Date</span>
                            <p style={styles.value}>{appointment.date}</p>
                        </div>
                        <div style={styles.field}>
                            <span style={styles.label}>Time</span>
                            <p style={styles.value}>{appointment.startTime}</p>
                        </div>
                    </div>
                </div>
                
                <div style={styles.rightCol}>
                    {/* QR Code */}
                    <div style={styles.qrBox}>
                        <QRCodeCanvas 
                            value={appointment.ticketId || "invalid"} 
                            size={120} 
                            level={"H"} // High error correction
                        />
                    </div>
                    <p style={styles.ticketId}>ID: {appointment.ticketId ? appointment.ticketId.substring(0,8) : "---"}...</p>
                    <span style={styles.statusBadge}>CONFIRMED</span>
                </div>
            </div>

            <div style={styles.footer}>
                <p>Please present this QR code at the reception desk upon arrival.</p>
            </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={downloadPDF} style={styles.btnDownload}>📥 Download PDF</button>
          <button onClick={onClose} style={styles.btnClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
  modal: { width: "100%", maxWidth: "600px", padding: "20px" },
  
  ticketContainer: { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" },
  
  header: { background: "#1a73e8", padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" },
  logo: { margin: 0, fontSize: "22px", fontWeight: "bold" },
  tag: { fontSize: "10px", border: "1px solid rgba(255,255,255,0.5)", padding: "4px 8px", borderRadius: "4px", letterSpacing: "1px" },
  
  content: { display: "flex", padding: "30px", flexDirection: "row" },
  leftCol: { flex: 2, borderRight: "2px dashed #eee", paddingRight: "20px" },
  rightCol: { flex: 1, paddingLeft: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  
  field: { marginBottom: "20px" },
  row: { display: "flex", gap: "30px" },
  label: { fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" },
  value: { margin: 0, fontSize: "16px", fontWeight: "bold", color: "#333" },
  
  qrBox: { padding: "10px", background: "#fff", border: "1px solid #eee", borderRadius: "8px" },
  ticketId: { fontSize: "10px", color: "#aaa", marginTop: "10px", fontFamily: "monospace" },
  statusBadge: { marginTop: "15px", background: "#e8f5e9", color: "#2e7d32", padding: "5px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" },
  
  footer: { background: "#f8f9fa", padding: "15px", textAlign: "center", fontSize: "12px", color: "#666", borderTop: "1px solid #eee" },
  
  actions: { marginTop: "20px", display: "flex", justifyContent: "center", gap: "15px" },
  btnDownload: { padding: "12px 25px", background: "#1a73e8", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
  btnClose: { padding: "12px 25px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }
};

export default AppointmentReceipt;