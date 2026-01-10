import React from "react";

function DoctorSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "overview", label: "📊 Overview" },
    { id: "appointments", label: "📅 Appointments" },
    { id: "schedule", label: "⏰ Set Availability" },
    // ✅ NEW ITEM
    { id: "scan", label: "📷 Scan Ticket" },
  ];

  return (
    <aside style={styles.sidebar}>
      <ul style={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={activeTab === item.id ? styles.activeItem : styles.item}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#fff",
    borderRight: "1px solid #e0e0e0",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    padding: "12px 15px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#5f6368",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  activeItem: {
    padding: "12px 15px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#e8f0fe",
    color: "#1a73e8",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default DoctorSidebar;