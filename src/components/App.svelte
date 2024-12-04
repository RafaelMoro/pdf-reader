<script>
  import { Progressbar, Alert } from "flowbite-svelte";
  import { APP_STATUS, appStatusCheck } from "../store";
</script>

{#if $appStatusCheck === APP_STATUS.INIT}
  <p>La pagina inicial esta cargando</p>
{:else if $appStatusCheck === APP_STATUS.LOADING}
  <p>La pagina esta cargando</p>
{:else if $appStatusCheck === APP_STATUS.CHAT_MODE}
  <p>La pagina esta en modo chat</p>
{:else if $appStatusCheck === APP_STATUS.ERROR}
  <Alert color="red">
    <span class="font-medium">Algo malo ha pasado</span>
    Hubo un error en la app.
  </Alert>
{/if}

<Alert color="red">
  <span class="font-medium">Danger alert!</span>
  Change a few things up and try submitting again.
</Alert>
