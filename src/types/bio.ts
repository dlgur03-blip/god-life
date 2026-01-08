export type Locale = 'ko' | 'en' | 'ja';

export type BioPostTranslation = {
  id: string;
  postId: string;
  locale: Locale;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BioPost = {
  id: string;
  slug: string;
  category: string;
  translations: BioPostTranslation[];
  createdAt: Date;
  updatedAt: Date;
};

// Flattened type for components (with resolved translation)
export type BioPostWithTranslation = {
  id: string;
  slug: string;
  category: string;
  title: string;
  content: string;
  locale: Locale;
  createdAt: Date;
  updatedAt: Date;
};

// Bio categories
export const BIO_CATEGORIES = [
  'Nutrition',
  'Supplements',
  'Recovery',
  'Exercise',
  'Mindset'
] as const;

export type BioCategory = typeof BIO_CATEGORIES[number];

// Translation input type for forms
export type TranslationInput = {
  title: string;
  content: string;
};
