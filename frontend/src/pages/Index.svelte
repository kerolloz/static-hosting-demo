<script lang="ts">
  import { Link } from "svelte-routing";

  const BACKEND_BASE_URI = "http://localhost:3000";
  const deployments = fetch(`${BACKEND_BASE_URI}/deployments`).then(
    (response) => response.json(),
  );
</script>

<main
  class="w-full h-full min-h-screen flex flex-col justify-center items-center bg-slate-900 text-slate-100 py-8"
>
  <h1 class="text-4xl mb-8">Deployments</h1>
  <!-- New deployment button -->
  <Link
    to="/new"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
  >
    New Deployment
  </Link>
  <ol class="w-3/4">
    {#await deployments}
      <li class="text-center">Loading...</li>
    {:then data}
      {#each data as deployment, i}
        <li class="mb-4">
          {i + 1}.{" "}
          <a
            href={deployment.url}
            target="_blank"
            class="text-blue-400 hover:underline">{deployment.url}</a
          >
        </li>
      {/each}
    {:catch error}
      <li class="text-red-500">Error: {error.message}</li>
    {/await}
  </ol>
</main>
