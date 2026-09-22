<script lang='ts'>
import Settings from "./lib/components/pages/Settings.svelte";
import RichEditor from "./lib/components/pages/RichEditor.svelte";
import Modal from "./lib/components/Modal.svelte";
import Updater from "./lib/components/Updater.svelte";

import NoteCard from "./lib/components/NoteCard.svelte";
import Button from "./lib/components/Button.svelte";
import CategoryFilter from "./lib/components/pages/CategoryFilter.svelte";
import Search from "./lib/components/Search.svelte";
import {fade} from "svelte/transition"
import { onMount } from "svelte";

let windowWidth = $state(0)
let theme_key = 'app_theme';
let loadTheme = localStorage.getItem(theme_key);
let currentTheme = $state(localStorage.getItem(theme_key) || getSystemTheme());
let note_key = 'storage_notes'
let loadNotes = localStorage.getItem(note_key)
let notesList = $state(loadNotes ? JSON.parse(loadNotes) : [])
let cat_key = 'storage_categories';
let loadCats = localStorage.getItem(cat_key);
let categories = $state(
  loadCats ? JSON.parse(loadCats) : [
    { id: 0, title: "Все" },
  ]);
let activeCategory = $state(0);
let activePage = $state('home')
let searchQuery = $state('')
let editingNoteId = $state<number | null>(null);
let isConfirmOpen = $state(false);

// Флаг, указывающий, что мы создаем совершенно новую заметку
let isCreatingNew = $state(false);

// Умная руна сборки объекта для редактора
let noteToEdit = $derived.by(() => {
  if (editingNoteId !== null) {
    return notesList.find(note => note.id === editingNoteId) || null;
  }
  if (isCreatingNew) {
    // Если активная категория "Все" (0), ставим по умолчанию 0 (или ID первой реальной категории)
    // Если выбрана конкретная категория, новая заметка сразу получает её ID
    return {
      title: "",
      description: "",
      tags: [],
      category: activeCategory === 0 ? 0 : activeCategory
    };
  }
  return null;
});

$effect(() => {
  localStorage.setItem(note_key, JSON.stringify(notesList))
})

$effect(() => {
  localStorage.setItem(cat_key, JSON.stringify(categories));
});

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
  }
  return 'light';
}

// Вызов окна создания новой заметки с учетом контекста категории
function triggerCreateNote() {
  editingNoteId = null;
  isCreatingNew = true;
  activePage = 'editor';
}

function editNote(noteId) {
  isCreatingNew = false;
  editingNoteId = noteId;
  activePage = 'editor';
}

function copyText(value){
  navigator.clipboard.writeText(value)
}

function confirmRemoveNote() {
  if (editingNoteId !== null) {
    notesList = notesList.filter(note => note.id !== editingNoteId);
  }
  editingNoteId = null;
}

function handleSaveNote(InputNoteData){
  if (editingNoteId !== null){
    const index = notesList.findIndex(n => n.id === editingNoteId)
    if (index !== -1){
      notesList[index] = { ...notesList[index], ...InputNoteData}
    }
  }else{
    notesList.push({id : Date.now(), ...InputNoteData})
  }
  activePage = 'home'
  editingNoteId = null;
  isCreatingNew = false;
}

let filteredNotes = $derived(
  notesList.filter(note => {
    const query = searchQuery.toLowerCase().trim();

    if (query !== '') {
      return note.title?.toLowerCase().includes(query) ||
             note.description?.toLowerCase().includes(query) ||
             note.tags?.some(tag => tag.toLowerCase().includes(query));
    }

    return activeCategory === 0 || note.category === activeCategory;
  })
);

function requestRemoveNote(noteId) {
  editingNoteId = noteId; 
  isConfirmOpen = true;    
}

function handleCancelDelete() {
  editingNoteId = null; 
}

function handleUpdateCategories(newCategoriesList) {
  notesList.forEach(note => {
    const isCategoryExists = newCategoriesList.some(cat => cat.id === note.category);
    if (!isCategoryExists) {
      note.category = 0;
    }
  });
  categories = newCategoriesList;
}

$effect(() => {
  localStorage.setItem(theme_key, currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
});

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
}

function closeEditor() {
  activePage = 'home';
  editingNoteId = null;
  isCreatingNew = false;
}
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if activePage === 'home'}
   <aside>
    <Search placeholder='Поиск заметок' title='Поиск карточек по заголовку, описанию, тегам' bind:value={searchQuery}/>
    <CategoryFilter 
    catList={categories}
    notes={notesList}
    bind:activeCategoryId={activeCategory}
    onupdatecats={handleUpdateCategories}/>
    {#if windowWidth > 600}
    <div style="flex-grow: 1;">

    </div>
    <Updater />
    {/if}
    {#if windowWidth < 600}
    <Button onclick={triggerCreateNote} design="primary">
        <span>Создать новую заметку</span>
      </Button>
    {/if}
</aside>
<main>

  {#if windowWidth > 600}
      <Button onclick={triggerCreateNote} design="primary">
        <span>Создать новую заметку</span>
      </Button>
    {/if}
    {#each filteredNotes as note(note.id)}
    <NoteCard 
    title = {note.title}
    onclickheadline={() => copyText(note.title)}
    description={note.description}
    onclickdescription={() => copyText(note.description)}
    tags={note.tags}
    category={categories.find(cat => cat.id === note.category)?.title}
    onclickEdit={() => editNote(note.id)}
    onclickRemove={() => requestRemoveNote(note.id)}/>
    {:else}
  <div class="empty-notes" in:fade={{duration: 300, delay:300}}>
    <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
      <path stroke="currentColor" d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path stroke="currentColor" d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Заметок нет, вы можете создать новую</span>
    <!-- Заменили вызов на triggerCreateNote -->
    <Button design='primary' onclick={triggerCreateNote}>
      <span>Создать новую заметку</span>
    </Button>
  </div>
  {/each}

  <Modal 
  bind:isOpen={isConfirmOpen}
    title="Удаление заметки"
    message={noteToEdit?.title ? `Вы действительно хотите удалить заметку «${noteToEdit.title}»? Восстановить её будет невозможно.` : `'Вы действительно хотите удалить эту заметку?'` }
    onconfirm={confirmRemoveNote}
    oncancel={handleCancelDelete}
  />
</main>
{:else if activePage === 'editor'}
  <RichEditor 
    initialData={noteToEdit}
    {categories} 
    onclickExit={closeEditor} 
    onsave={handleSaveNote}/>
{/if}

<style>
 .empty-notes{
  display: flex; 
  flex-direction: column; 
  gap: 10px;
  margin: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
 }


</style>
