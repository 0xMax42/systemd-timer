import { ValidationError } from '@cliffy/command';
import { t } from '../i18n/mod.ts';
import { existsSync } from '@std/fs';
import { resolve } from '@std/path';

/**
 * Collects repeated occurrences of the `--environment` CLI option and validates
 * that every entry adheres to `KEY=value` syntax.
 *
 * Cliffy calls this handler for *each* `--environment` argument. The previously
 * accumulated values are passed in via the `previous` parameter, allowing us to
 * build up the final array manually.
 *
 * @example
 * ```ts
 * // CLI invocation:
 * //   mycli --environment FOO=bar --environment BAZ=qux
 * const env = collectAndValidateEnv("FOO=bar");
 * const env2 = collectAndValidateEnv("BAZ=qux", env);
 * console.log(env2); // => ["FOO=bar", "BAZ=qux"]
 * ```
 *
 * @param value - Current `KEY=value` string supplied by the user.
 * @param previous - Array of values collected so far (defaults to an empty
 *   array on the first call).
 * @returns The updated array containing all validated `KEY=value` pairs.
 *
 * @throws {ValidationError} If the input does not match the required syntax
 *   The resulting error is caught by Cliffy, which
 *   will print a help message and terminate with a non-zero exit code.
 */
export function collectAndValidateEnv(
    value: string,
    previous: string[] = [],
): string[] {
    if (!/^\w+=.+/.test(value)) {
        throw new ValidationError(t('error_invalid_env', { value }));
    }
    previous.push(value);
    return previous;
}

/**
 * Normalises a given path to its absolute representation and optionally checks
 * whether it exists on the filesystem.
 *
 * @remarks
 * Because `--home`, `--cwd`, `--output`, and similar options may refer to files
 * or directories that *must* already exist, this helper performs the common
 * validation in a single place.
 *
 * @param value - Path provided by the user (absolute or relative).
 * @param mustExist - When `true`, the function asserts that the resolved path
 *   exists; otherwise, existence is not verified.
 * @returns The absolute path derived via {@linkcode resolve}.
 *
 * @throws {ValidationError}
 *  - If `value` is empty or not a string.
 *  - If `mustExist` is `true` **and** the resolved path cannot be found.
 */
export function validatePath(value: string, mustExist: boolean): string {
    if (!value || typeof value !== 'string') {
        throw new ValidationError(t('error_path_schold_not_be_empty'));
    }
    const abs = resolve(value);
    if (mustExist && !existsSync(abs)) {
        throw new ValidationError(t('error_path_not_found', { path: abs }));
    }
    return abs;
}

/**
 * Ensures that a mandatory CLI argument is not empty.
 *
 * @param value - Raw string supplied by the user.
 * @param label - Human-readable label identifying the option (used in error
 *   messages). Example: `"--exec"`.
 * @returns The original `value` if the validation passes.
 *
 * @throws {ValidationError} When `value` is `""`, `null`, `undefined`, or a
 *   non-string.
 */
export function validateNotEmpty(value: string, label: string): string {
    if (!value || typeof value !== 'string') {
        throw new ValidationError(
            t('error_value_should_not_be_empty', { label }),
        );
    }
    return value;
}

/**
 * Collects repeated occurrences of the `--after` CLI option, validating each
 * target unit name and returning the aggregated list.
 *
 * The validation performed here is intentionally minimal – it merely checks
 * that the argument is a non-empty string. Detailed identifier rules (ASCII
 * characters, digits, etc.) are enforced elsewhere by
 * {@link validateIdentifier} when appropriate.
 *
 * @param value - Unit name provided with the current `--after` occurrence.
 * @param previous - Accumulated array of unit names (defaults to an empty
 *   array).
 * @returns An array containing all validated `--after` values.
 *
 * @throws {ValidationError} If `value` is empty.
 */
export function collectAndValidateAfter(
    value: string,
    previous: string[] = [],
): string[] {
    if (!value || typeof value !== 'string') {
        throw new ValidationError(
            t('error_value_should_not_be_empty', { label: '--after' }),
        );
    }
    previous.push(value);
    return previous;
}

/**
 * Validates identifiers used in generated systemd unit file names (e.g.
 * service or timer names) and option flags like `--run-as`.
 *
 * @example
 * ```ts
 * validateIdentifier("backup_job", "--name");   // OK
 * validateIdentifier("foo.bar-baz", "--after"); // OK
 * validateIdentifier("oops$", "--name");        // throws ValidationError
 * ```
 *
 * @param value - The identifier string to validate.
 * @param label - The relevant option flag, forwarded to the error message so
 *   the user immediately sees which argument is wrong.
 * @returns The unchanged `value` when it satisfies the pattern.
 *
 * @throws {ValidationError} If `value` contains characters outside the allowed
 *   set of ASCII letters, digits, `.`, `_`, and `-`.
 */
export function validateIdentifier(value: string, label: string): string {
    if (!/^[A-Za-z0-9_.-]+$/.test(value)) {
        throw new ValidationError(
            t('error_invalid_identifier', { identifier: label, value }),
        );
    }
    return value;
}

/**
 * Validates a systemd OnCalendar expression by invoking `systemd-analyze calendar`
 * as a subprocess using a synchronous call. This avoids async overhead.
 *
 * @remarks
 * Requires a Linux environment with systemd available.
 *
 * @param value - Calendar expression to validate
 * @returns The original `value` if valid
 * @throws {ValidationError} If the expression is invalid or systemd rejects it
 */
export function validateSystemdCalendar(value: string): string {
    const command = new Deno.Command('systemd-analyze', {
        args: ['calendar', value],
        stdout: 'null',
        stderr: 'null',
    });

    const { success } = command.outputSync();

    if (!success) {
        throw new ValidationError(t('error_invalid_calendar', { value }));
    }

    return value;
}
