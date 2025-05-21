import { ensureDir, exists } from 'https://deno.land/std@0.224.0/fs/mod.ts';
import { join } from 'https://deno.land/std@0.224.0/path/mod.ts';
import { TimerOptions } from '../types/mod.ts';

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
            console.error('Rollback fehlgeschlagen:', rollbackError);
        }
        console.error('Fehler beim Schreiben der Units:', error);
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
