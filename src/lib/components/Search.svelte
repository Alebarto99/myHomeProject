<script lang="ts">
  import Button from "./Button.svelte";
  // Импортируем иконки Лупы и Крестика из Lucide
  import { Search, X } from '@lucide/svelte';

  let {
    value = $bindable(''),
    placeholder = 'Введите запрос',
    title = '',
  } = $props();

  let inputRef = $state<HTMLInputElement | null>(null);

  function clearInput() {
    value = '';
    inputRef?.focus();
  }
</script>

<div class="searchbox">
  <!-- Современная иконка поиска вместо старого SVG -->
  <div class="search-icon-wrapper">
    <Search size={18} strokeWidth={2} />
  </div>
  
  <input 
    spellcheck="true" 
    bind:this={inputRef} 
    type="text" 
    {title} 
    {placeholder} 
    bind:value
  >
  
  <!-- Обертка плавно скрывает/показывает красивую кнопку стирания -->
  <div class="clear-btn-wrapper" class:visible={value.trim() !== ''}>
    <Button design="icon-delete" onclick={clearInput} title="Очистить поиск">
      <!-- Иконка крестика с защитой от перехвата событий мыши -->
      <X size={16} strokeWidth={2.5} style="pointer-events: none;" />
    </Button>
  </div>
</div>

<style>
  .searchbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    background-color: var(--bg);
    /* Паддинг справа минимальный (4px), так как у круглой кнопки есть свои внутренние отступы */
    padding: 0 4px 0 12px; 
    border-radius: 10px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    height: 40px; /* Стабильная фиксированная высота инпута */
    box-sizing: border-box;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;

    /* Эффект фокуса на строке поиска */
    &:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 15%, transparent), var(--shadow);
    }
    
    .search-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color);
      opacity: 0.5; /* Делаем лупу слегка приглушенной */
      flex-shrink: 0;
    }

    input {
      background: transparent;
      outline: none;
      border: 0;
      padding: 8px 0;
      font-size: 0.95rem;
      color: var(--text-color);
      flex: 1;
      min-width: 0px;

      &::placeholder {
        font-size: 0.9em;
        opacity: 0.65;
      }
    }

    .clear-btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      /* По умолчанию скрываем кнопку через прозрачность и масштаб для плавности */
      opacity: 0;
      transform: scale(0.8);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      flex-shrink: 0;
      
      /* Класс активируется, когда в инпуте появляется текст */
      &.visible {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }
    }
  }
</style>
