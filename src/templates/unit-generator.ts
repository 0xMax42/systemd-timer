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
            console.log(`Service Unit geschrieben in: ${servicePath}`);
            console.log(`Timer Unit geschrieben in: ${timerPath}`);
        } else {
            return;
        }

        console.log(`\nℹ️  Hinweis:`);

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
        ...(options.environment?.map((e) => `Environment=${e}`) ?? []),
    ];

    if (options.logfile) {
        unitParts.push(`StandardOutput=append:${options.logfile}`);
        unitParts.push(`StandardError=append:${options.logfile}`);
    }

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
        `WantedBy=timers.target`,
    ];

    const timerUnit = timerParts.join('\n');

    return { serviceUnit, timerUnit };
}
