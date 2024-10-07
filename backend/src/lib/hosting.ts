export const STATIC_HOSTING_DIR =
  '/home/kerolloz/var/www/static-hosting' as const;
export const STATIC_HOSTING_DOMAIN = 'lvh.me' as const;

export const getStaticHostingUrl = (subdomain: string) =>
  `http://${subdomain}.${STATIC_HOSTING_DOMAIN}`;
