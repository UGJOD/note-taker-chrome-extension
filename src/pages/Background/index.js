console.log('This is the background page.');
console.log('Put the background scripts here.');

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveNote') {
    handleSaveNote(request.note, sendResponse);
    return true; // Will respond asynchronously
  }
});

async function handleSaveNote(note, sendResponse) {
  try {
    // Get existing notes
    const result = await chrome.storage.sync.get(['notey-app-notes']);
    const existingNotes = result['notey-app-notes'] || [];

    // Add new note
    const updatedNotes = [...existingNotes, note];

    // Save to storage
    await chrome.storage.sync.set({ 'notey-app-notes': updatedNotes });

    // Schedule reminder if set
    if (note.reminder !== 'none') {
      scheduleReminder(note);
    }

    sendResponse({ success: true });
  } catch (error) {
    console.error('Error saving note:', error);
    sendResponse({ success: false, error: error.message });
  }
}

function scheduleReminder(note) {
  const getReminderDelay = (reminderType) => {
    switch (reminderType) {
      case '30sec': return 30 * 1000;
      case '1min': return 60 * 1000;
      case '5min': return 5 * 60 * 1000;
      case '15min': return 15 * 60 * 1000;
      case '30min': return 30 * 60 * 1000;
      case '1hour': return 60 * 60 * 1000;
      case '2hours': return 2 * 60 * 60 * 1000;
      case '1day': return 24 * 60 * 60 * 1000;
      default: return null;
    }
  };

  const delay = getReminderDelay(note.reminder);
  if (!delay) return;

  setTimeout(() => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon-128.png',
      title: 'Notey App Reminder',
      message: note.title || 'Note Reminder',
      requireInteraction: true
    });
  }, delay);
}
