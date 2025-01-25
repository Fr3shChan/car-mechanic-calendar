import React, { useState } from 'react';
import './App.css'; // Importujemy plik CSS do stylizacji

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [view, setView] = useState(''); // Dodano stan widoku

  const current = new Date();
  const [month, setMonth] = useState(current.getMonth());
  const [year, setYear] = useState(current.getFullYear());

  const handleDayClick = (day) => {
    const dateKey = `${year}-${month + 1}-${day}`;
    setSelectedDate(dateKey);
  };

  const handleAddNote = (noteData) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedDate]: [...(prevNotes[selectedDate] || []), noteData],
    }));
  };

  const handleEditNote = (index, newNoteContent) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedDate]: prevNotes[selectedDate].map((note, i) => (
        i === index ? { ...note, note: newNoteContent } : note
      )),
    }));
  };

  const handleDeleteNote = (index) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedDate]: prevNotes[selectedDate].filter((_, i) => i !== index),
    }));
  };

  const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);

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
    <div id="calendar">
      <div className="header">
        <h1>Kalendarz Mechanika</h1>
      </div>
      <div className="calendar-controls">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>{`${year} - ${month + 1}`}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>

      <div className="calendar">
        {days.map((day) => {
          const dateKey = `${year}-${month + 1}-${day}`;
          const hasNotes = notes[dateKey] && notes[dateKey].length > 0;

          return (
            <div
              key={day}
              className={`day ${selectedDate === dateKey ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <span>{day}</span>
              {hasNotes && <div className="dot"></div>}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="notes-section">
          <h3>Notatki dla: {selectedDate}</h3>
          <ul>
            {(notes[selectedDate] || []).map((note, index) => (
              <li key={index}>
                <p><strong>Imię i nazwisko:</strong> {note.name}</p>
                <p><strong>Dane kontaktowe:</strong> {note.contact}</p>
                <p><strong>Marka samochodu:</strong> {note.carBrand}</p>
                <p><strong>Model samochodu:</strong> {note.carModel}</p>
                <p><strong>Notatka:</strong> {note.note}</p>
                <button onClick={() => {
                  const newNoteContent = prompt('Edytuj notatkę:', note.note);
                  if (newNoteContent !== null) handleEditNote(index, newNoteContent);
                }} style={{ marginLeft: '10px' }}>
                  Edytuj notatkę
                </button>
                <button onClick={() => handleDeleteNote(index)} style={{ marginLeft: '10px' }}>
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

  const renderNotes = () => (
    <div id="all-notes">
      <h1>Wszystkie Notatki</h1>
      <ul>
        {Object.entries(notes).flatMap(([date, notesForDate]) =>
          notesForDate.map((note, index) => (
            <li key={`${date}-${index}`}>
              <p><strong>Data:</strong> {date}</p>
              <p><strong>Imię i nazwisko:</strong> {note.name}</p>
              <p><strong>Dane kontaktowe:</strong> {note.contact}</p>
              <p><strong>Marka samochodu:</strong> {note.carBrand}</p>
              <p><strong>Model samochodu:</strong> {note.carModel}</p>
              <p><strong>Notatka:</strong> {note.note}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Kalendarz Mechanika Samochodowego</h2>
        <nav>
          <ul>
            <li><button onClick={() => setView('calendar')}>Kalendarz</button></li>
            <li><button onClick={() => setView('notes')}>Notatki</button></li>
          </ul>
        </nav>
      </div>
      <div className="content">
        {view === 'calendar' && renderCalendar()}
        {view === 'notes' && renderNotes()}
        {view === '' && (
          <div className="welcome">
            <h1>Witaj w aplikacji Kalendarz Mechanika</h1>
            <p>Wybierz opcję z menu, aby rozpocząć.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NoteInput = ({ onAddNote }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && contact.trim() && carBrand.trim() && carModel.trim() && note.trim()) {
      onAddNote({ name, contact, carBrand, carModel, note });
      setName('');
      setContact('');
      setCarBrand('');
      setCarModel('');
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-input">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Imię i nazwisko"
        required
      />
      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Dane kontaktowe"
        required
      />
      <input
        type="text"
        value={carBrand}
        onChange={(e) => setCarBrand(e.target.value)}
        placeholder="Marka samochodu"
        required
      />
      <input
        type="text"
        value={carModel}
        onChange={(e) => setCarModel(e.target.value)}
        placeholder="Model samochodu"
        required
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Dodaj notatkę lub klienta..."
        required
      />
      <button type="submit">Dodaj</button>
    </form>
  );
};

export default App;
