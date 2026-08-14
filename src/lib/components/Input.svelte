<script lang="ts">
let {
    value = $bindable(''),
    placeholder = 'Введите запрос'
} = $props();

let inputRef = $state<HTMLInputElement | null>(null);

function clearInput() {
    value = '';
    inputRef?.focus();
  }

</script>

<style>
	
</style>
	<!-- Будет красивый инпут -->
	<input spellcheck="true" bind:this={inputRef} type="text" {placeholder} bind:value>