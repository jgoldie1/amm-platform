type TranslationMap = Record<string, string>;

const en: TranslationMap = {
  'accessibility.title': 'Accessibility',
  'accessibility.description': 'TRYAMM is designed to be usable across different abilities, devices, languages and connection qualities.',
  'accessibility.features': 'Accessibility Features',
  'accessibility.keyboardNav': 'Keyboard Navigation',
  'accessibility.keyboardNavDesc': 'Navigate core controls without requiring a mouse.',
  'accessibility.highContrastMode': 'High Contrast Mode',
  'accessibility.highContrastDesc': 'Increase visual contrast for supported interfaces.',
  'accessibility.largeTextMode': 'Large Text Mode',
  'accessibility.largeTextDesc': 'Increase text size for easier reading.',
  'accessibility.multiLanguage': 'Multi-Language',
  'accessibility.multiLanguageDesc': 'Use localized UI, captions and translation where available.',
  'accessibility.screenReader': 'Screen Reader Support',
  'accessibility.screenReaderDesc': 'Semantic structure and labels support major assistive technologies.',
  'accessibility.shortcuts': 'Keyboard Shortcuts',
};

const translations: Record<string, TranslationMap> = {
  en,
  es: { ...en, 'accessibility.title': 'Accesibilidad', 'accessibility.features': 'Funciones de accesibilidad', 'accessibility.shortcuts': 'Atajos de teclado' },
  fr: { ...en, 'accessibility.title': 'Accessibilité', 'accessibility.features': "Fonctions d’accessibilité", 'accessibility.shortcuts': 'Raccourcis clavier' },
  de: { ...en, 'accessibility.title': 'Barrierefreiheit', 'accessibility.features': 'Barrierefreiheitsfunktionen', 'accessibility.shortcuts': 'Tastenkürzel' },
  ht: { ...en, 'accessibility.title': 'Aksè pou tout moun', 'accessibility.features': 'Fonksyon aksesibilite', 'accessibility.shortcuts': 'Rakoursi klavye' },
  ja: { ...en, 'accessibility.title': 'アクセシビリティ', 'accessibility.features': 'アクセシビリティ機能', 'accessibility.shortcuts': 'キーボードショートカット' },
  zh: { ...en, 'accessibility.title': '无障碍', 'accessibility.features': '无障碍功能', 'accessibility.shortcuts': '键盘快捷键' },
  ru: { ...en, 'accessibility.title': 'Доступность', 'accessibility.features': 'Функции доступности', 'accessibility.shortcuts': 'Сочетания клавиш' },
};

export default translations;
