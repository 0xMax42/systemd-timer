/**
 * Initializes the i18n module by loading
 * the appropriate locale file based on the system language.
 */
export async function initI18n(): Promise<void> {
    await loadLocale(getCurrentLanguage());
}

/**
 * Contains the loaded translations for the current language.
 * The keys represent i18n identifiers, the values are the localized strings.
 */
let translations: Record<string, string> = {};

/**
 * Loads the translation file for the specified locale.
 *
 * Expects a JSON file in the same directory named like `de.json` or `en.json`.
 * Falls back to English ('en') if the specified file does not exist.
 *
 * @param locale - The language code (e.g., 'de', 'en') to load
 * @returns Promise that resolves once the translations have been loaded
 */
export async function loadLocale(locale: string): Promise<void> {
    try {
        const localeUrl = new URL(`./${locale}.json`, import.meta.url);
        const file = await Deno.readTextFile(localeUrl);
        translations = JSON.parse(file);
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            console.warn(
                `Locale '${locale}' not found – falling back to 'en'.`,
            );
            if (locale !== 'en') {
                await loadLocale('en');
            }
        } else {
            console.error('Error loading translation file:', err);
        }
    }
}

/**
 * Translates a given key using the loaded translation data.
 * Replaces placeholders in the format `{variable}` with the provided values.
 *
 * @param key - The i18n key (e.g., 'timer_created')
 * @param vars - Optional replacements for placeholders in the string
 * @returns The translated string, or the key itself if no translation is found
 */
export function t(key: string, vars: Record<string, string> = {}): string {
    let text = translations[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

/**
 * Determines the current language from the system environment.
 *
 * Priority: SYSTEMD_TIMER_LANG > LC_ALL > LC_MESSAGES > LANG.
 *
 * @returns The language code (e.g., 'de', 'en'), defaults to 'en'
 */
export function getCurrentLanguage(): string {
    return (
        Deno.env.get('SYSTEMD_TIMER_LANG') ??
            Deno.env.get('LC_ALL') ??
            Deno.env.get('LC_MESSAGES') ??
            Deno.env.get('LANG') ??
            'en'
    ).split('.')[0].split('_')[0].toLowerCase();
}
