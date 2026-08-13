<script lang="ts">
  let {
    isOpen = $bindable(false),
    title = 'Подтвердите действие',
    message = 'Вы уверены, что хотите удалить этот элемент? Это действие необратимо.',
    onconfirm,
    oncancel
  } = $props();

  let dialogRef = $state<HTMLDialogElement | null>(null);

  // Следим за пропом isOpen. Если родитель открывает окно — дергаем нативный метод .showModal()
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

<!-- Нативное диалоговое окно. oncancel перехватывает закрытие по кнопке Esc -->
<dialog bind:this={dialogRef} oncancel={handleCancel}>
  <div class="modal-content">
    <h3>{title}</h3>
    <p>{message}</p>
    <div class="modal-actions">
      <button class="btn-confirm" onclick={handleConfirm}>Да, удалить</button>
      <button class="btn-cancel" onclick={handleCancel}>Отмена</button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: 1px solid var(--border, #ccc);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    background: var(--surface, white);
    max-width: 400px;
    width: 100%;
    margin: auto;
    
    /* Стилизация встроенного размытия заднего фона браузера */
    &::backdrop {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(2px);
    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    h3 { margin: 0; color: #e25555; }
    p { margin: 0; color: var(--text-color, #333); font-size: 0.95em; }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 5px;
    
    button {
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      border: 1px solid transparent;
    }
    .btn-confirm {
      background: #e25555;
      color: white;
      &:hover { background: #bb4646; }
    }
    .btn-cancel {
      background: #e0e0e0;
      color: #333;
      &:hover { background: #d0d0d0; }
    }
  }
</style>
