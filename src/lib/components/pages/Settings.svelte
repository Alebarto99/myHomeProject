<script lang="ts">
import Button  from "../Button.svelte";

let {
    onclickExit,
    theme_key,
    currentTheme,
} = $props()


</script>


<main>
    <span>настройки</span>
    <span>Находится в работе</span>

    <Button type='button' design='primary'>
        <span>Сменить тему</span>
    </Button>
    <Button type='button' design='primary' onclick={onclickExit}>
        <span>В главное меню</span>
    </Button>
</main>

<style>
	
</style>