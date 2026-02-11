// DOM Elements
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteIdInput = document.getElementById("noteId");
const noteTitleInput = document.getElementById("noteTitle");
const noteContentInput = document.getElementById("noteContent");


const noteModal = new bootstrap.Modal(document.getElementById("noteModal"));


// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];


renderNotes();


// Open modal for new note
addNoteBtn.addEventListener("click", () => {
clearForm();
noteModal.show();
});


// Save note (Create or Edit)
saveNoteBtn.addEventListener("click", () => {
const title = noteTitleInput.value.trim();
const content = noteContentInput.value.trim();


if (!title || !content) return;


if (noteIdInput.value) {
// Edit existing note
const note = notes.find(n => n.id === Number(noteIdInput.value));
note.title = title;
note.content = content;
} else {
// Create new note
notes.push({
id: Date.now(),
title,
content
});
}


saveNotes();
noteModal.hide();
clearForm();
renderNotes();
});


// Render notes
function renderNotes() {
notesContainer.innerHTML = "";


if (notes.length === 0) {
notesContainer.innerHTML = `<p class="text-muted">No notes yet.</p>`;
return;
}


notes.forEach(note => {
const col = document.createElement("div");
col.className = "col-md-4 mb-3";


col.innerHTML = `
<div class="card shadow-sm note-card">
<div class="card-body">
<h5 class="card-title">${note.title}</h5>
<p class="card-text">${note.content}</p>
<div class="note-actions">
<button class="btn btn-sm btn-warning" onclick="editNote(${note.id})">Edit</button>
<button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">Delete</button>
</div>
</div>
</div>
`;


notesContainer.appendChild(col);
});
}


// Edit note
function editNote(id) {
const note = notes.find(n => n.id === id);
noteIdInput.value = note.id;
noteTitleInput.value = note.title;
noteContentInput.value = note.content;
noteModal.show();
}


// Delete note
function deleteNote(id) {
if (!confirm("Delete this note?")) return;
notes = notes.filter(n => n.id !== id);
saveNotes();
renderNotes();
}


// Save to localStorage
function saveNotes() {
localStorage.setItem("notes", JSON.stringify(notes));
}


// Clear form
function clearForm() {
noteIdInput.value = "";
noteTitleInput.value = "";
noteContentInput.value = "";
}