import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/settings';

// This middleware intercepts requests to `/` and will redirect
// to one of the configured locales instead (e.g. `/en`)
// https://next-intl-docs.vercel.app/docs/routing/middleware
export default createMiddleware({
  defaultLocale,
  locales
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(pt|en)/:path*'
  ]
};
