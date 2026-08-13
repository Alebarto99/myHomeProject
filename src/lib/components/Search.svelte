<script lang="ts">
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
	<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 16 16">
		<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
	</svg>
	<input spellcheck="true" bind:this={inputRef} type="text" {title} {placeholder} bind:value>
		<button class="clear" onclick={clearInput}>X</button>
</div>

<style>
    .searchbox{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;
		background-color: var(--bg);
		padding: 0 0 0 11px;
		border-radius: 10px;
		border: 1px solid var(--border);
        box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.3) inset;
		
		input{
			background: transparent;
			outline: none;
			border: 0;
			padding: 11px 0;
			font-size: medium;
			color: var(--text-color);
			flex-grow: 1;
			min-width: 0px;
			
			&:not(:placeholder-shown) ~ .clear {
				display: block;
			}

			&::placeholder{
				font-size: small;
			}
		}

		svg{
			padding-right: 5px;
			width: 20px;
			height: 20px;
			fill: black;
			font-size: 24px;
			vertical-align: top;
		}

		.clear{
			display: none;
			background: transparent;
			color: black;
			margin: 0px;
			padding: 0 15px 0 5px;
			font-size: 18px;

   		 &:hover{
			color: #e25555;
			stroke: #e25555;
			}
		}
	}
</style>