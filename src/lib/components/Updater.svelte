<script lang="ts">
import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import Button from './Button.svelte';
import { onMount } from "svelte"
import { getVersion } from '@tauri-apps/api/app';

let downloaded: number = $state(0);
let status = $state()
let contentLength: number | undefined = $state(0);
let message = $state('')
let isActual:boolean = $state(true)
let update = $state<Update | null>(null);
let version = $state<string>('');
let progress = $derived.by(() => {
  if (!contentLength || contentLength <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((downloaded / contentLength) * 100)
  );
});

onMount(async () => {
  version = await getVersion();
  update = await check();


if (update) {
  isActual = false
  console.log(
    `found update ${update.version} from ${update.date} with notes ${update.body}`
  );
  message = `Доступно обновление:
Версия: ${update.version}
Дата обновления: ${update.date}
Информация: ${update.body}`
}

})

async function updateAndInstall() {
  if (!update || status === 'installing') {
    return;
  }

  status = 'installing';
  downloaded = 0;
  contentLength = undefined;

  try {
    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case 'Started':
          downloaded = 0;
          contentLength = event.data.contentLength;

          console.log(
            `started downloading ${event.data.contentLength} bytes`
          );
          break;

        case 'Progress':
          downloaded += event.data.chunkLength;

          console.log(
            `downloaded ${downloaded} from ${contentLength ?? 'unknown'}`
          );
          break;

        case 'Finished':
          console.log('download finished');
          break;
      }
    });

    status = 'installed';
    console.log('update installed');

    await relaunch();
  } catch (error) {
  status = 'error';

  console.error('[updater] update failed:', error);
  console.error('[updater] error object:', JSON.stringify(error, null, 2));

  message = error instanceof Error
    ? error.message
    : String(error);
}
}


</script>

 <div class="update-info">
  {#if isActual}
    <span class="actual">
      Версия {version}
    </span>
  {:else if status === 'error'}
    <span
      class="update"
      title="Не удалось установить обновление"
    >
      Ошибка обновления
    </span>

    <Button
      type="button"
      design="primary"
      onclick={updateAndInstall}
    >
      <span>Повторить</span>
    </Button>
  {:else if status === 'installing'}
    <div class="progress-wrapper">
      <div class="progress-label">
        <span>Скачивание обновления…</span>

        {#if contentLength}
          <span>{progress}%</span>
        {/if}
      </div>

      <progress
        max="100"
        value={contentLength ? progress : undefined}
        aria-label="Прогресс скачивания обновления"
      ></progress>
    </div>
  {:else}
    <span class="update" title={message}>
      Доступно обновление
    </span>

    <Button
      type="button"
      design="primary"
      onclick={updateAndInstall}
      disabled={status === 'installing'}
    >
      <span>Обновить</span>
    </Button>
  {/if}
</div>
<style>
.update-info{
  background-color: var(--entity-item-bg);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: row;
  min-height: 47px;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  font-size: small;
    
  .actual{
    /* background-color: red; */
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    &:before{
        content: "";
        width: 10px;
        height: 10px;
        background-color: #3DD598;
        box-shadow: 0px 0px 5px 2px #3DD598;

        border-radius: 50%;
    }
  }
  .update{
    /* background-color: red; */
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    /* flex-grow: 1; */
    &:before{
        content: "";
        width: 10px;
        height: 10px;
        background-color: #F2B84B;
        box-shadow: 0px 0px 5px 2px #F2B84B;

        border-radius: 50%;
    }
}
        }

progress{
  -webkit-appearance: none; /* Сброс стилей для Chrome, Safari, Edge */
  -moz-appearance: none;    /* Сброс стилей для Firefox */
  appearance: none;
  height: 10px;
  width: 100%;
  /* flex-grow: 0; */

  &::-webkit-progress-bar {
    background-color: #c2c2c2;
    border-radius: 10px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  }
 &::-webkit-progress-value {
    background: linear-gradient(90deg, #f1ff2d75, #2bff368f);
    border-radius: 10px;
    transition: width 0.3s ease; /* Плавное изменение */
  }
}
</style>