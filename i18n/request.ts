import {getRequestConfig} from 'next-intl/server';
import {defaultLocale} from './settings';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming locale is supported
  if (locale === undefined) {
    locale = defaultLocale;
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale
  };
});
