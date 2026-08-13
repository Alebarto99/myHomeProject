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
	input{
		outline: none;
		border: 1px solid rgba(0, 0, 0, 0.349);
		padding: 11px 5px;
		flex-grow: 0;
		font-size: large;
		color: var(--text-color);
		min-width: 100px;

		
	}
</style>
	<!-- Будет красивый инпут -->
	<input spellcheck="true" bind:this={inputRef} type="text" {placeholder} bind:value>