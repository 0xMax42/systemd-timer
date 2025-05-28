import { Command } from '@cliffy/command';
import { generateUnitFiles } from '../templates/unit-generator.ts';
import { TimerOptions } from '../types/options.ts';
import { t } from '../i18n/mod.ts';

export function createCommand() {
    return new Command()
        .description(t('cli_create_description'))
        .option(
            '--name <name:string>',
            t('option_name'),
        )
        .option(
            '--exec <cmd:string>',
            t('option_exec'),
            { required: true },
        )
        .option('--calendar <time:string>', t('option_calendar'), {
            required: true,
        })
        .option('--description <desc:string>', t('option_description'))
        .option('--user', t('option_user'))
        .option(
            '--run-as <user:string>',
            t('option_run_as'),
        )
        .option(
            '--home <path:string>',
            t('option_home'),
        )
        .option(
            '--cwd <path:string>',
            t('option_cwd'),
        )
        .option('--output <dir:string>', t('option_output'))
        .option(
            '--after <target:string>',
            t('option_after'),
            { collect: true },
        )
        .option(
            '--environment <env:string>',
            t('option_environment'),
            { collect: true },
        )
        .option(
            '--logfile <file:string>',
            t('option_logfile'),
        )
        .option('--dry-run', t('option_dry_run'))
        .action(async (options: TimerOptions) => {
            await generateUnitFiles(options);
        });
}
