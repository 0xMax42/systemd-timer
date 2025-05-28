import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { getCurrentLanguage, loadLocale, t } from '../mod.ts';

Deno.test('loadLocale lade Deutsche Übersetzung', async () => {
    await loadLocale('de');
    assertEquals(
        t('error_write_units'),
        'Fehler beim Schreiben der Units:',
    );
    assertEquals(
        t('unit_written_service', { path: '/tmp/service' }),
        'Service Unit geschrieben in: /tmp/service',
    );
});

Deno.test('t gibt den Schlüssel zurück, wenn dieser nicht gefunden wird', () => {
    const result = t('non_existent_key');
    assertEquals(result, 'non_existent_key');
});

Deno.test('getCurrentLanguage gibt die Fallback Sprache zurück', () => {
    Deno.env.delete('SYSTEMD_TIMER_LANG');
    Deno.env.delete('LC_ALL');
    Deno.env.delete('LC_MESSAGES');
    Deno.env.delete('LANG');
    assertEquals(getCurrentLanguage(), 'en');
});

Deno.test('getCurrentLanguage nutz die `SYSTEMD_TIMER_LANG`, wenn gesetzt', () => {
    Deno.env.set('SYSTEMD_TIMER_LANG', 'de_DE.UTF-8');
    assertEquals(getCurrentLanguage(), 'de');
});
