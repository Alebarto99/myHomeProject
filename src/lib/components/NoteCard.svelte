<script>
    import Button from "./Button.svelte";
    import {fly, fade} from "svelte/transition"

    let {
        onclickheadline = $bindable(),
        onclickdescription = $bindable(),
        onclickEdit = $bindable(),
        onclickRemove = $bindable(),
        title = "нужен title",
        description = "нужен description",
        tags = ["нужен список tags"],
        category = "нужен список category",
    } = $props();
</script>


<div class="card" transition:fly={{x: 300, duration: 300}}>
    <div class="card-header" >
        <Button type="button" design='card-title' onclick={onclickheadline}>
            <span class="card-title">{title}</span>
        </Button>
        <span class="card-category">{category}</span> 
    </div>
    <Button type="button" design='card-description' onclick={onclickdescription} >
        <span>{description}</span>
    </Button>
    <div class="card-tags">
        {#each tags || [] as tag}
            <span class="tag">{tag}</span>
        {/each}
    </div>
    <div class="card-tools" style="display: flex;">
        <Button design="edit" onclick={onclickEdit}>
            <span>Изменить</span>
        </Button>
        <Button design="delete" onclick={onclickRemove} type="remove">
            <span>Удалить</span>
        </Button>
    </div>
</div>
