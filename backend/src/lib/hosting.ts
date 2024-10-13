export const STATIC_HOSTING_DIR = '/srv/static-hosting' as const;
export const STATIC_HOSTING_DOMAIN = 'lvh.me' as const;

export const getStaticHostingUrl = (subdomain: string) =>
  `http://${subdomain}.${STATIC_HOSTING_DOMAIN}`;
