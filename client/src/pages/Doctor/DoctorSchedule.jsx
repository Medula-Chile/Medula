import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
export default function DoctorSchedule() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // Día seleccionado
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    setAppointments([
      { id: 1, date: '2025-10-15', time: '10:00', patient: 'Juan Pérez', status: 'pending' },
      { id: 2, date: '2025-10-15', time: '11:00', patient: 'María González', status: 'past' },
      { id: 3, date: '2025-10-16', time: '09:00', patient: 'Carlos Rodríguez', status: 'pending' },
    ]);
  }, []);
 
  const getPrevMonth = (date) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    newDate.setDate(1);
    return newDate;
  };
 
  const getNextMonth = (date) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    newDate.setDate(1);
    return newDate;
  };
 
  const getWeekStart = (date) => {
    const newDate = new Date(date);
    let day = newDate.getDay();
    if (day === 0) day = 7;
    newDate.setDate(newDate.getDate() - (day - 1));
    return newDate;
  };
 
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
 
  const formatMonthYear = (date) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };
 
  const formatDay = (date) => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
    const dayIndex = (date.getDay() + 6) % 7;
    return days[dayIndex];
  };
 
  const isSameMonth = (date1, date2) => date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
 
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
 
  const isSelected = (date) => formatDate(date) === formatDate(selectedDate);
 
  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };
 
  const setHour = (date, hour) => {
    const newDate = new Date(date);
    newDate.setHours(hour, 0, 0, 0);
    return newDate;
  };
 
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
 
  const handleDayClick = (day) => {
    setSelectedDate(day);
    setCurrentDate(day);
    setView('day'); // Cambia a vista diaria
  };
 
  const handleViewChange = (newView) => {
    setView(newView);
  };
 
  const handlePrev = () => {
    if (view === 'month') setCurrentDate(getPrevMonth(currentDate));
    else if (view === 'week') setCurrentDate(addDays(currentDate, -5));
    else setCurrentDate(addDays(currentDate, -1));
  };
 
  const handleNext = () => {
    if (view === 'month') setCurrentDate(getNextMonth(currentDate));
    else if (view === 'week') setCurrentDate(addDays(currentDate, 5));
    else setCurrentDate(addDays(currentDate, 1));
  };
 
  const handleSlotClick = (date, hour) => {
    const now = new Date();
    const slotTime = setHour(date, hour);
    const slotEnd = setHour(date, hour + 1);
    if (slotTime <= now && slotEnd > now) {
      navigate('/doctor/iniciar-atencion');
    }
  };
 
  let content;
  if (view === 'month') {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    let startDate = new Date(firstDay);
    let dayOfWeek = startDate.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    startDate.setDate(startDate.getDate() - (dayOfWeek - 1));
    if (!isWeekday(startDate)) startDate = addDays(startDate, 1);
 
    const days = [];
    let current = new Date(startDate);
    while (current.getMonth() === month || days.length < 25) {
      if (isWeekday(current)) {
        days.push(new Date(current));
      }
      current = addDays(current, 1);
    }
 
    content = (
      <div className="calendar-grid">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-primary" onClick={handlePrev}>Anterior</button>
          <h3 className="mb-0">{formatMonthYear(currentDate)}</h3>
          <button className="btn btn-outline-primary" onClick={handleNext}>Siguiente</button>
        </div>
        <div className="row g-0 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map(day => (
            <div key={day} className="col-2 text-center fw-bold bg-light p-2 border-bottom border-end">
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }, (_, weekIndex) => {
          const weekDays = days.slice(weekIndex * 5, (weekIndex + 1) * 5);
          if (weekDays.length === 0) return null;
          return (
            <div key={weekIndex} className="row g-0 mb-1">
              {weekDays.map((day, dayIndex) => {
                const dayStr = formatDate(day);
                const dayApps = appointments.filter(app => app.date === dayStr);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dayClass = `col-2 p-2 border border-end-0 border-bottom-0 h-100 d-flex flex-column ${!isCurrentMonth ? 'opacity-50 bg-light' : ''} ${isToday(day) ? 'bg-info text-white' : ''} ${isSelected(day) ? 'bg-light border border-primary' : ''}`;
                return (
                  <div key={dayIndex} className={dayClass} onClick={() => handleDayClick(day)} style={{ cursor: 'pointer' }}>
                    <div className="day-number fw-bold mb-auto p-1">{day.getDate()}</div>
                    <div className="flex-grow-1">
                      {dayApps.map(app => (
                        <div key={app.id} className={`appointment small rounded p-1 mb-1 text-white ${app.status === 'pending' ? 'bg-primary' : 'bg-secondary'}`}>
                          {app.patient} - {app.time}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {weekDays.length < 5 && Array.from({ length: 5 - weekDays.length }, (_, i) => (
                <div key={`empty-${i}`} className="col-2 p-2 border border-end-0 border-bottom-0 bg-light"></div>
              ))}
            </div>
          );
        })}
      </div>
    );
  } else if (view === 'week') {
    let weekStart = getWeekStart(currentDate);
    const weekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = addDays(weekStart, i);
      if (isWeekday(day)) weekDays.push(day);
    }
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
 
    content = (
      <div className="week-view">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-primary" onClick={handlePrev}>Anterior</button>
          <h3 className="mb-0">Semana del {weekStart.getDate()}/{weekStart.getMonth() + 1}</h3>
          <button className="btn btn-outline-primary" onClick={handleNext}>Siguiente</button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Hora</th>
                {weekDays.map((day, index) => (
                  <th key={index} className={`text-center ${isToday(day) ? 'bg-info text-white' : ''} ${isSelected(day) ? 'border-primary' : ''}`}>
                    {formatDay(day)}<br />{day.getDate()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour}>
                  <th className="text-end">{hour}:00</th>
                  {weekDays.map((day, index) => {
                    const dayStr = formatDate(day);
                    const app = appointments.find(a => a.date === dayStr && parseInt(a.time.split(':')[0]) === hour);
                    const isCurrent = new Date().getHours() === hour && isToday(day);
                    const cellClass = `p-1 small text-center ${app ? (app.status === 'pending' ? 'bg-primary text-white' : 'bg-secondary text-white') : 'bg-success text-white'} ${isCurrent ? 'bg-warning text-dark fw-bold' : ''} ${isSelected(day) ? 'border-primary' : ''}`;
                    return (
                      <td key={index} className={cellClass} onClick={() => handleDayClick(day)} style={{ cursor: 'pointer' }}>
                        {app ? `${app.patient}` : 'disponible'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (view === 'day') {
    const dayStr = formatDate(selectedDate || currentDate);
    const dayApps = appointments.filter(app => app.date === dayStr);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
 
    content = (
      <div className="day-view">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-primary" onClick={handlePrev}>Anterior</button>
          <h3 className="mb-0">{selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}</h3>
          <button className="btn btn-outline-primary" onClick={handleNext}>Siguiente</button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <tbody>
              {hours.map(hour => {
                const app = dayApps.find(a => parseInt(a.time.split(':')[0]) === hour);
                const isCurrent = new Date().getHours() === hour && isToday(selectedDate);
                const rowClass = ` ${app ? (app.status === 'pending' ? 'table-primary' : 'table-secondary') : 'table-success'} ${isCurrent ? 'table-warning' : ''}`;
                return (
                  <tr key={hour} className={rowClass}>
                    <td className="p-2 fw-bold" style={{ cursor: 'pointer' }} onClick={() => handleSlotClick(selectedDate, hour)}>
                      {hour}:00 - {app ? `${app.patient} - ${app.time}` : 'hora disponible'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
 
  return (
    <div className="container-fluid p-3">
      <h2 className="mb-4">Agenda del Médico</h2>
      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={() => handleViewChange('month')}>Mensual</button>
        <button className="btn btn-primary" onClick={() => handleViewChange('week')}>Semanal</button>
        <button className="btn btn-primary" onClick={() => handleViewChange('day')}>Diaria</button>
      </div>
      {content}
    </div>
  );
}