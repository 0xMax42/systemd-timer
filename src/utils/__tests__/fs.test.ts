import {
    assertEquals,
    assertExists,
    assertStringIncludes,
} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { join } from 'https://deno.land/std@0.224.0/path/mod.ts';
import { resolveUnitTargetPath, writeUnitFiles } from '../mod.ts';
import { TimerOptions } from '../../types/options.ts';

Deno.test('writeUnitFiles schreibt .service und .timer korrekt', async () => {
    const tmp = await Deno.makeTempDir({ prefix: 'test-units-' });

    const options = {
        output: tmp,
        user: false,
    };

    const name = 'test-backup';
    const serviceContent = '[Service]\nExecStart=/bin/true';
    const timerContent = '[Timer]\nOnCalendar=daily';

    const { servicePath, timerPath } = await writeUnitFiles(
        name,
        serviceContent,
        timerContent,
        options as TimerOptions,
    );

    // Überprüfe Pfade
    assertEquals(servicePath, join(tmp, 'test-backup.service'));
    assertEquals(timerPath, join(tmp, 'test-backup.timer'));

    // Existieren Dateien?
    assertExists(await Deno.stat(servicePath));
    assertExists(await Deno.stat(timerPath));

    // Enthält die Datei den erwarteten Inhalt?
    const readService = await Deno.readTextFile(servicePath);
    const readTimer = await Deno.readTextFile(timerPath);

    assertStringIncludes(readService, 'ExecStart=/bin/true');
    assertStringIncludes(readTimer, 'OnCalendar=daily');
});

Deno.test('resolveUnitTargetPath mit --output', () => {
    const result = resolveUnitTargetPath({ output: '/tmp/units', user: false });
    assertEquals(result, '/tmp/units');
});

Deno.test('resolveUnitTargetPath mit --user ohne output', () => {
    Deno.env.set('HOME', '/home/maxp');
    const result = resolveUnitTargetPath({ output: undefined, user: true });
    assertEquals(result, '/home/maxp/.config/systemd/user');
});

Deno.test('resolveUnitTargetPath ohne output und ohne user', () => {
    const result = resolveUnitTargetPath({ output: undefined, user: false });
    assertEquals(result, '/etc/systemd/system');
});
