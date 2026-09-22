<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    type = 'button',
    title = '',
    design = '',
    disabled = false,
    onclick,
    children
  } = $props<{
    type?: 'button' | 'submit' | 'reset';
    title?: string;
    design?: string;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  }>();
</script>

<button
  type={type}
  title={title}
  class={design}
  disabled={disabled}
  onclick={onclick}
>
  {@render children?.()}
</button>

<style>
  button {
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    color: var(--text);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* --- Обычные текстовые кнопки --- */
    &.primary, &.save, &.delete, &.edit, &.info {
      padding: 9px 14px;
    }

    &.primary {
      background-color: color-mix(in srgb, var(--primary) 16%, transparent);
      color: var(--primary);
      &:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--primary) 25%, transparent);
        border-color: var(--primary);
      }
    }
    
    &.save {
      background-color: color-mix(in srgb, var(--success) 16%, transparent);
      color: var(--success);
      &:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--success) 25%, transparent);
        border-color: var(--success);
      }
    }

      &.delete {
    padding: 9px 14px;
    background-color: color-mix(in srgb, var(--danger) 12%, transparent);
    color: var(--danger);
    border: 1px solid color-mix(in srgb, var(--danger) 30%, transparent);
    font-weight: 600;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* плавная анимация */

    /* Эффект НАВЕДЕНИЯ на текстовую кнопку удаления */
    &:hover:not(:disabled) {
      background-color: var(--danger) !important; /* Сплошной залив цветом danger */
      color: #ffffff !important; /* Текст становится белым для контраста */
      border-color: var(--danger) !important;
      transform: scale(1.04); /* Легкий интерактивный подскок вверх */
      box-shadow: 0 4px 12px color-mix(in srgb, var(--danger) 30%, transparent); /* Мягкое свечение */
    }

    /* Эффект НАЖАТИЯ */
    &:active:not(:disabled) {
      transform: scale(0.96); /* Кнопка физически вдавливается */
    }
  }

     &.info {
    padding: 9px 14px;
    background: transparent;
    color: var(--text);
    opacity: 0.8;
    
    &:hover:not(:disabled) {
      background-color: color-mix(in srgb, var(--text) 8%, transparent) !important;
      opacity: 1;
      transform: scale(1.02);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &.active {
      border-color: var(--primary);
      color: var(--primary);
      background-color: color-mix(in srgb, var(--primary) 8%, transparent);
      opacity: 1;
    }
  }

    /* --- Компактные иконочные кнопки для карточки --- */
    &.icon-edit, &.icon-delete {
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 8px;
      background-color: color-mix(in srgb, var(--text) 6%, transparent);
      color: color-mix(in srgb, var(--text) 80%, transparent);
    }

    /* Яркий интерактивный отклик при наведении на Иконку Редактирования */
    &.icon-edit:hover:not(:disabled) {
      background-color: color-mix(in srgb, var(--warning) 20%, transparent) !important;
      color: var(--warning) !important;
      border-color: color-mix(in srgb, var(--warning) 40%, transparent) !important;
      transform: scale(1.08); /* Кнопка заметно увеличивается */
    }

    /* Яркий интерактивный отклик при наведении на Иконку Удаления */
    &.icon-delete:hover:not(:disabled) {
      background-color: color-mix(in srgb, var(--danger) 20%, transparent) !important;
      color: var(--danger) !important;
      border-color: color-mix(in srgb, var(--danger) 40%, transparent) !important;
      transform: scale(1.08);
    }

    /* Эффект физического нажатия на кнопку */
    &.icon-edit:active:not(:disabled), &.icon-delete:active:not(:disabled) {
      transform: scale(0.92); /* Сжимается при клике */
    }
  }
</style>
