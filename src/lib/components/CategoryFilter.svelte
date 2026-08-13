<script lang="ts">
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import Modal from "./Modal.svelte";
    import {fly} from "svelte/transition"

    let {
        catList = [], // Основной массив категорий из App.svelte
        activeCategoryId = $bindable(0), // ID активной вкладки
        notes = [],
        onupdatecats // Функция-колбэк родителю для сохранения изменений
    } = $props();

    let isEditing = $state(false); //надо не забыть сменить на false
    let tempCats = $state<any[]>([]);
    let newCatTitle = $state('');
    let isConfirmOpen = $state(false);
    let catIdToDelete = $state<number | null>(null);


    let catToDelete = $derived(
    catIdToDelete !== null ? tempCats.find(c => c.id === catIdToDelete) : null
  );

   function requestRemoveCategory(id: number) {
      if (id === 0) return; // Защита вкладки "Все"
      
      // Считаем, сколько заметок ссылаются на данный category ID
      const notesCount = notes.filter((note: any) => note.category === id).length;

      if (notesCount === 0) {
        // Ситуация А: Заметок нет -> удаляем молча и мгновенно из черновика!
        tempCats = tempCats.filter(cat => cat.id !== id);
      } else {
        // Ситуация Б: Заметки внутри есть -> запоминаем ID и требуем подтверждения
        catIdToDelete = id;  
        isConfirmOpen = true; 
      }
    }

  // Вызывается, если в модалке нажали "Да"
   function confirmRemoveCategory() {
      if (catIdToDelete !== null) {
        tempCats = tempCats.filter(cat => cat.id !== catIdToDelete);
      }
      isConfirmOpen = false; 
      catIdToDelete = null;  
    }


  function startEditing() {
    tempCats = catList.map(cat => ({ ...cat }));
    newCatTitle = '';
    isEditing = true;
  }

  function addCategoryToDraft() {
    if (!newCatTitle.trim()) return alert('Название не может быть пустым!');
    
    const newId = tempCats.length > 0 ? Math.max(...tempCats.map(c => c.id)) + 1 : 1;
    
    tempCats.push({
      id: newId,
      title: newCatTitle.trim()
    });

    newCatTitle = ''; // Очищаем поле ввода
  }

  // Удаление категории из черновика
  function removeCategoryFromDraft(id: number) {
    // Категорию "Все" (id: 0) удалить физически невозможно из-за проверки в верстке,
    // но добавим защиту и в функцию
    if (id === 0) return;
    tempCats = tempCats.filter(cat => cat.id !== id);
  }

  // Сохранение: отдаем черновик родителю
  function saveChanges() {
    if (onupdatecats) {
      onupdatecats(tempCats);
    }
    isEditing = false;
  }

  // Отмена: просто закрываем режим, черновик уничтожится сам
  function cancelChanges() {
    isEditing = false;
  }

   function getNotesCount(categoryId: number): number {
      if (categoryId === 0) {
        // Если это категория "Все" (id: 0), возвращаем общее количество заметок в приложении
        return notes.length;
      }
      // Для остальных категорий считаем только те заметки, у которых совпадает ID
      return notes.filter((note: any) => note.category === categoryId).length;
    }
    
</script>










<div class="sidebar-categories">
  <div class="category-header">
    <span>Категории</span>
    {#if !isEditing}
      <!-- Кнопка перехода в режим редактирования -->
       <Button design='edit' onclick={startEditing}>
        <span>Настройка</span>
      </Button>
    {:else}
      <div class="edit-actions">
        <Button design='save' onclick={saveChanges}>
          <span>Сохранить</span>
        </Button>
        <Button design='delete' onclick={cancelChanges}>
          <span>Отмена</span>
        </Button>
      </div>
    {/if}
  </div>

  <div class="filter-form {isEditing ? 'editing-layout' : ''}">
    {#if !isEditing}
      <!-- === РЕЖИМ ПРОСМОТРА (Обычные вкладки-кнопки) === -->
      {#each catList as category (category.id)}
        <button 
          class="info {category.id === activeCategoryId ? 'active' : ''}"
          onclick={() => activeCategoryId = category.id}
        >
        <span>
            {category.title} 
        </span>
        <span>
            {getNotesCount(category.id)}
        </span>

        </button>
      {/each}
    {:else}
      <!-- === РЕЖИМ РЕДАКТИРОВАНИЯ (Список с управлением) === -->
      <div class="edit-list" >
        {#each tempCats as category (category.id)}
          <div class="edit-item">
            <span class="cat-name">{category.title}</span>
            <!-- Защита: Кнопку удаления показываем для всех, КРОМЕ категории "Все" (ID 0) -->
            {#if category.id !== 0}
              <Button design="delete" onclick={() => requestRemoveCategory(category.id)} >
                <span>x</span>
              </Button>
            {/if}
          </div>
        {/each}

        <!-- Инпут добавления новой категории (последний элемент столбца) -->
        <div class="add-cat-box">
          <Input placeholder="Новая категория..." bind:value={newCatTitle} />
          <Button design="save" onclick={addCategoryToDraft} >
            <span>+</span>
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
<Modal
title="Удаление категории"
message= {`Вы действительно хотите удалить категорию «${catToDelete?.title}»? Заметки в этой категории перейдут в категорию "Все"`}
bind:isOpen={isConfirmOpen}
onconfirm={confirmRemoveCategory}
oncancel={() => catIdToDelete = null}
/>

