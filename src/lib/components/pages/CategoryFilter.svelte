<script lang="ts">
  import Button from "../Button.svelte";
  import Input from "../Input.svelte";
  import Modal from "../Modal.svelte";
  import { Pencil, Trash2, Plus, Search } from "@lucide/svelte";

  interface Category {
    id: number;
    title: string;
  }

  let {
    catList = [] as Category[],
    activeCategoryId = $bindable(0),
    notes = [],
    onupdatecats
  } = $props();

  // Состояния для CRUD и поиска
  let editingCategoryId = $state<number | null>(null);
  let editTitleValue = $state('');
  let newCatTitle = $state('');
  let categorySearchQuery = $state('');

  // Модалка удаления
  let isConfirmOpen = $state(false);
  let selectedCategoryToDelete = $state<number | null>(null);
  let categoryToDelete = $derived(
    selectedCategoryToDelete !== null ? catList.find(c => c.id === selectedCategoryToDelete) : null
  );

  // Вычисляемый отфильтрованный список категорий для вывода в меню
  let filteredCategories = $derived(
    catList.filter(cat => {
      if (cat.id === 0) return true; // Вкладку "Все" не прячем
      return cat.title.toLowerCase().includes(categorySearchQuery.toLowerCase().trim());
    })
  );

  function startInlineEdit(category: Category, event: MouseEvent) {
    event.stopPropagation();
    editingCategoryId = category.id;
    editTitleValue = category.title;
  }

  function saveInlineEdit() {
    if (editingCategoryId === null) return;
    if (editTitleValue.trim() === '') {
      editingCategoryId = null;
      return;
    }
    const updated = catList.map(cat => 
      cat.id === editingCategoryId ? { ...cat, title: editTitleValue.trim() } : cat
    );
    if (onupdatecats) onupdatecats(updated);
    editingCategoryId = null;
  }

  function handleEditKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") saveInlineEdit();
    if (e.key === "Escape") editingCategoryId = null;
  }

  function handleAddNewCategory(e: KeyboardEvent) {
    if (e.key === "Enter" && newCatTitle.trim() !== '') {
      const nextId = catList.length > 0 ? Math.max(...catList.map(c => c.id)) + 1 : 1;
      const updated = [...catList, { id: nextId, title: newCatTitle.trim() }];
      if (onupdatecats) onupdatecats(updated);
      newCatTitle = "";
    }
  }

  function triggerRemoveCategory(id: number, event: MouseEvent) {
    event.stopPropagation();
    if (id === 0) return;

    const notesCount = notes.filter((note: any) => note.category === id).length;
    if (notesCount === 0) {
      const updated = catList.filter(cat => cat.id !== id);
      if (onupdatecats) onupdatecats(updated);
    } else {
      selectedCategoryToDelete = id;
      isConfirmOpen = true;
    }
  }

  function confirmRemoveCategory() {
    if (selectedCategoryToDelete !== null) {
      const updated = catList.filter(cat => cat.id !== selectedCategoryToDelete);
      if (onupdatecats) onupdatecats(updated);
      if (activeCategoryId === selectedCategoryToDelete) {
        activeCategoryId = 0;
      }
    }
    isConfirmOpen = false;
    selectedCategoryToDelete = null;
  }

  function getNotesCount(categoryId: number): number {
    if (categoryId === 0) return notes.length;
    return notes.filter((note: any) => note.category === categoryId).length;
  }
</script>

<div class="categories-sidebar">
  <header class="sidebar-header">
    <h2>Категории</h2>
  </header>

  <div class="category-search-box">
    <Search size={14} class="search-mini-icon" />
    <input 
      type="text" 
      placeholder="Поиск категории..." 
      bind:value={categorySearchQuery}
    />
  </div>

  <nav class="categories-nav">
    {#each filteredCategories as category (category.id)}
      <div 
        class="category-row" 
        class:is-active={category.id === activeCategoryId}
        class:is-editing={editingCategoryId === category.id}
      >
        {#if editingCategoryId === category.id}
          <div class="inline-input-box">
            <Input 
              type="text" 
              bind:value={editTitleValue} 
              onkeydown={handleEditKeyDown}
              onblur={saveInlineEdit}
              autofocus
            />
          </div>
        {:else}
          <button 
            class="category-trigger" 
            onclick={() => activeCategoryId = category.id}
          >
            <span class="category-name">{category.title}</span>
            
            <div class="interactive-aside">
              <span class="badge-count">{getNotesCount(category.id)}</span>
              
              {#if category.id !== 0}
                <div class="crud-actions">
                  <Button design="icon-edit" onclick={(e) => startInlineEdit(category, e)} title="Переименовать">
                    <Pencil size={14} strokeWidth={2.5} style="pointer-events: none;" />
                  </Button>
                  <Button design="icon-delete" onclick={(e) => triggerRemoveCategory(category.id, e)} title="Удалить">
                    <Trash2 size={14} strokeWidth={2.5} style="pointer-events: none;" />
                  </Button>
                </div>
              {/if}
            </div>
          </button>
        {/if}
      </div>
    {/each}
  </nav>

  <div class="quick-create">
    <Plus size={16} strokeWidth={2.5} class="create-icon" />
    <Input 
      placeholder="Новая категория..." 
      bind:value={newCatTitle} 
      onkeydown={handleAddNewCategory}
    />
  </div>
</div>

{#if isConfirmOpen}
  <Modal
    title="Удаление категории"
    message={`Вы действительно хотите удалить категорию «${categoryToDelete?.title}»? Заметки в этой категории перейдут в категорию «${catList[0].title}».`}
    bind:isOpen={isConfirmOpen}
    onconfirm={confirmRemoveCategory}
    oncancel={() => selectedCategoryToDelete = null}
  />  
{/if}

<style>
  /* --- КОНТЕЙНЕРЫ ВЕРХНЕГО УРОВНЯ --- */
  .categories-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .sidebar-header {
    padding-bottom: 4px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text);
    opacity: 0.6;
  }

  /* --- МИНИ-ПОИСК КАТЕГОРИЙ --- */
  .category-search-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  :global(.search-mini-icon) {
    position: absolute;
    left: 10px;
    color: var(--text);
    opacity: 0.4;
    pointer-events: none;
  }

  .category-search-box input {
    width: 100%;
    height: 30px;
    padding-left: 30px;
    font-size: 0.85rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
  }

  .category-search-box input:focus {
    border-color: var(--primary);
  }

  /* --- НАВИГАЦИОННЫЙ СПИСОК (ОГРАНИЧЕНИЕ 5 ЭЛЕМЕНТОВ И СКРОЛЛ) --- */
  .categories-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 204px; /* Ровно 5 элементов по ~40px */
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--text) 15%, transparent) transparent;
  }

  /* Тонкий красивый скроллбар для Webkit (Chrome/Safari) */
  .categories-nav::-webkit-scrollbar {
    width: 4px;
  }

  .categories-nav::-webkit-scrollbar-thumb {
    background-color: color-mix(in srgb, var(--text) 15%, transparent);
    border-radius: 4px;
  }

  /* --- СТРОКА КАТЕГОРИИ --- */
  .category-row {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    border-radius: 8px;
    flex-shrink: 0;
    box-sizing: border-box;
    transition: background-color 0.15s ease;
  }

  /* Логика ховера (появление кнопок, растворение счетчика) */
  .category-row:hover:not(.is-editing) {
    background-color: color-mix(in srgb, var(--text) 5%, transparent);
  }

  .category-row:hover:not(.is-editing) .badge-count {
    opacity: 0;
    transform: scale(0.85);
    visibility: hidden;
  }

  .category-row:hover:not(.is-editing) .crud-actions {
    opacity: 1;
    transform: scale(1);
    visibility: visible;
    pointer-events: auto;
  }

  /* Активное состояние выбранной категории */
  .category-row.is-active {
    background-color: color-mix(in srgb, var(--primary) 12%, transparent);
  }

  .category-row.is-active .category-name {
    color: var(--primary);
    font-weight: 600;
  }

  .category-row.is-active .badge-count {
    background-color: color-mix(in srgb, var(--primary) 18%, transparent);
    color: var(--primary);
  }

  /* --- ВНУТРЕННИЙ ТРИГГЕР (КНОПКА) --- */
  .category-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 8px 10px;
    background: transparent;
    border: 0;
    margin: 0;
    cursor: pointer;
    color: var(--text);
    text-align: left;
    user-select: none;
  }

  .category-name {
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    padding-right: 8px;
  }

  /* --- ПРАВАЯ ИНТЕРАКТИВНАЯ ЗОНА (СЛОИ GRID) --- */
  .interactive-aside {
    display: grid;
    grid-template-areas: "overlay";
    align-items: center;
    justify-items: end;
    flex-shrink: 0;
    min-width: 48px;
  }

  .interactive-aside > * {
    grid-area: overlay;
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
  }

  .badge-count {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 1px 7px;
    border-radius: 20px;
    background-color: color-mix(in srgb, var(--text) 8%, transparent);
    opacity: 0.7;
  }

  /* --- МИНИ-КНОПКИ CRUD УПРАВЛЕНИЯ --- */
  .crud-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transform: scale(0.9);
    visibility: hidden;
    pointer-events: none;
  }

  /* Точечная стилизация глобального компонента Button внутри меню */
  .crud-actions :global(button.icon-edit), 
  .crud-actions :global(button.icon-delete) {
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }

  /* --- ИНЛАЙН РЕДАКТИРОВАНИЕ ПО МЕСТУ --- */
  .inline-input-box {
    width: 100%;
    padding: 3px;
    box-sizing: border-box;
  }

  .inline-input-box :global(input) {
    width: 100%;
    height: 32px;
    font-size: 0.9rem;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid var(--primary) !important;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 15%, transparent) !important;
    background-color: var(--entity-item-bg) !important;
  }

  /* --- ПОЛЕ БЫСТРОГО СОЗДАНИЯ --- */
  .quick-create {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 4px;
  }

  .quick-create :global(.create-icon) {
    position: absolute;
    left: 12px;
    color: var(--text);
    opacity: 0.35;
    pointer-events: none;
  }

  .quick-create :global(input) {
    width: 100%;
    height: 36px;
    padding-left: 36px;
    font-size: 0.85rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background-color: transparent;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .quick-create :global(input:focus) {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 12%, transparent) !important;
  }
</style>
