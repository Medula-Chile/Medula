import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../services/api.js';

export default function DoctorSchedule() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // Día seleccionado
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = user?.id;

  useEffect(() => {
    if (doctorId) {
      console.log('doctorId:', doctorId);
      const fetchAppointments = async () => {
        try {
          const response = await api.get(`/citas/doctor/${doctorId}`);
          const data = response.data;
          console.log('fetched data:', data);
          // Transformar datos de BD al formato esperado por el componente
          const transformed = data.map(cita => ({
            id: cita._id,
            date: new Date(cita.fecha_hora).toISOString().split('T')[0], // YYYY-MM-DD
            time: new Date(cita.fecha_hora).toISOString().split('T')[1].substring(0, 5), // HH:MM
            patient: cita.paciente_id?.usuario_id?.nombre || 'Paciente desconocido',
            status: cita.estado === 'programada' || cita.estado === 'confirmada' ? 'pending' : 'past'
          }));
          console.log('transformed:', transformed);
          setAppointments(transformed);
          // Set current date to the first appointment date if available
          if (transformed.length > 0) {
            const firstDate = new Date(transformed[0].date);
            setCurrentDate(firstDate);
            setSelectedDate(firstDate);
          }
        } catch (error) {
          console.error('Error loading appointments:', error);
        }
      };
      fetchAppointments();
    } else {
      console.log('No doctorId available');
    }
  }, [doctorId]);
 
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
    if (newView === 'week' || newView === 'day') {
      setSelectedDate(currentDate);
    }
  };
 
  const handlePrev = () => {
    if (view === 'month') setCurrentDate(getPrevMonth(currentDate));
    else if (view === 'week') setSelectedDate(addDays(selectedDate, -7));
    else setSelectedDate(addDays(selectedDate, -1));
  };
 
  const handleNext = () => {
    if (view === 'month') setCurrentDate(getNextMonth(currentDate));
    else if (view === 'week') setSelectedDate(addDays(selectedDate, 7));
    else setSelectedDate(addDays(selectedDate, 1));
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
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handlePrev}>Anterior</button>
          <h6 className="mb-0 fw-semibold">{formatMonthYear(currentDate)}</h6>
          <button className="btn btn-outline-primary btn-sm" onClick={handleNext}>Siguiente</button>
        </div>
        <div className="row row-cols-5 g-0 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map(day => (
            <div key={day} className="col text-center fw-semibold small bg-light p-2 border-bottom border-end">
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }, (_, weekIndex) => {
          const weekDays = days.slice(weekIndex * 5, (weekIndex + 1) * 5);
          if (weekDays.length === 0) return null;
          return (
            <div key={weekIndex} className="row row-cols-5 g-0 mb-1">
              {weekDays.map((day, dayIndex) => {
                const dayStr = formatDate(day);
                const dayApps = appointments.filter(app => app.date === dayStr);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dayClass = `col p-2 border border-end-0 border-bottom-0 h-100 d-flex flex-column ${!isCurrentMonth ? 'opacity-50 bg-light' : ''} ${isToday(day) ? 'bg-info text-white' : ''} ${isSelected(day) ? 'bg-light border border-primary' : ''}`;
                return (
                  <div key={dayIndex} className={dayClass} onClick={() => handleDayClick(day)} style={{ cursor: 'pointer' }}>
                    <div className="day-number fw-semibold small mb-auto p-1">{day.getDate()}</div>
                    <div className="flex-grow-1">
                      {dayApps.sort((a, b) => a.time.localeCompare(b.time)).map(app => (
                        <div key={app.id} className={`appointment small rounded p-1 mb-1 text-white ${app.status === 'pending' ? 'bg-primary' : 'bg-secondary'}`}>
                          {app.patient} - {app.time}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {weekDays.length < 5 && Array.from({ length: 5 - weekDays.length }, (_, i) => (
                <div key={`empty-${i}`} className="col p-2 border border-end-0 border-bottom-0 bg-light"></div>
              ))}
            </div>
          );
        })}
      </div>
    );
  } else if (view === 'week') {
    let weekStart = getWeekStart(selectedDate || currentDate);
    const weekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = addDays(weekStart, i);
      if (isWeekday(day)) weekDays.push(day);
    }
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
 
    content = (
      <div className="week-view">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handlePrev}>Anterior</button>
          <h6 className="mb-0 fw-semibold">Semana del {weekStart.getDate()}/{weekStart.getMonth() + 1}</h6>
          <button className="btn btn-outline-primary btn-sm" onClick={handleNext}>Siguiente</button>
        </div>
        <div className="row row-cols-5 g-2">
          {weekDays.map((day, index) => {
            const dayStr = formatDate(day);
            const dayApps = appointments.filter(app => app.date === dayStr).sort((a, b) => a.time.localeCompare(b.time));
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayClass = `col p-2 border border-end-0 border-bottom-0 h-100 d-flex flex-column ${!isCurrentMonth ? 'opacity-50 bg-light' : ''} ${isToday(day) ? 'bg-info text-white' : ''} ${isSelected(day) ? 'border-primary' : ''}`;
            return (
              <div key={index} className={dayClass} onClick={() => handleDayClick(day)} style={{ cursor: 'pointer', minHeight: '200px' }}>
                <div className="day-number fw-semibold small mb-2 p-1">{formatDay(day)} {day.getDate()}</div>
                <div className="flex-grow-1">
                  {dayApps.map(app => (
                    <div key={app.id} className={`appointment small rounded p-1 mb-1 text-white ${app.status === 'pending' ? 'bg-primary' : 'bg-secondary'}`}>
                      {app.patient} - {app.time}
                    </div>
                  ))}
                  {dayApps.length === 0 && <small className="text-muted">Sin citas</small>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (view === 'day') {
    const dayStr = formatDate(selectedDate || currentDate);
    const dayApps = appointments.filter(app => app.date === dayStr).sort((a, b) => a.time.localeCompare(b.time));
 
    content = (
      <div className="day-view">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handlePrev}>Anterior</button>
          <h6 className="mb-0 fw-semibold">{selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}</h6>
          <button className="btn btn-outline-primary btn-sm" onClick={handleNext}>Siguiente</button>
        </div>
        <div className="card">
          <div className="card-body">
            <h6 className="card-title">Citas del día</h6>
            {dayApps.length === 0 ? (
              <p className="text-muted">No hay citas programadas para este día.</p>
            ) : (
              <div className="list-group">
                {dayApps.map(app => (
                  <div key={app.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{app.patient}</strong> - {app.time}
                      <br />
                      <small className="text-muted">{app.status === 'pending' ? 'Pendiente' : 'Completada'}</small>
                    </div>
                    <span className={`badge ${app.status === 'pending' ? 'bg-primary' : 'bg-secondary'}`}>{app.status === 'pending' ? 'Pendiente' : 'Completada'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-white pb-2">
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
              <h5 className="card-title mb-0">Agenda del Médico</h5>
              <div className="btn-group btn-group-sm" role="group" aria-label="Cambiar vista de agenda">
                <button className="btn btn-primary" onClick={() => handleViewChange('month')}>Mensual</button>
                <button className="btn btn-primary" onClick={() => handleViewChange('week')}>Semanal</button>
                <button className="btn btn-primary" onClick={() => handleViewChange('day')}>Diaria</button>
              </div>
            </div>
          </div>
          <div className="card-body p-2">
            <div className="calendar-wrap" style={{ maxHeight: 'calc(100vh - 260px)', overflow: 'auto', padding: '0.5rem' }}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
