export let isLoaded  = false





let note_key = 'storage_notes'
let cat_key = 'storage_categories';
let loadNotes = localStorage.getItem(note_key)
let loadCats = localStorage.getItem(cat_key);