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
  <div class="card">
    <h3>{title}</h3>
    <p>{message}</p>
    <div class="modal-actions">
    <Button design='primary' onclick={handleConfirm}>
      <span>удалить</span>
    </Button>
    <Button design='delete' onclick={handleCancel}>
      <span>Отменить</span>
    </Button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: 1px solid var(--border, #ccc);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    background: var(--surface, white);
    max-width: 400px;
    width: 100%;
    margin: auto;
    color: var(--text);
    
    /* Стилизация встроенного размытия заднего фона браузера */
    &::backdrop {
      background: rgba(0, 0, 0, 0.45);
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
  }
</style>
