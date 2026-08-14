<script lang="ts">
let {
    type = $bindable(`button`),
    title = '',
    design,
    onclick = $bindable(),
    children
} = $props();
</script>

<style>
</style>

<button 
onclick={onclick} 
type={type} 
class={design}
title={title}
>
{#if children}
{@render children()}
{/if}
</button>