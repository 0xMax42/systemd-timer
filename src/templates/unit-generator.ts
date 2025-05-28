import { t } from '../i18n/mod.ts';
import { TimerOptions } from '../types/mod.ts';
import { deriveNameFromExec, writeUnitFiles } from '../utils/mod.ts';

export async function generateUnitFiles(options: TimerOptions): Promise<void> {
    const name = options.name || deriveNameFromExec(options.exec);

    const { serviceUnit, timerUnit } = generateUnits(name, options);

    if (options.dryRun) {
        console.log(`===== ${name}.service =====`);
        console.log(serviceUnit);
        console.log(`\n===== ${name}.timer =====`);
        console.log(timerUnit);
    } else {
        const result = await writeUnitFiles(
            name,
            serviceUnit,
            timerUnit,
            options,
        );

        if (result) {
            const { servicePath, timerPath } = result;
            console.log(t('unit_written_service', { path: servicePath }));
            console.log(t('unit_written_timer', { path: timerPath }));
        } else {
            return;
        }

        console.log(t('hint_header'));

        if (options.user) {
            console.log(`  systemctl --user daemon-reload`);
            console.log(`  systemctl --user enable --now ${name}.timer`);
        } else {
            console.log(`  sudo systemctl daemon-reload`);
            console.log(`  sudo systemctl enable --now ${name}.timer`);
        }
    }
}

export function generateUnits(name: string, options: TimerOptions): {
    serviceUnit: string;
    timerUnit: string;
} {
    const unitParts = [
        `[Unit]`,
        `Description=${options.description ?? name}`,
        ...(options.after?.map((a) => `After=${a}`) ?? []),
        ``,
        `[Service]`,
        `Type=oneshot`,
        `ExecStart=${options.exec}`,
        ...(options.cwd ? [`WorkingDirectory=${options.cwd}`] : []),
        ...(options.environment?.map((e) => `Environment=${e}`) ?? []),
        ...(options.home ? [`Environment=HOME=${options.home}`] : []),
        ...(options.logfile
            ? [
                `StandardOutput=append:${options.logfile}`,
                `StandardError=append:${options.logfile}`,
            ]
            : []),
        ...(options.runAs && !options.user ? [`User=${options.runAs}`] : []),
    ];

    const serviceUnit = unitParts.join('\n');

    const timerParts = [
        `[Unit]`,
        `Description=Timer for ${name}`,
        ``,
        `[Timer]`,
        `OnCalendar=${options.calendar}`,
        `Persistent=true`,
        ``,
        `[Install]`,
        `WantedBy=${options.user ? 'default.target' : 'timers.target'}`,
    ];

    const timerUnit = timerParts.join('\n');

    return { serviceUnit, timerUnit };
}
