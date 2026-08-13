<script lang="ts">
let {
    value = $bindable(''),
    placeholder = 'Введите запрос'
} = $props();

</script>

<style>
    textarea{
        /* min-height: calc(10lh + 16px); */
        /* max-height: calc(15lh + 16px); */
        field-sizing: content;
        resize: none;
        overflow-y: auto;
        scrollbar-width: none;
        width: 100%;
        outline: none;
        padding: 5px;
        border: 1px solid var(--border);
        color: var(--text-color);
        font-size: large;
        flex-grow: 1;
        white-space: pre-wrap;

    }
</style>


<textarea spellcheck="true" {placeholder} bind:value></textarea>