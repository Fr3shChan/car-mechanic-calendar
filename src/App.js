import React, { useState } from 'react';
import './App.css'; // Importujemy plik CSS do stylizacji

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [view, setView] = useState('');

  const current = new Date();
  const [month, setMonth] = useState(current.getMonth());
  const [year, setYear] = useState(current.getFullYear());

  const handleDayClick = (day) => {
    const dateKey = `${year}-${month + 1}-${day}`;
    setSelectedDate(dateKey);
  };

  const handleAddNote = (note) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedDate]: [...(prevNotes[selectedDate] || []), note],
    }));
  };

  const handleEditNote = (index, newNote) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedDate]: prevNotes[selectedDate].map((note, i) => (i === index ? newNote : note)),
    }));
  };

  const handleDeleteNote = (index) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedDate]: prevNotes[selectedDate].filter((_, i) => i !== index),
    }));
  };

  const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(month, year);

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const renderCalendar = () => (
    <div id="calendar" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <div className="calendar-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={goToPreviousMonth} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color:"black" }}>&lt;</button>
        <h2 style={{ margin: 0 }}>{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</h2>
        <button onClick={goToNextMonth} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color:"black" }}>&gt;</button>
      </div>

      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#555' }}>{day}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={index} style={{ visibility: 'hidden' }}>0</div>
        ))}
        {days.map((day) => {
          const dateKey = `${year}-${month + 1}-${day}`;
          const hasNotes = notes[dateKey] && notes[dateKey].length > 0;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              style={{
                padding: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '4px',
                backgroundColor: selectedDate === dateKey ? '#007bff' : '#f9f9f9',
                color: selectedDate === dateKey ? '#fff' : '#333',
                position: 'relative',
              }}
            >
              {day}
              {hasNotes && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="notes-section" style={{ backgroundColor: '#f7f7f7', marginTop: '20px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Notatki dla: {selectedDate}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {(notes[selectedDate] || []).map((note, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {note}
                <button onClick={() => handleEditNote(index, prompt('Edytuj notatkę:', note))} style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}>
                  Edytuj
                </button>
                <button onClick={() => handleDeleteNote(index)} style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer', color: 'red' }}>
                  Usuń
                </button>
              </li>
            ))}
          </ul>
          <NoteInput onAddNote={handleAddNote} />
        </div>
      )}
    </div>
  );

  return (
    <div className="app" style={{ backgroundColor: '#d9fdd3', minHeight: '100vh', display: 'flex' }}>
      <div className="sidebar" style={{ backgroundColor: '#b2e6b2', padding: '20px', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', width: '250px' }}>
        <h2>Kalendarz Mechanika Samochodowego</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><button onClick={() => setView('calendar')} style={{ width: '100%', padding: '10px', margin: '10px 0', cursor: 'pointer' }}>Kalendarz</button></li>
            <li><button onClick={() => setView('notes')} style={{ width: '100%', padding: '10px', margin: '10px 0', cursor: 'pointer' }}>Notatki</button></li>
          </ul>
        </nav>
      </div>
      <div className="content" style={{ flex: 1, padding: '20px' }}>
        {view === 'calendar' && renderCalendar()}
        {view === '' && (
          <div className="welcome" style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Witaj w aplikacji Kalendarz Mechanika</h1>
            <p>Wybierz opcję z menu, aby rozpocząć.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NoteInput = ({ onAddNote }) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote(note);
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-input" style={{ marginTop: '10px' }}>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Dodaj notatkę lub klienta..."
        style={{ padding: '10px', width: 'calc(100% - 80px)', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Dodaj</button>
    </form>
  );
};

export default App;
