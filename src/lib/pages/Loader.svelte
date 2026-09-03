<script lang='ts'>
  let isLoaded = $state(false);

</script>

<main>
<div class="loader">
    <div class="spinner"></div>
    <p class="loader-text">Загрузка...</p>
    <p class="loader-text">{isLoaded}</p>
</div>
</main>

<style>

  .loader {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .spinner {
    width: 80px;
    height: 80px;
    border: 8px solid transparent;
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 4s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  }

  .loader-text {
    font-size: large;
    color: var(--text);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>