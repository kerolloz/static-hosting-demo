<script lang="ts">
  import { BACKEND_BASE_URI } from "../lib/api";

  const createZipFileDeployment = (e: SubmitEvent) => {
    // Send a multipart/form-data request to the backend
    const formData = new FormData();
    const target = e.target as HTMLFormElement;
    const fileInput = target[0] as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("file", fileInput.files[0]);
    } else {
      alert("No file selected");
      return;
    }
    fetch(`${BACKEND_BASE_URI}/deployments/zip`, {
      method: "POST",
      body: formData,
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
  <h1 class="text-4xl font-bold mb-6">Create a new ZIP file deployment</h1>
  <form
    on:submit|preventDefault={createZipFileDeployment}
    class="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md"
  >
    <div class="mb-6">
      <label for="file" class="block text-sm font-medium mb-2 text-left"
        >Upload ZIP File</label
      >
      <input
        type="file"
        name="file"
        id="file"
        class="w-full px-4 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        accept=".zip"
        required
      />
    </div>
    <button
      type="submit"
      class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      >Deploy</button
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

  button:hover {
    background-color: #2563eb;
  }
</style>
