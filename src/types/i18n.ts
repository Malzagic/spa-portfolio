/**
 * Internationalization Types
 * Defines the structure of our translation dictionaries.
 */
export type Dictionary = {
  navigation: {
    services: string;
    projects: string;
    process: string;
    about: string;
    contact: string;
  };
  hero: {
    title: string;
    highlight: string;
    suffix: string;
    subtitle: string;
  };
  // Add other sections as you expand your JSON files
  [key: string]: any;
};

export type I18nProps = {
  dict: Dictionary;
  lang: "pl" | "en";
};
