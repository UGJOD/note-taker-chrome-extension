import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['notey-app-notes'], (result) => {
        const storedNotes = result['notey-app-notes'] || [];
        setNotes(storedNotes);
        setLoading(false);
      });
    } else {
      console.log('Chrome storage not available');
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title || '');
    setEditContent(note.content || note.text || '');
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? {
            ...note,
            title: editTitle.trim() || 'Untitled Note',
            content: editContent.trim(),
            timestamp: Date.now()
          }
        : note
    );

    chrome.storage.sync.set({ 'notey-app-notes': updatedNotes }, () => {
      setNotes(updatedNotes);
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
    });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleDelete = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      chrome.storage.sync.set({ 'notey-app-notes': updatedNotes }, () => {
        setNotes(updatedNotes);
      });
    }
  };

  const toggleCompletion = (noteId) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, completed: !note.completed }
        : note
    );

    chrome.storage.sync.set({ 'notey-app-notes': updatedNotes }, () => {
      setNotes(updatedNotes);
    });
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{
          color: '#61dafb',
          fontSize: '14px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 style={{
          fontSize: '18px',
          margin: '10px 0',
          color: '#61dafb',
          fontWeight: 'bold'
        }}>
          Notey App
        </h1>

        {notes.length === 0 ? (
          <div style={{
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: '10px 0',
              fontSize: '14px',
              color: '#ffffff'
            }}>
              No notes yet!
            </p>
            <p style={{
              fontSize: '12px',
              color: '#888',
              margin: '5px 0'
            }}>
              Use the yellow "+" button on any website to create notes.
            </p>
          </div>
        ) : (
          <div style={{
            width: '100%',
            marginTop: '15px',
            textAlign: 'left'
          }}>
            <h2 style={{
              fontSize: '16px',
              marginBottom: '10px',
              color: '#61dafb',
              borderBottom: '1px solid #444',
              paddingBottom: '5px'
            }}>
              Your Notes ({notes.length})
            </h2>
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              width: '100%'
            }}>
              {notes.map((note) => (
                <div key={note.id} style={{
                  backgroundColor: '#FFFACD',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '8px',
                  border: '2px solid #FFA500',
                  position: 'relative',
                  opacity: note.completed ? 0.7 : 1
                }}>
                  {editingNote && editingNote.id === note.id ? (
                    // Edit Mode
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        <input
                          type="text"
                          placeholder="Note title (optional)"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #FFA500',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#FFFFFF',
                            color: '#333',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <textarea
                          placeholder="Note content..."
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #FFA500',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#FFFFFF',
                            color: '#333',
                            boxSizing: 'border-box',
                            outline: 'none',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          onClick={handleSaveEdit}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #FFA500',
                            borderRadius: '4px',
                            backgroundColor: '#FFD700',
                            color: '#8B4513',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            outline: 'none'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #FFA500',
                            borderRadius: '4px',
                            backgroundColor: '#FFE4B5',
                            color: '#8B4513',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            outline: 'none'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      {/* Action Buttons */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'flex',
                        gap: '4px'
                      }}>
                        <button
                          onClick={() => handleEdit(note)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#8B4513',
                            fontSize: '14px',
                            padding: '2px',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Edit note"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#8B4513',
                            fontSize: '14px',
                            padding: '2px',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete note"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Completion Checkbox */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px'
                      }}>
                        <input
                          type="checkbox"
                          checked={note.completed || false}
                          onChange={() => toggleCompletion(note.id)}
                          style={{
                            transform: 'scale(1.2)',
                            accentColor: '#FFD700'
                          }}
                          title="Mark as completed"
                        />
                      </div>

                      {/* Note Content */}
                      <div style={{
                        marginTop: '8px',
                        paddingLeft: '24px',
                        paddingRight: '48px'
                      }}>
                        {note.title && (
                          <h3 style={{
                            fontSize: '14px',
                            margin: '0 0 5px 0',
                            color: '#8B4513',
                            fontWeight: 'bold',
                            textDecoration: note.completed ? 'line-through' : 'none'
                          }}>
                            {note.title}
                          </h3>
                        )}
                        <p style={{
                          fontSize: '13px',
                          margin: '0 0 5px 0',
                          color: note.completed ? '#666' : '#333',
                          lineHeight: '1.4',
                          textDecoration: note.completed ? 'line-through' : 'none',
                          wordWrap: 'break-word'
                        }}>
                          {note.content || note.text}
                        </p>

                        {/* Reminder and Date */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '4px'
                        }}>
                          <small style={{
                            fontSize: '11px',
                            color: '#888'
                          }}>
                            {note.timestamp && new Date(note.timestamp).toLocaleDateString()}
                          </small>
                          {note.reminder && note.reminder !== 'none' && (
                            <small style={{
                              fontSize: '10px',
                              color: '#FFA500',
                              backgroundColor: '#FFF8DC',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              border: '1px solid #FFA500'
                            }}>
                              ⏰ {note.reminder}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Popup;
