import { resolve } from '@std/path';
import { ValidationError } from '@cliffy/command';
import {
    collectAndValidateAfter,
    collectAndValidateEnv,
    validateIdentifier,
    validateNotEmpty,
    validatePath,
    validateSystemdCalendar,
} from '../mod.ts';
import { t } from '../../i18n/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test(
    'collectAndValidateEnv: throws ValidationError for invalid env format',
    () => {
        const invalidEnv = 'INVALID_ENV';
        assertThrows(
            () => collectAndValidateEnv(invalidEnv),
            ValidationError,
            t('error_invalid_env', { value: invalidEnv }),
        );
    },
);

Deno.test(
    'collectAndValidateEnv: returns collected array for valid env format',
    () => {
        const validEnv = 'KEY=value';
        const previous = ['EXISTING=env'];
        const result = collectAndValidateEnv(validEnv, previous);
        assertEquals(result, ['EXISTING=env', 'KEY=value']);
    },
);

Deno.test('collectAndValidateEnv: aggregates multiple calls', () => {
    const first = collectAndValidateEnv('FOO=bar');
    const second = collectAndValidateEnv('BAZ=qux', first);
    assertEquals(second, ['FOO=bar', 'BAZ=qux']);
});

Deno.test(
    'validatePath: returns absolute path for valid path without existence check',
    () => {
        const tmpDir = Deno.makeTempDirSync();
        const relativePath = `${tmpDir}/testfile.txt`;
        const result = validatePath(relativePath, false);
        assertEquals(result, resolve(relativePath));
    },
);

Deno.test(
    'validatePath: throws ValidationError for non‑existent path with existence check',
    () => {
        const tmpDir = Deno.makeTempDirSync();
        const nonExistentPath = `${tmpDir}/nonexistent.txt`;
        assertThrows(
            () => validatePath(nonExistentPath, true),
            ValidationError,
            t('error_path_not_found', { path: resolve(nonExistentPath) }),
        );
    },
);

Deno.test(
    'validatePath: returns absolute path for existing path with existence check',
    () => {
        const tmpDir = Deno.makeTempDirSync();
        const existingPath = `${tmpDir}/existing.txt`;
        Deno.writeTextFileSync(existingPath, 'test content');
        const result = validatePath(existingPath, true);
        assertEquals(result, resolve(existingPath));
    },
);

Deno.test('validatePath: throws ValidationError for empty path', () => {
    const invalidPath = '';
    assertThrows(
        () => validatePath(invalidPath, true),
        ValidationError,
        t('error_path_schold_not_be_empty'),
    );
});

Deno.test('validateNotEmpty: returns value for non‑empty string', () => {
    const input = 'some-value';
    const result = validateNotEmpty(input, '--exec');
    assertEquals(result, input);
});

Deno.test('validateNotEmpty: throws ValidationError for empty string', () => {
    const input = '';
    assertThrows(
        () => validateNotEmpty(input, '--exec'),
        ValidationError,
        t('error_value_should_not_be_empty', { label: '--exec' }),
    );
});

Deno.test('collectAndValidateAfter: returns aggregated array', () => {
    const first = collectAndValidateAfter('network.target');
    const second = collectAndValidateAfter('postgres.service', first);
    assertEquals(second, ['network.target', 'postgres.service']);
});

Deno.test(
    'collectAndValidateAfter: throws ValidationError for empty value',
    () => {
        assertThrows(
            () => collectAndValidateAfter(''),
            ValidationError,
            t('error_value_should_not_be_empty', { label: '--after' }),
        );
    },
);

Deno.test('validateIdentifier: returns value for valid identifier', () => {
    const id = 'backup_job-1';
    const result = validateIdentifier(id, '--name');
    assertEquals(result, id);
});

Deno.test(
    'validateIdentifier: throws ValidationError for invalid identifier',
    () => {
        const id = 'invalid$';
        assertThrows(
            () => validateIdentifier(id, '--name'),
            ValidationError,
            t('error_invalid_identifier', { label: '--name', value: id }),
        );
    },
);

Deno.test('validateSystemdCalendar: accepts valid expression', async () => {
    const valid = 'Mon..Fri 12:00';
    const result = await validateSystemdCalendar(valid);
    assertEquals(result, valid);
});

Deno.test('validateSystemdCalendar: rejects invalid expression', async () => {
    const invalid = 'Mo..Fr 12:00';
    await assertThrows(
        () => validateSystemdCalendar(invalid),
        ValidationError,
        t('error_invalid_calendar', { value: invalid }),
    );
});
