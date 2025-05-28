import { Command } from '@cliffy/command';
import { generateUnitFiles } from '../templates/unit-generator.ts';
import { TimerOptions } from '../types/options.ts';

export const createCommand = new Command()
    .description('Erzeugt eine systemd .service und .timer Unit')
    .option(
        '--name <name:string>',
        'Name der Unit-Dateien (optional, wird sonst aus dem Exec generiert)',
    )
    .option(
        '--exec <cmd:string>',
        'Kommando, das durch systemd ausgeführt werden soll',
        { required: true },
    )
    .option('--calendar <time:string>', 'OnCalendar-Ausdruck für den Timer', {
        required: true,
    })
    .option('--description <desc:string>', 'Beschreibung des Timers')
    .option('--user', 'Erstellt die Unit als User-Timer')
    .option(
        '--run-as <user:string>',
        'Führe den systemweiten Timer als bestimmter Benutzer aus (setzt User= in der Service-Unit)',
    )
    .option(
        '--home <path:string>',
        'HOME-Variable für den Service setzen',
    )
    .option(
        '--cwd <path:string>',
        'Arbeitsverzeichnis (WorkingDirectory) für den Service-Prozess',
    )
    .option('--output <dir:string>', 'Zielverzeichnis der Unit-Dateien')
    .option(
        '--after <target:string>',
        'Optionales After= für die Service-Unit',
        { collect: true },
    )
    .option(
        '--environment <env:string>',
        'Environment-Variablen im Format KEY=VALUE',
        { collect: true },
    )
    .option(
        '--logfile <file:string>',
        'Dateipfad für Log-Ausgabe (stdout/stderr)',
    )
    .option('--dry-run', 'Gibt die Unit-Dateien nur aus, ohne sie zu schreiben')
    .action(async (options: TimerOptions) => {
        await generateUnitFiles(options);
    });
