<script lang="ts">
  type CardVariant = 'accent' | 'paper' | 'timeline';

  let {
    title,
    description = '',
    category = '',
    tags = [],
    date = '',
    variant = 'accent',
    onclickheadline,
    onclickdescription,
    onclickEdit,
    onclickRemove
  }: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    date?: string;
    variant?: CardVariant;
    onclickheadline?: () => void;
    onclickdescription?: () => void;
    onclickEdit?: () => void;
    onclickRemove?: () => void;
  } = $props();
</script>

<article class={`note-card note-card--${variant}`}>
  {#if variant === 'timeline'}
    <div class="timeline-rail" aria-hidden="true"></div>
  {/if}

  <div class="note-card__content">
    <div class="note-card__topline">
      {#if category}
        <span class="note-card__category">{category}</span>
      {/if}

      <div class="note-card__actions">
        {#if onclickEdit}
          <button
            type="button"
            class="icon-button"
            aria-label="Редактировать заметку"
            title="Редактировать"
            onclick={onclickEdit}
          >
            ✎
          </button>
        {/if}

        {#if onclickRemove}
          <button
            type="button"
            class="icon-button icon-button--danger"
            aria-label="Удалить заметку"
            title="Удалить"
            onclick={onclickRemove}
          >
            ×
          </button>
        {/if}
      </div>
    </div>

    <button
      type="button"
      class="note-card__title"
      onclick={onclickheadline}
      title="Скопировать заголовок"
    >
      {title}
    </button>

    {#if description}
      <button
        type="button"
        class="note-card__description"
        onclick={onclickdescription}
        title="Скопировать описание"
      >
        {description}
      </button>
    {/if}

    <div class="note-card__footer">
      {#if tags.length > 0}
        <div class="note-card__tags" aria-label="Теги">
          {#each tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {/if}

      {#if date}
        <time class="note-card__date">{date}</time>
      {/if}
    </div>
  </div>
</article>

<style>
  .note-card {
    position: relative;
    display: flex;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--entity-item-bg);
    color: var(--text);
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  .note-card:hover {
    border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
    box-shadow: 0 8px 20px rgb(0 0 0 / 10%);
    transform: translateY(-2px);
  }

  .note-card__content {
    display: flex;
    width: 100%;
    min-width: 0;
    flex-direction: column;
    padding: 14px;
  }

  .note-card--accent::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: var(--primary);
    content: '';
  }

  .note-card--paper {
    box-shadow: 0 5px 12px rgb(0 0 0 / 6%);
  }

  .note-card--paper::before {
    width: 100%;
    height: 3px;
    background: var(--warning);
    content: '';
  }

  .note-card--paper .note-card__content {
    padding-top: 17px;
  }

  .note-card--timeline {
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .note-card--timeline:hover {
    border-color: transparent;
    box-shadow: none;
    transform: none;
  }

  .timeline-rail {
    position: relative;
    width: 18px;
    flex: 0 0 18px;
  }

  .timeline-rail::before {
    position: absolute;
    top: 0;
    bottom: -18px;
    left: 7px;
    width: 2px;
    background: var(--border);
    content: '';
  }

  .timeline-rail::after {
    position: absolute;
    top: 15px;
    left: 2px;
    width: 9px;
    height: 9px;
    border: 2px solid var(--background);
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
    content: '';
  }

  .note-card--timeline .note-card__content {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--entity-item-bg);
  }

  .note-card__topline,
  .note-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .note-card__category {
    overflow: hidden;
    color: var(--primary);
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.06em;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .note-card__actions {
    display: flex;
    flex: 0 0 auto;
    gap: 2px;
  }

  .icon-button {
    display: inline-grid;
    width: 26px;
    height: 26px;
    place-items: center;
    border: 0;
    border-radius: 6px;
    color: var(--muted);
    background: transparent;
    font-size: 16px;
    line-height: 1;
  }

  .icon-button:hover,
  .icon-button:focus-visible {
    color: var(--text);
    background: var(--surface-soft);
  }

  .icon-button--danger:hover,
  .icon-button--danger:focus-visible {
    color: var(--danger);
  }

  .note-card__title,
  .note-card__description {
    display: block;
    width: 100%;
    border: 0;
    padding: 0;
    text-align: left;
  }

  .note-card__title {
    margin-top: 12px;
    color: var(--text);
    background: transparent;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
  }

  .note-card__title:hover,
  .note-card__title:focus-visible {
    color: var(--primary);
  }

  .note-card__description {
    display: -webkit-box;
    margin-top: 7px;
    overflow: hidden;
    color: var(--muted);
    background: transparent;
    font-size: 12px;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .note-card__description:hover,
  .note-card__description:focus-visible {
    color: var(--text);
  }

  .note-card__footer {
    align-items: flex-end;
    margin-top: auto;
    padding-top: 14px;
  }

  .note-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .tag {
    padding: 4px 7px;
    border-radius: 5px;
    color: var(--muted);
    background: var(--surface-soft);
    font-size: 10px;
  }

  .note-card__date {
    flex: 0 0 auto;
    color: var(--muted);
    font-size: 10px;
  }

  button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .note-card {
      transition: none;
    }
  }
</style>
