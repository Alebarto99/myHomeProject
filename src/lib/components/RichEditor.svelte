<script>
  import Button from "./Button.svelte";
  import TextArea from "./TextArea.svelte";
  import Input from "./Input.svelte";

let {
  onsave,
  onclickExit,
  categories = [],
  initialData = null,
} = $props()

let formState = $state({
  title: initialData?.title || '',
  description: initialData?.description || '',
  tags: initialData?.tags ? initialData?.tags.join(',') : '',
  category: initialData?.category || 0
})


function handleSubmit(e) {
    e.preventDefault(); // Предотвращаем перезагрузку страницы браузером

    // Валидация: не пускаем пустую заметку
    if (!formState.title.trim()) return alert('Введите заголовок!');

    // Формируем чистый объект
    const finalNote = {
      id: Date.now(),
      title: formState.title,
      description: formState.description,
      // Превращаем строку тегов "работа, учеба" в красивый массив строк ["работа", "учеба"]
      tags: formState.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: Number(formState.category)
    };

    // Отправляем готовую заметку родителю!
    if (onsave) onsave(finalNote);
  }

</script>


<form class="editor-form" onsubmit={handleSubmit}>
  <Input placeholder="Заголовок заметки" bind:value={formState.title}/>
  <TextArea placeholder="Описание заметки" bind:value={formState.description}/>
  <Input placeholder="Теги(вводятся через запятую)" bind:value={formState.tags}/>
  <select bind:value={formState.category}>
    {#each categories as category (category.id)}
      <option value={category.id} selected>{category.title}</option>
    {/each}
  </select>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
    <Button type="sumbit" design="save">
      <span>{initialData ? 'Сохранить изменения' : 'Добавить заметку'}</span>
    </Button>
    <Button onclick={onclickExit} design="delete">
      <span>Отменить</span>
    </Button>
  </div>

</form>


<style>
.editor-form{
  background-color: var(--surface);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 black;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: auto 0;
  flex-grow: 1;
  height: 100%;
  color: black;

}

</style>