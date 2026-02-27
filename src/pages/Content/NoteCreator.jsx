import React, { useState } from 'react';

const NoteCreator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [reminder, setReminder] = useState('none');
  const [isCompleted, setIsCompleted] = useState(false);


  const handleSave = () => {
    if (!content.trim()) return;

    setIsSaving(true);

    const newNote = {
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      timestamp: Date.now(),
      reminder: reminder,
      completed: isCompleted,
      id: Date.now().toString() // Simple ID for editing/deleting
    };

    // Send message to background script to save the note
    chrome.runtime.sendMessage({
      action: 'saveNote',
      note: newNote
    }, (response) => {
      setIsSaving(false);
      if (response && response.success) {
        // Reset form and close modal
        setTitle('');
        setContent('');
        setReminder('none');
        setIsCompleted(false);
        setIsOpen(false);
        console.log('Note saved successfully!');
      } else {
        console.error('Error saving note:', response?.error || 'Unknown error');
      }
    });
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setReminder('none');
    setIsCompleted(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(true)}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            border: '3px solid #FFA500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
            transition: 'all 0.2s ease',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#8B4513'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
          }}
        >
          +
        </div>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFACD',
              borderRadius: '8px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '2px solid #FFA500',
              position: 'relative'
            }}
          >
            {/* Close button */}
            <button
              onClick={handleCancel}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#8B4513',
                padding: '4px',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFE4B5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>

            <h2
              style={{
                margin: '0 0 20px 0',
                color: '#8B4513',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Create New Note
            </h2>

            {/* Title Input */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Note title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #FFA500',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#333',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF8C00';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#FFA500';
                }}
              />
            </div>

            {/* Content Textarea */}
            <div style={{ marginBottom: '16px' }}>
              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #FFA500',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#333',
                  boxSizing: 'border-box',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF8C00';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#FFA500';
                }}
              />
            </div>

            {/* Reminder Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#8B4513',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Reminder:
              </label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #FFA500',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#333',
                  outline: 'none'
                }}
              >
                <option value="none">No reminder</option>
                <option value="30sec">30 seconds</option>
                <option value="1min">1 minute</option>
                <option value="5min">5 minutes</option>
                <option value="15min">15 minutes</option>
                <option value="30min">30 minutes</option>
                <option value="1hour">1 hour</option>
                <option value="2hours">2 hours</option>
                <option value="1day">1 day</option>
              </select>
            </div>

            {/* Completion Checkbox */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#8B4513',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  style={{
                    marginRight: '8px',
                    transform: 'scale(1.2)',
                    accentColor: '#FFD700'
                  }}
                />
                Mark as completed
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #FFA500',
                  borderRadius: '6px',
                  backgroundColor: '#FFE4B5',
                  color: '#8B4513',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFDAB9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FFE4B5';
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #FFA500',
                  borderRadius: '6px',
                  backgroundColor: '#FFD700',
                  color: '#8B4513',
                  cursor: content.trim() && !isSaving ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  outline: 'none',
                  opacity: content.trim() && !isSaving ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (content.trim() && !isSaving) {
                    e.target.style.backgroundColor = '#FFC107';
                  }
                }}
                onMouseLeave={(e) => {
                  if (content.trim() && !isSaving) {
                    e.target.style.backgroundColor = '#FFD700';
                  }
                }}
              >
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCreator;