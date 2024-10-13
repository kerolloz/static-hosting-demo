<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import {
    type Deployment,
    DeploymentStatusEnum,
    DeploymentTypeEnum,
  } from "../../../backend/src/shared/types";
  import { BACKEND_BASE_URI } from "../lib/api";

  let deployments: Deployment[] = [];
  let error: Error | null = null;
  let loading = true;
  let lastRefreshed: Date;

  const fetchDeployments = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URI}/deployments`);
      deployments = await response.json();
      lastRefreshed = new Date();
      error = null;
    } catch (err) {
      error = err as Error;
    } finally {
      loading = false;
    }
  };

  const statusColors = {
    [DeploymentStatusEnum.PENDING]: "text-yellow-500 animate-pulse",
    [DeploymentStatusEnum.BUILDING]: "text-blue-500 animate-pulse",
    [DeploymentStatusEnum.DEPLOYED]: "text-green-500",
    [DeploymentStatusEnum.FAILED]: "text-red-500",
  };
  const typeColors = {
    [DeploymentTypeEnum.ZIP]: "bg-purple-500",
    [DeploymentTypeEnum.GIT]: "bg-orange-500",
  };

  const getStatusColor = (status: DeploymentStatusEnum) =>
    statusColors[status] ?? "";
  const getTypeColor = (type: DeploymentTypeEnum) => typeColors[type] ?? "";

  onMount(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5000);
    return () => clearInterval(interval);
  });
</script>

<main
  class="w-full h-full min-h-screen flex flex-col justify-center items-center bg-slate-900 text-slate-100 py-8"
>
  <h1 class="text-4xl mb-8">Deployments</h1>
  <!-- New deployment button -->
  <div class="flex space-x-4 mb-8">
    <Link
      to="/new/zip"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      New ZIP Deployment
    </Link>
    <Link
      to="/new/git"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      New Git Deployment
    </Link>
  </div>
  <div class="w-3/4">
    {#if error}
      <p class="text-red-500">Error: {error.message}</p>
    {:else if loading}
      <p class="text-center">Loading...</p>
    {:else if !deployments.length}
      <p class="text-center">No deployments found.</p>
    {:else}
      <!-- Last refreshed -->
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th class="px-4 py-2">#</th>
            <th class="px-4 py-2">URL</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {#each deployments as deployment, i}
            <tr class="border-t border-slate-700">
              <td class="px-4 py-2">{i + 1}</td>
              <td class="px-4 py-2">
                <a
                  href={deployment.url}
                  target="_blank"
                  class="text-blue-400 hover:underline"
                  >{deployment.url ?? ""}</a
                >
              </td>
              <td class="px-4 py-2 {getStatusColor(deployment.status)}"
                >{deployment.status}</td
              >
              <td class="px-4 py-2">
                <span
                  class="px-2 py-1 rounded text-white {getTypeColor(
                    deployment.type,
                  )}">{deployment.type}</span
                >
              </td>
              <td class="px-4 py-2"
                >{new Date(deployment.createdAt).toLocaleString()}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>

      <p class="text-sm text-gray-400 mb-4">
        Last refreshed: {lastRefreshed.toLocaleString()}
      </p>
    {/if}
  </div>
</main>
