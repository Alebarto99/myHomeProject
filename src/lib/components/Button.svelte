<script lang="ts">
let {
    type = $bindable(`button`),
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
class={design}>
{#if children}
{@render children()}
{/if}
</button>