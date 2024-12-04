<script>
  import { appStatusCheck, setAppStatusLoading } from "../store";
  import Dropzone from "svelte-file-dropzone";

  let files = {
    accepted: [],
    rejected: [],
  };

  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    console.log(acceptedFiles);
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    if (acceptedFiles.length > 0) {
      setAppStatusLoading();
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
