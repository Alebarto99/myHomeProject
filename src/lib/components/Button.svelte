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