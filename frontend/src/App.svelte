<script>
  import { Route, Router } from "svelte-routing";
  import Index from "./pages/Index.svelte";
  import NewPage from "./pages/New.svelte";
  export const url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router {url}>
  <div
    class="w-screen h-full min-h-screen flex flex-col justify-center bg-slate-900 text-slate-100 my-auto text-center"
  >
    <Route path="/" component={Index} />
    <Route path="/new" component={NewPage} />

    <Route path="*">
      <h1 class="text-3xl text-white-600 bg-red-700 p-8">
        <span class="font-bold">404</span> Not Found!
      </h1>
    </Route>
  </div>
</Router>
