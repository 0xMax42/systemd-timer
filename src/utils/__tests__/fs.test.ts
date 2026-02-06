import { assertEquals, assertExists, assertStringIncludes } from '@std/assert';
import { stub } from '@std/testing/mock';
import { exists } from '@std/fs';
import { join } from '@std/path';
import { resolveUnitTargetPath, writeUnitFiles } from '../mod.ts';
import { TimerOptions } from '../../types/options.ts';

Deno.test(
    'writeUnitFiles: writes .service and .timer files correctly',
    async () => {
        const tmp = await Deno.makeTempDir({ prefix: 'test-units-' });

        const options = {
            output: tmp,
            user: false,
        };

        const name = 'test-backup';
        const serviceContent = '[Service]\nExecStart=/bin/true';
        const timerContent = '[Timer]\nOnCalendar=daily';

        const { servicePath, timerPath } = (await writeUnitFiles(
            name,
            serviceContent,
            timerContent,
            options as TimerOptions,
        )) as { servicePath: string; timerPath: string };

        // Check file paths
        assertEquals(servicePath, join(tmp, 'test-backup.service'));
        assertEquals(timerPath, join(tmp, 'test-backup.timer'));

        // Check if files exist
        assertExists(await Deno.stat(servicePath));
        assertExists(await Deno.stat(timerPath));

        // Check if file contents match expectations
        const readService = await Deno.readTextFile(servicePath);
        const readTimer = await Deno.readTextFile(timerPath);

        assertStringIncludes(readService, 'ExecStart=/bin/true');
        assertStringIncludes(readTimer, 'OnCalendar=daily');
    },
);

Deno.test('resolveUnitTargetPath: with --output', () => {
    const result = resolveUnitTargetPath({ output: '/tmp/units', user: false });
    assertEquals(result, '/tmp/units');
});

Deno.test('resolveUnitTargetPath: with --user and no output', () => {
    Deno.env.set('HOME', '/home/maxp');
    const result = resolveUnitTargetPath({ output: undefined, user: true });
    assertEquals(result, '/home/maxp/.config/systemd/user');
});

Deno.test('resolveUnitTargetPath: with no output and no user', () => {
    const result = resolveUnitTargetPath({ output: undefined, user: false });
    assertEquals(result, '/etc/systemd/system');
});

Deno.test(
    'writeUnitFiles: error writing .timer file triggers rollback',
    async () => {
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

        // Simulate: writing the .timer file fails
        const originalWrite = Deno.writeTextFile;
        const writeStub = stub(
            Deno,
            'writeTextFile',
            async (
                path: string | URL,
                data: string | ReadableStream<string>,
            ) => {
                if (typeof path === 'string' && path.endsWith('.timer')) {
                    throw new Error('Simulated write error');
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

        // Expect: function returns undefined
        assertEquals(result, undefined);

        // Expect: both files have been deleted (rollback)
        assertEquals(await exists(servicePath), false);
        assertEquals(await exists(timerPath), false);

        writeStub.restore();
    },
);

Deno.test(
    'writeUnitFiles: error writing .service file prevents further actions',
    async () => {
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

        // Simulate: error writing the .service file
        const writeStub = stub(
            Deno,
            'writeTextFile',
            (path: string | URL, _data: string | ReadableStream<string>) => {
                if (typeof path === 'string' && path.endsWith('.service')) {
                    throw new Error('Simulated service write error');
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

        // Expect: function returns undefined
        assertEquals(result, undefined);

        // Expect: no files were created
        assertEquals(await exists(servicePath), false);
        assertEquals(await exists(timerPath), false);

        writeStub.restore();
    },
);

Deno.test(
    'writeUnitFiles: both files written, then error → full rollback',
    async () => {
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
            async (
                path: string | URL,
                data: string | ReadableStream<string>,
            ) => {
                if (typeof path !== 'string') {
                    throw new Error('Unexpected path type');
                }

                // Simulate both writes, then throw an error after the second
                writeCount++;

                await originalWriteTextFile(path, data);

                if (writeCount === 2) {
                    throw new Error('Simulated error after full write');
                }
            },
        );

        const result = await writeUnitFiles(
            name,
            serviceContent,
            timerContent,
            options,
        );

        // Expect: function returns undefined
        assertEquals(result, undefined);

        // Expect: both files were removed
        assertEquals(await exists(servicePath), false);
        assertEquals(await exists(timerPath), false);

        writeStub.restore();
    },
);

Deno.test(
    'writeUnitFiles: rollback fails if files cannot be deleted',
    async () => {
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

        const originalWriteTextFile = Deno.writeTextFile;
        const _originalRemove = Deno.remove;

        let writeCount = 0;

        const writeStub = stub(
            Deno,
            'writeTextFile',
            async (
                path: string | URL,
                data: string | ReadableStream<string>,
            ) => {
                writeCount++;
                await originalWriteTextFile(path, data);
                if (writeCount === 2) {
                    throw new Error('Error after full write');
                }
            },
        );

        const removeStub = stub(
            Deno,
            'remove',
            // deno-lint-ignore require-await
            async (_path: string | URL, _opts?: Deno.RemoveOptions) => {
                throw new Error('Deletion forbidden!');
            },
        );

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

        // Files still exist because deletion failed
        assertEquals(await exists(servicePath), true);
        assertEquals(await exists(timerPath), true);

        // Error output contains "rollback_failed"
        const combinedLogs = logs.join('\n');
        assertStringIncludes(combinedLogs, 'rollback_failed');

        writeStub.restore();
        removeStub.restore();
        consoleStub.restore();
    },
);
