import { Command } from '@cliffy/command';
import { generateUnitFiles } from '../templates/unit-generator.ts';
import { TimerOptions } from '../types/options.ts';
import { t } from '../i18n/mod.ts';
import {
    collectAndValidateAfter,
    collectAndValidateEnv,
    validateIdentifier,
    validateNotEmpty,
    validatePath,
    validateSystemdCalendar,
} from '../utils/mod.ts';

export function createCommand() {
    return new Command()
        .description(t('cli_create_description'))
        .option(
            '--name <name:string>',
            t('option_name'),
            { value: (v) => validateIdentifier(v, '--name') },
        )
        .option(
            '--exec <cmd:string>',
            t('option_exec'),
            {
                required: true,
                value: (v) => validateNotEmpty(v, '--exec'),
            },
        )
        .option('--calendar <time:string>', t('option_calendar'), {
            required: true,
            value: validateSystemdCalendar,
        })
        .option('--description <desc:string>', t('option_description'))
        .option('--user', t('option_user'))
        .option(
            '--run-as <user:string>',
            t('option_run_as'),
            { value: (v) => validateNotEmpty(v, '--run-as') },
        )
        .option(
            '--home <path:string>',
            t('option_home'),
            { value: (v) => validatePath(v, true) },
        )
        .option(
            '--cwd <path:string>',
            t('option_cwd'),
            { value: (v) => validatePath(v, true) },
        )
        .option('--output <dir:string>', t('option_output'), {
            value: (v) => validatePath(v, false),
        })
        .option(
            '--after <target:string>',
            t('option_after'),
            { collect: true, value: collectAndValidateAfter },
        )
        .option(
            '--environment <env:string>',
            t('option_environment'),
            { collect: true, value: collectAndValidateEnv },
        )
        .option(
            '--logfile <file:string>',
            t('option_logfile'),
            { value: (v) => validatePath(v, false) },
        )
        .option('--dry-run', t('option_dry_run'))
        .action(async (options: TimerOptions) => {
            await generateUnitFiles(options);
        });
}
