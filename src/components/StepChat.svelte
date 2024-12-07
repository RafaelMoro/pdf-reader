<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStautsError } from "../store";
  const { id, url, pages } = $appStatusInfo;

  let loading = false;
  let answer = "";

  const numOfImagesToShow = Math.min(pages, 4);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1;
    return url
      .replace("/upload", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg");
  });

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      loading = true;

      const question = event.target.question.value;
      const searchParams = new URLSearchParams();
      searchParams.append("id", id);
      searchParams.append("question", question);

      // Esto se usa solo con streaming the datos.
      const eventSource = new EventSource(
        `/api/ask?${searchParams.toString()}`
      );

      eventSource.onmessage = (event) => {
        loading = false;
        const incomingData = JSON.parse(event.data);

        if (incomingData === "__END__") {
          eventSource.close();
          return;
        }
        answer = +incomingData;
      };

      /**
       * No hace falta usar un catch porque si obtenemos un 404, 500, etc, lo obtendremos en !res.ok
       * El catch es solo si hay un error de conexion o un error muy cañon
       */

      // Este se usa si no se hace streaming de datos
      // const res = await fetch(`/api/ask?${searchParams.toString()}`, {
      //   // method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // body: JSON.stringify({
      //   //   id,
      //   //   question,
      //   // }),
      // });

      // if (!res.ok) {
      //   console.error(res);
      //   return;
      // }

      // const { response } = await res.json();
      // answer = response;
    } catch (error) {
      console.error(error);
      setAppStautsError();
    } finally {
      loading = false;
    }
  };
</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img
      src={image}
      alt="Imagen"
      class="w-full h-auto rounded aspect-[400/540]"
    />
  {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
  <div class="mb-6">
    <Label
      for="question"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >Deja aqui tu pregunta</Label
    >
    <Input
      type="text"
      id="question"
      placeholder="¿De qué trata este documento?"
      required
      class="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</form>

{#if loading}
  <div class="mt-4 flex justify-center items-center flex-col gap-y-2">
    <Spinner />
    <p class="opacity-75">Esperando respuesta...</p>
  </div>
{/if}

{#if answer}
  <div class="mt-4 flex justify-center items-center flex-col gap-y-2">
    <p class="text-sm font-medium text-gray-900 dark:text-gray-300">
      Respuesta:
    </p>
    <p class="text-sm text-gray-700 dark:text-gray-400">{answer}</p>
  </div>
{/if}
