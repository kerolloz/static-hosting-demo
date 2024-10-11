<script lang="ts">
  const createGitDeployment = (e: SubmitEvent) => {
    // Send a JSON request to the backend
    const target = e.target as HTMLFormElement;
    const repoUrlInput = target[0] as HTMLInputElement;
    const branchInput = target[1] as HTMLInputElement;
    const buildCommandInput = target[2] as HTMLInputElement;
    const outputDirInput = target[3] as HTMLInputElement;

    const repoUrl = repoUrlInput.value;
    const branch = branchInput.value || "main";
    const buildCommand =
      buildCommandInput.value || "npm install && npm run build";
    const outputDir = outputDirInput.value || "dist";

    if (!repoUrl) {
      alert("Repository URL is required");
      return;
    }

    fetch("http://localhost:3000/deployments/git", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl, branch, buildCommand, outputDir }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Deployment created successfully");
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
    class="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-md"
  >
    <div class="mb-4">
      <label for="repoUrl" class="block text-sm font-medium mb-2"
        >Repository URL</label
      >
      <input
        type="url"
        name="repoUrl"
        id="repoUrl"
        class="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
        required
      />
    </div>
    <div class="mb-4">
      <label for="branch" class="block text-sm font-medium mb-2"
        >Branch (optional, defaults to 'main')</label
      >
      <input
        type="text"
        name="branch"
        id="branch"
        class="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>
    <div class="mb-4">
      <label for="buildCommand" class="block text-sm font-medium mb-2"
        >Build Command (optional, defaults to 'npm install && npm run build')</label
      >
      <input
        type="text"
        name="buildCommand"
        id="buildCommand"
        class="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>
    <div class="mb-4">
      <label for="outputDir" class="block text-sm font-medium mb-2"
        >Output Directory (optional, defaults to 'dist')</label
      >
      <input
        type="text"
        name="outputDir"
        id="outputDir"
        class="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>
    <button
      type="submit"
      class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >Deploy</button
    >
  </form>
</main>
