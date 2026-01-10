function UserSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "🏠" },
    // Profile removed from here (still accessible via top-right menu)
    { id: "book", label: "Book Appointment", icon: "➕" },
    { id: "my-appointments", label: "History", icon: "📅" },
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
    width: "200px", 
    backgroundColor: "#ffffff", 
    borderRight: "1px solid #eaeaea", 
    padding: "20px 10px" 
  },
  menuList: { 
    listStyle: "none", 
    padding: 0, 
    margin: 0, 
    display: "flex", 
    flexDirection: "column", 
    gap: "5px" 
  },
  menuItem: { 
    padding: "10px 15px", 
    fontSize: "13px",     
    fontWeight: "500", 
    color: "#5f6368", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    borderRadius: "8px", 
    transition: "all 0.2s ease" 
  },
  active: { 
    backgroundColor: "#e8f0fe", 
    color: "#1a73e8", 
    fontWeight: "600" 
  },
  icon: { fontSize: "16px" },
};

export default UserSidebar;