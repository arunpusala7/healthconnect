import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./DoctorSchedule.css"; // ✅ Import the new CSS
import api from "../../api/api";
import toast from "react-hot-toast";

const localizer = momentLocalizer(moment);

const DoctorSchedule = () => {
  const [events, setEvents] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [view, setView] = useState("week"); // 'month', 'week', 'day'

  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    if (doctorId) fetchSlots();
  }, [doctorId]);

  const fetchSlots = async () => {
    try {
      const res = await api.get(`/api/availability/doctor/${doctorId}`);
      const calendarEvents = (res.data.availableSlots || res.data).map((slot) => ({
        id: slot.id,
        title: "Available",
        start: moment(`${slot.date} ${slot.startTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
        end: moment(`${slot.date} ${slot.endTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Logic to Save Slot ---
  const saveSlot = async (start, end) => {
    const dateStr = moment(start).format("YYYY-MM-DD");
    const startTimeStr = moment(start).format("HH:mm:00");
    const endTimeStr = moment(end).format("HH:mm:00");

    // UI Optimistic Update
    const tempId = Math.random();
    setEvents((prev) => [...prev, { id: tempId, start, end, title: "Saving..." }]);

    try {
      await api.post("/api/availability/add", {
        doctorId: doctorId,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
      });
      toast.success("Availability Added");
      fetchSlots(); // Refresh for real ID
    } catch (err) {
      toast.error("Failed to add slot");
      setEvents((prev) => prev.filter((e) => e.id !== tempId));
    }
  };

  // --- Quick Add Preset ---
  const handleQuickAdd = (type) => {
    const baseDate = moment(viewDate).format("YYYY-MM-DD");
    let start, end;

    if (type === "MORNING") {
      start = moment(`${baseDate} 09:00:00`).toDate();
      end = moment(`${baseDate} 13:00:00`).toDate();
    } else if (type === "AFTERNOON") {
      start = moment(`${baseDate} 14:00:00`).toDate();
      end = moment(`${baseDate} 18:00:00`).toDate();
    } else if (type === "FULL") {
        start = moment(`${baseDate} 09:00:00`).toDate();
        end = moment(`${baseDate} 17:00:00`).toDate();
    }

    if(window.confirm(`Add ${type} shift for ${moment(baseDate).format("MMM Do")}?`)) {
        saveSlot(start, end);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    if (start < new Date()) return toast.error("Cannot add past slots");
    saveSlot(start, end);
  };

  const handleSelectEvent = async (event) => {
    if (window.confirm("Delete this slot?")) {
      try {
        await api.delete(`/api/availability/delete/${event.id}`);
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        toast.success("Slot Removed");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // --- Custom Toolbar Component ---
  const CustomToolbar = (toolbar) => {
    const goToBack = () => { toolbar.onNavigate('PREV'); setViewDate(moment(viewDate).subtract(1, view === 'week' ? 'week' : 'day').toDate()); };
    const goToNext = () => { toolbar.onNavigate('NEXT'); setViewDate(moment(viewDate).add(1, view === 'week' ? 'week' : 'day').toDate()); };
    const goToCurrent = () => { toolbar.onNavigate('TODAY'); setViewDate(new Date()); };

    return (
      <div className="custom-toolbar">
        <div className="nav-btn-group">
          <button className="nav-btn" onClick={goToBack}>&lt;</button>
          <button className="nav-btn" onClick={goToCurrent}>Today</button>
          <button className="nav-btn" onClick={goToNext}>&gt;</button>
        </div>
        <span className="current-date-label">{toolbar.label}</span>
        <div className="nav-btn-group">
            <button className={`nav-btn ${view === 'week' ? 'active' : ''}`} onClick={() => {setView('week'); toolbar.onView('week')}}>Week</button>
            <button className={`nav-btn ${view === 'day' ? 'active' : ''}`} onClick={() => {setView('day'); toolbar.onView('day')}}>Day</button>
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-container">
      
      {/* LEFT: Calendar Card */}
      <div className="calendar-card">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          date={viewDate} // Force controlled date
          onNavigate={(date) => setViewDate(date)}
          view={view} // Force controlled view
          onView={(v) => setView(v)}
          components={{ toolbar: CustomToolbar }} // Use our custom pretty toolbar
          
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
        />
      </div>

      {/* RIGHT: Action Panel */}
      <div className="action-panel">
        <div>
            <h3 className="panel-title">Quick Actions</h3>
            <p className="panel-subtitle">Add availability for <strong>{moment(viewDate).format("MMM Do")}</strong></p>
        </div>

        <div className="shift-card" onClick={() => handleQuickAdd("MORNING")}>
            <div className="icon-box" style={{background: '#e3f2fd', color: '#1976d2'}}>🌅</div>
            <div className="shift-info">
                <h4>Morning Shift</h4>
                <p>09:00 AM - 01:00 PM</p>
            </div>
        </div>

        <div className="shift-card" onClick={() => handleQuickAdd("AFTERNOON")}>
            <div className="icon-box" style={{background: '#fff3e0', color: '#f57c00'}}>🌇</div>
            <div className="shift-info">
                <h4>Afternoon Shift</h4>
                <p>02:00 PM - 06:00 PM</p>
            </div>
        </div>

        <div className="shift-card" onClick={() => handleQuickAdd("FULL")}>
            <div className="icon-box" style={{background: '#e8f5e9', color: '#388e3c'}}>💼</div>
            <div className="shift-info">
                <h4>Full Day</h4>
                <p>09:00 AM - 05:00 PM</p>
            </div>
        </div>

        <hr style={{border:'0', borderTop:'1px solid #eee', margin:'10px 0'}} />
        
        <div style={{textAlign:'center', color:'#999', fontSize:'12px', marginTop:'auto'}}>
            <p>Drag on empty slots to create custom times.</p>
            <p>Click a slot to delete it.</p>
        </div>

      </div>
    </div>
  );
};

export default DoctorSchedule;