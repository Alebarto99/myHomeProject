<script lang="ts">
  import Button from "./Button.svelte";

  let {
    isOpen = $bindable(false),
    title = 'Подтвердите действие',
    message = 'Вы уверены, что хотите удалить этот элемент? Это действие необратимо.',
    onconfirm,
    oncancel
  } = $props();

  let dialogRef = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (isOpen) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleConfirm() {
    isOpen = false;
    if (onconfirm) onconfirm();
  }

  function handleCancel() {
    isOpen = false;
    if (oncancel) oncancel();
  }
</script>

<dialog bind:this={dialogRef} oncancel={handleCancel}>
  <div class="modal-content">
    <!-- Добавили HTML-атрибут title для подсказки при наведении на троеточие -->
    <h3 title={title}>{title}</h3>
    <p>{message}</p>
    <div class="modal-actions">
      <Button design='info' onclick={handleCancel}>
        <span>Отменить</span>
      </Button>
      <Button design='delete' onclick={handleConfirm}>
        <span>Удалить</span>
      </Button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    background: var(--entity-item-bg, #222); 
    max-width: 400px;
    width: calc(100% - 32px); /* Защита для мобильных экранов, чтобы были отступы по бокам */
    margin: auto;
    color: var(--text);
    padding: 20px;
    box-sizing: border-box;
    
    &::backdrop {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0; /* Важно для работы text-overflow внутри Flex-контейнеров */
    
    h3 { 
      margin: 0; 
      color: var(--danger, #e25555); 
      font-size: 1.25em;
      font-weight: 600;
      
      /* Если заголовок/название заметки слишком длинные — скрываем в троеточие */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
    
    p { 
      margin: 0; 
      color: var(--text); 
      font-size: 0.95em; 
      line-height: 1.5;
      
      /* Магия автоматического переноса длинного текста */
      white-space: pre-wrap;      /* Сохраняет ручные переносы строк, если они есть */
      overflow-wrap: break-word;  /* Переносит слишком длинные слова (ссылки, наборы букв) */
      word-break: break-word;     /* Дополнительная кроссбраузерная защита */
    }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
    flex-shrink: 0;
  }
</style>
