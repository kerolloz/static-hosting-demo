export namespace CaddyApi {
  const CADDY_BASE_URL = 'http://localhost:2019';

  type CaddyStaticSiteConfig = {
    rootPath: string;
    domain: string;
  };

  export const createStaticHosting = async (config: CaddyStaticSiteConfig) => {
    return fetch(`${CADDY_BASE_URL}/config/apps/http/servers/srv0/routes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        handle: [
          {
            handler: 'subroute',
            routes: [
              {
                handle: [
                  {
                    handler: 'vars',
                    root: config.rootPath,
                  },
                  { handler: 'file_server' },
                ],
              },
            ],
          },
        ],
        match: [{ host: [config.domain] }],
      }),
    });
  };
}
