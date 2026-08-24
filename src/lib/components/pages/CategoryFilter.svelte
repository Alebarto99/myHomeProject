<script lang="ts">
    import Button from "../Button.svelte";
    import Input from "../Input.svelte";
    import Modal from "../Modal.svelte";
    import {fly} from "svelte/transition"



interface Category {
  id: number;
  title: string;
}


    let {
        catList = [] as Category[], // Основной массив категорий из App.svelte
        activeCategoryId = $bindable(0), // ID активной вкладки
        notes = [],
        onupdatecats // Функция-колбэк родителю для сохранения изменений
    } = $props();

      
    let isEditing = $state(false);
    let tempCats = $state<Category[]>([]);
    let newCatTitle = $state('');
    let isConfirmOpen = $state(false);
    let selectedCategory = $state<number | null>(null);
    let categoryToDelete = $derived(selectedCategory !== null ? tempCats.find(c => c.id === selectedCategory) : null);
    let draggedIndex = $state<number | null>(null);

      function handleDragStart(index: number, catId: number) {
    if (catId === 0) return; // Запрещаем тащить категорию "Все"
    draggedIndex = index;
  }

   function handleDragOver(e: DragEvent, catId: number) {
  // if (catId === 0) return; // На "Все" по-прежнему запрещаем
  
  e.preventDefault(); // КРИТИЧЕСКИ ВАЖНО: снимает запрещающий знак!
  
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'; // Явно говорим браузеру: "Здесь можно сбросить"
  }
}

  function handleDrop(targetIndex: number, catId: number) {
    if (catId === 0 || draggedIndex === null) return;

    // Меняем элементы местами внутри нашего черновика tempCats
    const updatedCats = [...tempCats];
    const [draggedItem] = updatedCats.splice(draggedIndex, 1);
    updatedCats.splice(targetIndex, 0, draggedItem);

    tempCats = updatedCats; // Перезаписываем реактивный массив
    draggedIndex = null;
  }


   function requestRemoveCategory(id: number) {
      if (id === 0) return; // Защита вкладки "Все"
      
      // Считаем, сколько заметок ссылаются на данный category ID
      const notesCount = notes.filter((note: any) => note.category === id).length;

      if (notesCount === 0) {
        // Ситуация А: Заметок нет -> удаляем молча и мгновенно из черновика!
        tempCats = tempCats.filter(cat => cat.id !== id);
      } else {
        // Ситуация Б: Заметки внутри есть -> запоминаем ID и требуем подтверждения
        selectedCategory = id;  
        isConfirmOpen = true; 
      }
    }

  // Вызывается, если в модалке нажали "Да"
   function confirmRemoveCategory() {
      if (selectedCategory !== null) {
        tempCats = tempCats.filter(cat => cat.id !== selectedCategory);
      }
      isConfirmOpen = false; 
      selectedCategory = null;  
    }


  function startEditing() {
    tempCats = catList.map(cat => ({ ...cat }));
    newCatTitle = '';
    isEditing = true;
  }

  function addCategoryToDraft(value:string) {
    if (!value.trim()) return alert('Название не может быть пустым!');
    
    const newId = tempCats.length > 0 ? Math.max(...tempCats.map(c => c.id)) + 1 : 1;
    
    tempCats.push({
      id: newId,
      title: value.trim()
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
    
    function handleAddNewCategory(e){
      if (e.key === "Enter" && newCatTitle !== ''){
        addCategoryToDraft(newCatTitle.trim())
        newCatTitle = ""
      }
    }

    function handleDragEnd() {
    draggedIndex = null; // Сброс, если бросили мимо
  }
</script>

<div class="sidebar-categories">
  <div class="category-header">
    <span>Категории</span>
    {#if !isEditing}
      <!-- Кнопка перехода в режим редактирования -->
       <Button design='edit' onclick={startEditing} title={'Добавить, переименовать, удалить категории'}>
        <span>Редактировать</span>
      </Button>
    {:else}
      <div class="edit-actions">
        <Button design='save' onclick={saveChanges}>
          <span>Сохранить</span>
        </Button>
        <Button design='delete' onclick={cancelChanges} title="Отменить изменения">
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
      <ul class="edit-list">
  {#each tempCats as category, i (category.id)}
    <li class="edit-item" 
        class:is-dragging={draggedIndex === i}
        class:draggable-item={category.id !== 0}
        draggable={category.id !== 0}
        ondragstart={(e) => handleDragStart(i, category.id)}
        ondragover={(e) => handleDragOver(e, category.id)}
        ondragend={handleDragEnd}
        ondrop={() => handleDrop(i, category.id)}
    >
      <!-- Обертка с классом-защитой pointer-events -->
      <div class="item-content-wrapper">
        <Input type="text" bind:value={category.title}/>
        {#if category.id !== 0}
          <Button design="delete" onclick={() => requestRemoveCategory(category.id)}>
            <span>X</span>
          </Button>
        {/if}
      </div>
    </li>
  {/each}
  <div class="add-cat-box">
          <Input placeholder="Enter, чтобы добавить" bind:value={newCatTitle} onkeydown={handleAddNewCategory}/>
  </div>
</ul>
    {/if}
  </div>
</div>
{#if isConfirmOpen}
  <Modal
  title="Удаление категории"
  message= {`Вы действительно хотите удалить категорию «${categoryToDelete?.title}»? Заметки в этой категории перейдут в категорию «${catList[0].title}»`}
  bind:isOpen={isConfirmOpen}
  onconfirm={confirmRemoveCategory}
  oncancel={() => selectedCategory = null}
  />  
{/if}