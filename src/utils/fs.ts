import { ensureDir, exists } from '@std/fs';
import { join } from '@std/path';
import { TimerOptions } from '../types/mod.ts';
import { t } from '../i18n/mod.ts';

export async function writeUnitFiles(
    name: string,
    serviceContent: string,
    timerContent: string,
    options: TimerOptions,
): Promise<{ servicePath: string; timerPath: string } | undefined> {
    const basePath = resolveUnitTargetPath(options);

    await ensureDir(basePath);

    const servicePath = join(basePath, `${name}.service`);
    const timerPath = join(basePath, `${name}.timer`);

    try {
        await Deno.writeTextFile(servicePath, serviceContent);
        await Deno.writeTextFile(timerPath, timerContent);
    } catch (error) {
        // Rollback: Remove any files that were written
        try {
            if (await exists(servicePath)) {
                await Deno.remove(servicePath);
            }
            if (await exists(timerPath)) {
                await Deno.remove(timerPath);
            }
        } catch (rollbackError) {
            console.error(t('rollback_failed'), rollbackError);
        }
        console.error(t('error_write_units'), error);
        return undefined;
    }

    return { servicePath, timerPath };
}

export function resolveUnitTargetPath(
    options: Pick<TimerOptions, 'output' | 'user'>,
): string {
    if (options.output) return options.output;
    if (options.user) return `${Deno.env.get('HOME')}/.config/systemd/user`;
    return '/etc/systemd/system';
}
