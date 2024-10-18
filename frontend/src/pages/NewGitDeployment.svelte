<script lang="ts">
  import debounce from "lodash.debounce";
  import { onMount } from "svelte";
  import { BACKEND_BASE_URI } from "../lib/api";

  // biome-ignore lint/style/useConst: <explanation>
  let subdomain = "";
  let subdomainAvailable = true;
  let checkingSubdomain = false;
  let errorMessage = "";

  const checkSubdomainAvailability = debounce(async () => {
    if (!subdomain) return;
    checkingSubdomain = true;
    try {
      const response = await fetch(
        `${BACKEND_BASE_URI}/deployments/check-subdomain/${subdomain}`,
      );
      const data = await response.json();
      subdomainAvailable = data.available;
      errorMessage = subdomainAvailable ? "" : "Subdomain is already taken.";
    } catch (error) {
      errorMessage = "Error checking subdomain availability.";
    } finally {
      checkingSubdomain = false;
    }
  }, 300);

  const createGitDeployment = (e: SubmitEvent) => {
    if (!subdomainAvailable) {
      alert("Subdomain is already taken. Please choose another one.");
      return;
    }

    // Send a JSON request to the backend
    const target = e.target as HTMLFormElement;
    const subdomainInput = target[0] as HTMLInputElement;
    const repoUrlInput = target[1] as HTMLInputElement;
    const branchInput = target[2] as HTMLInputElement;
    const buildCommandInput = target[3] as HTMLInputElement;
    const outputDirInput = target[4] as HTMLInputElement;

    const subdomain = subdomainInput.value;
    const repoUrl = repoUrlInput.value;
    const branch = branchInput.value || "main";
    const buildCommand =
      buildCommandInput.value || "npm install && npm run build";
    const outputDir = outputDirInput.value || "dist";

    if (!repoUrl) {
      alert("Repository URL is required");
      return;
    }

    fetch(`${BACKEND_BASE_URI}/deployments/git`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subdomain,
        repoUrl,
        branch,
        buildCommand,
        outputDir,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href = "/";
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };
</script>

<main
  class="w-screen h-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-slate-900 to-slate-700 text-slate-100 py-10"
>
  <h1 class="text-4xl font-bold mb-6">
    Create a new Git repository deployment
  </h1>
  <form
    on:submit|preventDefault={createGitDeployment}
    class="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md"
  >
    <div class="mb-6">
      <label for="subdomain" class="block text-sm font-medium mb-2 text-left"
        >Subdomain (optional)</label
      >
      <input
        type="text"
        name="subdomain"
        id="subdomain"
        bind:value={subdomain}
        on:input={checkSubdomainAvailability}
        on:keydown={checkSubdomainAvailability}
        class="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {#if checkingSubdomain}
        <p class="text-yellow-500 text-sm mt-2">Checking availability...</p>
      {:else if !subdomainAvailable}
        <p class="text-red-500 text-sm mt-2">{errorMessage}</p>
      {/if}
    </div>
    <div class="mb-6">
      <label for="repoUrl" class="block text-sm font-medium mb-2 text-left"
        >Repository URL</label
      >
      <input
        type="url"
        name="repoUrl"
        id="repoUrl"
        class="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="https://github.com/user/repo"
        required
      />
    </div>
    <div class="mb-6">
      <label for="branch" class="block text-sm font-medium mb-2 text-left"
        >Branch (optional, defaults to 'main')</label
      >
      <input
        type="text"
        name="branch"
        id="branch"
        class="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="main"
      />
    </div>
    <div class="mb-6">
      <label for="buildCommand" class="block text-sm font-medium mb-2 text-left"
        >Build Command (optional, defaults to 'npm install && npm run build')</label
      >
      <input
        type="text"
        name="buildCommand"
        id="buildCommand"
        class="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="npm install && npm run build"
      />
    </div>
    <div class="mb-6">
      <label for="outputDir" class="block text-sm font-medium mb-2 text-left"
        >Output Directory (optional, defaults to 'dist')</label
      >
      <input
        type="text"
        name="outputDir"
        id="outputDir"
        class="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="dist"
      />
    </div>
    <button
      type="submit"
      class="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
      disabled={!subdomainAvailable}>Deploy</button
    >
  </form>
</main>

<style>
  main {
    background: linear-gradient(to right, #1e293b, #334155);
  }

  form {
    background: #1e293b;
  }

  input:focus {
    border-color: #3b82f6;
  }

  button {
    transition: background-color 0.2s ease-in-out;
  }

  button:hover:not(:disabled) {
    background-color: #2563eb;
  }
</style>
