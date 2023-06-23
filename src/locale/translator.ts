import { useRouter } from "next/router";
import { Dictionary, DICTIONARY } from "./dictionary";

export const useTranslation = () => {
  const { locales = [], defaultLocale, ...nextRouter } = useRouter();
  const locale = locales.includes(nextRouter.locale || "")
    ? nextRouter.locale
    : defaultLocale;

  return {
    translate: (term: string) => {
      const translation = DICTIONARY[locale!][term];

      return Boolean(translation) ? translation : term;
    },
  };
};

export const ssrI18n = (key: string, dictionary: Dictionary) => {
  return Object.keys(dictionary).reduce((keySet: any, locale) => {
    keySet[locale] = dictionary[locale as keyof typeof dictionary][key];
    return keySet;
  }, {});
};
