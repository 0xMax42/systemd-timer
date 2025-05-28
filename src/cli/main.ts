import { Command } from '@cliffy/command';
import { getVersion } from '../utils/mod.ts';
import { t } from '../i18n/mod.ts';
import { createCommand } from './mod.ts';

export async function createCli() {
    return new Command()
        .name('systemd-timer')
        .version(await getVersion())
        .description(t('cli_description'))
        .command('create', createCommand());
}
