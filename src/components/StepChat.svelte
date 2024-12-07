<script>
  import { Input, Label } from "flowbite-svelte";
  import { appStatusInfo } from "../store";
  const { id, url, pages } = $appStatusInfo;

  let loading = false;

  const numOfImagesToShow = Math.min(pages, 4);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1;
    return url
      .replace("/upload", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg");
  });

  const handleSubmit = () => {};
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
