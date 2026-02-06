import { assert, assertStringIncludes } from '@std/assert';
import { TimerOptions } from '../../types/mod.ts';
import { generateUnits } from '../unit-generator.ts';

Deno.test('generateUnits erzeugt Basis-Service und Timer korrekt', () => {
    const opts: TimerOptions = {
        exec: '/usr/bin/my-script',
        calendar: 'daily',
    };
    const { serviceUnit, timerUnit } = generateUnits('myjob', opts);

    assertStringIncludes(serviceUnit, 'ExecStart=/usr/bin/my-script');
    assertStringIncludes(timerUnit, 'OnCalendar=daily');
    assertStringIncludes(timerUnit, '[Install]');
});

Deno.test('generateUnits setzt Beschreibung aus Option', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        description: 'Meine Unit',
    };
    const { serviceUnit } = generateUnits('job', opts);

    assertStringIncludes(serviceUnit, 'Description=Meine Unit');
});

Deno.test('generateUnits berücksichtigt after=', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        after: ['network-online.target', 'docker.service'],
    };
    const { serviceUnit } = generateUnits('job', opts);

    assertStringIncludes(serviceUnit, 'After=network-online.target');
    assertStringIncludes(serviceUnit, 'After=docker.service');
});

Deno.test('generateUnits berücksichtigt environment und logfile', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        environment: ['FOO=bar', 'DEBUG=1'],
        logfile: '/var/log/job.log',
    };
    const { serviceUnit } = generateUnits('job', opts);

    assertStringIncludes(serviceUnit, 'Environment=FOO=bar');
    assertStringIncludes(serviceUnit, 'Environment=DEBUG=1');
    assertStringIncludes(serviceUnit, 'StandardOutput=append:/var/log/job.log');
    assertStringIncludes(serviceUnit, 'StandardError=append:/var/log/job.log');
});

Deno.test('generateUnits berücksichtigt runAs', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        runAs: 'myuser',
    };
    const { serviceUnit } = generateUnits('job', opts);

    assertStringIncludes(serviceUnit, 'User=myuser');
});

Deno.test('generateUnits berücksichtigt home', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        home: '/home/myuser',
    };
    const { serviceUnit } = generateUnits('job', opts);

    assertStringIncludes(serviceUnit, 'Environment=HOME=/home/myuser');
});

Deno.test('generateUnits berücksichtigt cwd', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        cwd: '/srv/app',
    };
    const { serviceUnit } = generateUnits('job', opts);

    assertStringIncludes(serviceUnit, 'WorkingDirectory=/srv/app');
});

Deno.test('generateUnits verwendet default.target bei User-Timern', () => {
    const opts: TimerOptions = {
        exec: '/bin/true',
        calendar: 'daily',
        user: true,
    };
    const { timerUnit } = generateUnits('job', opts);

    assertStringIncludes(timerUnit, 'WantedBy=default.target');
});

Deno.test('generateUnits ignoriert runAs bei --user', () => {
    const opts = {
        exec: '/bin/true',
        calendar: 'daily',
        user: true,
        runAs: 'should-not-appear',
    };

    const { serviceUnit } = generateUnits('job', opts);

    assert(
        !serviceUnit.includes('User=should-not-appear'),
        'User= sollte bei --user nicht enthalten sein',
    );
});
