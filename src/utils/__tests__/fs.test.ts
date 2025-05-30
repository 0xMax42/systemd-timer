import {
    assertEquals,
    assertExists,
    assertStringIncludes,
} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { stub } from 'https://deno.land/std@0.224.0/testing/mock.ts';
import { exists } from 'https://deno.land/std@0.224.0/fs/mod.ts';
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
    ) as { servicePath: string; timerPath: string };

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

Deno.test('writeUnitFiles: Fehler beim Schreiben der .timer-Datei führt zu Rollback', async () => {
    const tmp = await Deno.makeTempDir();

    const options: TimerOptions = {
        output: tmp,
        user: false,
        exec: '/bin/true',
        calendar: 'never',
    };

    const name = 'fail-timer';
    const serviceContent = '[Service]\nExecStart=/bin/true';
    const timerContent = '[Timer]\nOnCalendar=never';

    const servicePath = join(tmp, `${name}.service`);
    const timerPath = join(tmp, `${name}.timer`);

    // Simuliere: Schreiben der .timer-Datei schlägt fehl
    const originalWrite = Deno.writeTextFile;
    const writeStub = stub(
        Deno,
        'writeTextFile',
        async (path: string | URL, data: string | ReadableStream<string>) => {
            if (typeof path === 'string' && path.endsWith('.timer')) {
                throw new Error('Simulierter Schreibfehler');
            } else {
                return await originalWrite(path, data);
            }
        },
    );

    const result = await writeUnitFiles(
        name,
        serviceContent,
        timerContent,
        options,
    );

    // Erwartung: Funktion gibt undefined zurück
    assertEquals(result, undefined);

    // Erwartung: Beide Dateien wurden gelöscht (Rollback)
    assertEquals(await exists(servicePath), false);
    assertEquals(await exists(timerPath), false);

    writeStub.restore();
});

Deno.test('writeUnitFiles: Fehler beim Schreiben der .service-Datei verhindert Folgeaktionen', async () => {
    const tmp = await Deno.makeTempDir();

    const options: TimerOptions = {
        output: tmp,
        user: false,
        exec: '/bin/true',
        calendar: 'weekly',
    };

    const name = 'fail-service';
    const serviceContent = '[Service]\nExecStart=/bin/true';
    const timerContent = '[Timer]\nOnCalendar=weekly';

    const servicePath = join(tmp, `${name}.service`);
    const timerPath = join(tmp, `${name}.timer`);

    // Simuliere: Fehler beim Schreiben der .service-Datei
    const writeStub = stub(
        Deno,
        'writeTextFile',
        (path: string | URL, _data: string | ReadableStream<string>) => {
            if (typeof path === 'string' && path.endsWith('.service')) {
                throw new Error('Simulierter Service-Schreibfehler');
            }
            return Promise.resolve();
        },
    );

    const result = await writeUnitFiles(
        name,
        serviceContent,
        timerContent,
        options,
    );

    // Erwartung: Funktion gibt undefined zurück
    assertEquals(result, undefined);

    // Erwartung: Es wurden keine Dateien angelegt
    assertEquals(await exists(servicePath), false);
    assertEquals(await exists(timerPath), false);

    writeStub.restore();
});

Deno.test('writeUnitFiles: beide Dateien geschrieben, danach Fehler → vollständiger Rollback', async () => {
    const tmp = await Deno.makeTempDir();

    const options: TimerOptions = {
        output: tmp,
        user: false,
        exec: '/bin/true',
        calendar: 'never',
    };

    const name = 'fail-after-write';
    const serviceContent = '[Service]\nExecStart=/bin/true';
    const timerContent = '[Timer]\nOnCalendar=never';

    const servicePath = join(tmp, `${name}.service`);
    const timerPath = join(tmp, `${name}.timer`);

    let writeCount = 0;
    const originalWriteTextFile = Deno.writeTextFile;

    const writeStub = stub(
        Deno,
        'writeTextFile',
        async (path: string | URL, data: string | ReadableStream<string>) => {
            if (typeof path !== 'string') {
                throw new Error('Unerwarteter Pfadtyp');
            }

            // Simuliere beide Schreibvorgänge, aber wirf nach dem zweiten eine Exception
            writeCount++;

            await originalWriteTextFile(path, data); // wirklich schreiben

            if (writeCount === 2) {
                throw new Error(
                    'Simulierter Fehler nach vollständigem Schreiben',
                );
            }
        },
    );

    const result = await writeUnitFiles(
        name,
        serviceContent,
        timerContent,
        options,
    );

    // Erwartung: Funktion gibt undefined zurück
    assertEquals(result, undefined);

    // Erwartung: Beide Dateien wurden wieder entfernt
    assertEquals(await exists(servicePath), false);
    assertEquals(await exists(timerPath), false);

    writeStub.restore();
});

Deno.test('writeUnitFiles: Rollback schlägt fehl, wenn Dateien nicht gelöscht werden können', async () => {
    const tmp = await Deno.makeTempDir();

    const options: TimerOptions = {
        output: tmp,
        user: false,
        exec: '/bin/true',
        calendar: 'never',
    };

    const name = 'rollback-error';
    const serviceContent = '[Service]\nExecStart=/bin/true';
    const timerContent = '[Timer]\nOnCalendar=never';

    const servicePath = join(tmp, `${name}.service`);
    const timerPath = join(tmp, `${name}.timer`);

    // Originale Methoden sichern
    const originalWriteTextFile = Deno.writeTextFile;
    const originalRemove = Deno.remove;

    let writeCount = 0;

    const writeStub = stub(
        Deno,
        'writeTextFile',
        async (path: string | URL, data: string | ReadableStream<string>) => {
            writeCount++;
            await originalWriteTextFile(path, data);
            if (writeCount === 2) {
                throw new Error('Fehler nach vollständigem Schreiben');
            }
        },
    );

    const removeStub = stub(
        Deno,
        'remove',
        // deno-lint-ignore require-await
        async (_path: string | URL, _opts?: Deno.RemoveOptions) => {
            throw new Error('Löschen verboten!');
        },
    );

    // capture console output
    const logs: string[] = [];
    const consoleStub = stub(console, 'error', (...args) => {
        logs.push(args.map((a) => String(a)).join(' '));
    });

    const result = await writeUnitFiles(
        name,
        serviceContent,
        timerContent,
        options,
    );
    assertEquals(result, undefined);

    // Dateien existieren noch, weil löschen fehlschlug
    assertEquals(await exists(servicePath), true);
    assertEquals(await exists(timerPath), true);

    // Fehlerausgabe enthält "rollback_failed"
    const combinedLogs = logs.join('\n');
    assertStringIncludes(combinedLogs, 'rollback_failed');

    // Cleanup
    writeStub.restore();
    removeStub.restore();
    consoleStub.restore();
});
