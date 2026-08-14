<script lang="ts">
let {
    value = $bindable(''),
    placeholder = 'Введите запрос'
} = $props();

</script>

<style>
    textarea{
        padding: 5px 10px 0px 0px;
        field-sizing: content;
        resize: none;
        overflow-y: auto;
        scrollbar-width: none;
        width: 100%;
        outline: none;
        padding: 5px;
        font-size: large;
        flex-grow: 1;
        white-space: pre-wrap;

        &:focus{
			outline: 1px solid var(--primary);
        }
    }
</style>


<textarea spellcheck="true" {placeholder} bind:value ></textarea>