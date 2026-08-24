<script lang="ts">

const testCard = [
  {id: 0, title: "Заметка 1", description: "Описание заметки 1", column: 0},
  {id: 1, title: "Заметка 2", description: "Описание заметки 2", column: 0},
  {id: 2, title: "Заметка 3", description: "Описание заметки 3", column: 0},
  {id: 3, title: "Заметка 4", description: "Описание заметки 4", column: 0},
  {id: 4, title: "Заметка 5", description: "Описание заметки 5", column: 0},
  {id: 5, title: "Заметка 6", description: "Описание заметки 6", column: 0}
]

const boxes = [
  { id: 0, title: "ToDo"},
  { id: 1, title: "Done"},
]


function draggable(node, data) {
	let state = data;

	node.draggable = true
	node.style.cursor = 'grab';

	function handleDragStart(e){
		e.dataTransfer.setData('text/plain', state)
	}

	node.addEventListener('dragstart', handleDragStart)

	return{
		update(data){
			state = data
		},
		destroy(){
			node.removeEventListener('dragstart', handleDragStart)
		}
	}
}



</script>
<ul class="boxes">
{#each boxes as column as column}
{@const cards = testCard.filter(card => card.column === column.id)}
  <li>
    <h2>{column.title}</h2>
    {#if cards.length > 0 }
      <ul>
        {#each testCard as card (card.id)}
          <li draggable="true" use:draggable={card.id}>
            {card.title}
            <p>{card.description}</p>
          </li>
        {/each}
      </ul>
    {:else}
      <span>No cards available</span>
    {/if}
  </li>
{/each}
</ul>


<style>
ul{
  list-style: none;
  padding: 0;
  margin: 0;

  li{
    padding: 10px;
    margin: 5px 0;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
}

.boxes{
  display: flex;
  gap: 20px;

  li{
    flex: 1;
    background-color: #e0e0e0;
    padding: 10px;
    border-radius: 4px;

    h2{
      margin-top: 0;
    }
  }
}

</style>