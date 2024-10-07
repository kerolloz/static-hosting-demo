export namespace CaddyApi {

  const CADDY_BASE_URL = 'http://localhost:2019';

  export const reloadConfig = async (fileContent: string) => {
    return fetch(`${CADDY_BASE_URL}/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/caddyfile', },
      body: fileContent,
    });

  }
}