<script>
  import {
    appStatusCheck,
    setAppStatusLoading,
    setAppStautsError,
    setAppStautsChatMode,
  } from "../store";
  import Dropzone from "svelte-file-dropzone";

  let files = {
    accepted: [],
    rejected: [],
  };

  async function handleFilesSelect(e) {
    try {
      const { acceptedFiles, fileRejections } = e.detail;
      files.accepted = [...files.accepted, ...acceptedFiles];
      files.rejected = [...files.rejected, ...fileRejections];

      if (acceptedFiles.length > 0) {
        setAppStatusLoading();

        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const rest = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        console.log("rest response api", rest);

        if (!rest.ok) {
          setAppStautsError();
          return;
        }

        const { id, url, pages } = await rest.json();
        setAppStautsChatMode({ id, url, pages });
      }
    } catch (error) {
      console.error(error);
      setAppStautsError();
    }
  }
</script>

<Dropzone accept="application/pdf" multiple={false} on:drop={handleFilesSelect}
  >Arrastra y suelta aqui tu pdf</Dropzone
>
<ol>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ol>
