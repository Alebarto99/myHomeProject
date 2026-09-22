<script lang="ts">
    import Button from "./Button.svelte";
    import { fly } from "svelte/transition";
    import { Trash, Pencil } from '@lucide/svelte';

    let {
        onclickheadline = $bindable(),
        onclickdescription = $bindable(),
        onclickEdit = $bindable(),
        onclickRemove = $bindable(),
        title = "нужен title",
        description = "нужен description",
        tags = ["нужен список tags"],
        category = "нужен список category",
    } = $props();

    // Состояние для активации отображения кнопок вместо категории
    let isHovered = $state(false);
</script>

<!-- Прослушиваем наведение мыши на всю карточку -->
<div 
    class="card" 
    class:hovered={isHovered} 
    transition:fly={{ x: 300, duration: 300 }}
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
    role='banner'
>
    <!-- Шапка: заголовок слева, экшен-зона справа -->
    <div class="card-header">
        <button class="card-title" onclick={onclickheadline} title={title}>
            {title}
        </button>
        
        <div class="card-action-zone">
            <!-- Категория -->
            <span class="card-category">{category}</span> 
            
            <!-- Кнопки управления -->
            <div class="card-tools">
                <Button design="icon-edit" onclick={onclickEdit} title="Редактировать">
                    <Pencil size={15} strokeWidth={2.5} style="pointer-events: none;" />
                </Button>
                <Button design="icon-delete" onclick={onclickRemove} title="Удалить">
                    <Trash size={15} strokeWidth={2.5} style="pointer-events: none;" />
                </Button>
            </div>
        </div>
    </div>
    
    <!-- Описание с ограничением в 3 строки -->
    <button type="button" class="card-description-btn" onclick={onclickdescription}>
        <p class="card-description">{description}</p>
    </button>
    
    <!-- Список тегов (лишние аккуратно прячутся) -->
    {#if tags && tags.length > 0}
        <div class="card-tags">
            {#each tags as tag}
                <span class="tag">{tag}</span>
            {/each}
        </div>
    {/if}
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: var(--entity-item-bg);
    padding: 8px;
    border-radius: 12px;
    border: 2px solid rgba(0, 0, 0, 0);
    transition: border 0.3s ease;
    box-sizing: border-box;

    &:hover, &.hovered {
      border: 2px solid var(--primary);
    }
    
    .card-header {
      display: flex;
      flex-direction: row;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      height: 32px; /* Стабильная высота, чтобы заголовок не прыгал */

      .card-title {
        border: 0;
        background: transparent;  
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text); 
        font-weight: 600;
        font-size: 1.1em;
        text-align: left;
        cursor: pointer;
        flex: 1; 
        min-width: 0; 
      }

      /* Общая зона для накладывающихся элементов */
      .card-action-zone {
        display: grid;
        grid-template-areas: "stack";
        align-items: center;
        justify-items: end;
        flex-shrink: 0;
        
        & > * {
          grid-area: stack;
          /* Важно: транзишн карточки не ломает транзишн кнопок, так как меняет только эти свойства */
          transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
        }
      }

      .card-category {
        background-color: var(--entity-item-category);
        padding: 5px 8px;
        border-radius: 6px;
        font-size: 0.85em;
        user-select: none;
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      .card-tools {
        display: flex;
        flex-direction: row;
        gap: 6px;
        opacity: 0;
        visibility: hidden;
        transform: scale(0.95) translateY(3px);
        pointer-events: none; /* Запрещаем ховеры на невидимые кнопки */
      }
    }

    /* Изменение видимости зоны при ховере на КАРТОЧКУ */
    &.hovered {
      .card-category {
        opacity: 0;
        visibility: hidden;
        transform: scale(0.95) translateY(-3px);
      }
      .card-tools {
        opacity: 1;
        visibility: visible;
        transform: scale(1) translateY(0);
        pointer-events: auto; /* Разрешаем наведение на сами кнопки */
      }
    }

    /* Кнопка-обертка для описания */
    .card-description-btn {
      background: transparent;
      border: 0;
      padding: 0;
      margin: 0;
      text-align: left;
      cursor: pointer;
      display: block;
      width: 100%;
    }
    
    .card-description {
      margin: 0;
      color: var(--entity-text-1); 
      font-size: 0.95em;
      line-height: 1.5;
      
      display: -webkit-box;
      -webkit-line-clamp: 3; 
      line-clamp: 3;         
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Теги */
    .card-tags {
      display: flex;
      flex-wrap: wrap; 
      gap: 6px;
      max-height: 26px; /* Строго под один ряд тегов */
      overflow: hidden; 
      margin-top: auto; 

      .tag {
        background-color: var(--tag-bg);
        color: var(--entity-text-1);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.85em;
        white-space: nowrap;
        display: inline-block;

        &::before {
          content: "#";
          opacity: 0.7;
          margin-right: 1px;
        }
      }
    }
  }
</style>
