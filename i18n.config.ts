import type {AbstractIntlMessages} from 'next-intl';

export const locales = ['en', 'pt'] as const;
export const defaultLocale = 'pt' as const;

export default async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  return (await import(`./messages/${locale}.json`)).default;
}
