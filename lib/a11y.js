/* ============================================
   ACCESSIBILITY UTILITIES
   ============================================
   
   This file contains all accessibility functions:
   - Toggle high contrast mode
   - Toggle large text mode
   - Manage language settings
   - Handle keyboard shortcuts
   - Initialize accessibility settings
   
   All settings are saved to localStorage (browser storage)
   so they persist across page reloads.
*/

// ============================================
// 1. GET ACCESSIBILITY SETTINGS
// ============================================

/**
 * Get all accessibility settings from localStorage
 * Returns: { highContrast, largeText, language }
 */
export function getAccessibilitySettings() {
  if (typeof window === 'undefined') {
    return {
      highContrast: false,
      largeText: false,
      language: 'en',
    };
  }

  try {
    const stored = localStorage.getItem('a11y_settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading accessibility settings:', error);
  }

  return {
    highContrast: false,
    largeText: false,
    language: 'en',
  };
}

// ============================================
// 2. SAVE ACCESSIBILITY SETTINGS
// ============================================

/**
 * Save settings to localStorage
 */
function saveSettings(settings) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('a11y_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving accessibility settings:', error);
  }
}

// ============================================
// 3. TOGGLE HIGH CONTRAST MODE
// ============================================

/**
 * Toggle high contrast mode (black bg, yellow text)
 * Adds/removes 'high-contrast' class to body
 */
export function toggleHighContrast(enabled) {
  if (typeof document === 'undefined') return;

  const settings = getAccessibilitySettings();
  settings.highContrast = enabled;
  saveSettings(settings);

  if (enabled) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
}

// ============================================
// 4. TOGGLE LARGE TEXT MODE
// ============================================

/**
 * Toggle large text mode (25% bigger fonts)
 * Adds/removes 'large-text' class to body
 */
export function toggleLargeText(enabled) {
  if (typeof document === 'undefined') return;

  const settings = getAccessibilitySettings();
  settings.largeText = enabled;
  saveSettings(settings);

  if (enabled) {
    document.body.classList.add('large-text');
  } else {
    document.body.classList.remove('large-text');
  }
}

// ============================================
// 5. SET LANGUAGE
// ============================================

/**
 * Set language and save to localStorage
 * Triggers page re-render in React components
 */
export function setLanguage(lang) {
  const settings = getAccessibilitySettings();
  settings.language = lang;
  saveSettings(settings);

  // Dispatch custom event to notify components of language change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('languageChanged', { detail: { language: lang } })
    );
  }
}

// ============================================
// 6. INITIALIZE ACCESSIBILITY SETTINGS
// ============================================

/**
 * Initialize accessibility settings on page load
 * Applies saved user preferences
 */
export function initAccessibilitySettings() {
  if (typeof document === 'undefined') return;

  const settings = getAccessibilitySettings();

  // Apply high contrast if enabled
  if (settings.highContrast) {
    document.body.classList.add('high-contrast');
  }

  // Apply large text if enabled
  if (settings.largeText) {
    document.body.classList.add('large-text');
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
}

// ============================================
// 7. KEYBOARD SHORTCUTS
// ============================================

/**
 * Set up keyboard shortcuts (Alt + Key)
 * Alt+H = Home
 * Alt+M = Marketplace
 * Alt+S = Streaming
 * Alt+A = AI
 * Alt+C = Academy
 * Alt+X = Accessibility
 */
export function setupKeyboardShortcuts() {
  if (typeof window === 'undefined') return;

  const shortcuts = {
    h: '/',           // Home
    m: '/marketplace', // Marketplace
    s: '/streaming',   // Streaming
    a: '/ai',          // AI
    c: '/academy',     // Academy
    x: '/accessibility', // Accessibility
  };

  document.addEventListener('keydown', (event) => {
    // Check if Alt key is pressed
    if (event.altKey) {
      const key = event.key.toLowerCase();
      
      if (shortcuts[key]) {
        event.preventDefault();
        window.location.href = shortcuts[key];
      }
    }
  });
}

// ============================================
// 8. GET KEYBOARD SHORTCUTS TABLE
// ============================================

/**
 * Returns array of keyboard shortcuts for display in components
 */
export function getKeyboardShortcuts() {
  return [
    { key: 'Alt+H', description: 'Home', route: '/' },
    { key: 'Alt+M', description: 'Marketplace', route: '/marketplace' },
    { key: 'Alt+S', description: 'Streaming', route: '/streaming' },
    { key: 'Alt+A', description: 'AI Assistant', route: '/ai' },
    { key: 'Alt+C', description: 'Academy', route: '/academy' },
    { key: 'Alt+X', description: 'Accessibility', route: '/accessibility' },
    { key: 'Tab', description: 'Next element', route: null },
    { key: 'Shift+Tab', description: 'Previous element', route: null },
    { key: 'Enter', description: 'Activate button/link', route: null },
    { key: 'Esc', description: 'Close menus', route: null },
  ];
}

// ============================================
// 9. ANNOUNCE TO SCREEN READERS
// ============================================

/**
 * Announce changes to screen readers using ARIA live regions
 * Useful for dynamic content updates
 */
export function announceToScreenReader(message, priority = 'polite') {
  if (typeof document === 'undefined') return;

  // Create a live region if it doesn't exist
  let liveRegion = document.querySelector('[aria-live]');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = message;
}

// ============================================
// 10. CHECK FOR REDUCED MOTION PREFERENCE
// ============================================

/**
 * Check if user prefers reduced motion
 * Returns: true if user has prefers-reduced-motion enabled
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// END OF ACCESSIBILITY UTILITIES
// ============================================
