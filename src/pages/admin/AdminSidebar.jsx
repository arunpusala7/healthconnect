function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "home", label: "Dashboard", icon: "📊" },
    { id: "add-doctor", label: "Add Doctor", icon: "👨‍⚕️" },
    { id: "doctors", label: "Manage Doctors", icon: "🏥" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "availability", label: "Set Availability", icon: "🕒" },
  ];

  return (
    <aside style={styles.sidebar}>
      <ul style={styles.menuList}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            style={activeTab === item.id ? { ...styles.menuItem, ...styles.active } : styles.menuItem}
            onClick={() => setActiveTab(item.id)}
          >
            <span style={styles.icon}>{item.icon}</span>
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
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    padding: "20px 0",
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: "15px 25px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#5f6368",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "all 0.2s ease",
  },
  active: {
    backgroundColor: "#e8f0fe", // Google light blue
    color: "#1a73e8",
    borderRight: "3px solid #1a73e8",
  },
  icon: {
    fontSize: "18px",
  },
};

export default AdminSidebar;